import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"
import { authService } from "@/services/authService"
import type { AuthState } from "@/types/store"
import { useChatStore } from "./useChatStore"

// Khóa chống gọi refresh song song
let refreshPromise: Promise<string> | null = null

// Decode JWT để lấy exp
const decodeJwt = (token: string) => {
  try {
    const [, payload] = token.split(".")
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

// Kiểm tra hết hạn hoặc sắp hết (skewSeconds: khoảng đệm)
const isExpired = (token: string, skewSeconds = 60) => {
  const decoded = decodeJwt(token)
  if (!decoded?.exp) return true
  const nowSec = Date.now() / 1000
  return decoded.exp - nowSec <= skewSeconds
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      setAccessToken: (accessToken: string) => {
        set({ accessToken })
      },

      clearState: () => {
        set({ accessToken: null, user: null })
        localStorage.clear()
        useChatStore.getState().reset()
      },

      signUp: async (username, password, email, firstName, lastName) => {
        try {
          set({ loading: true })
          await authService.signUp(username, password, email, firstName, lastName)
          toast.success("Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.")
        } catch (error) {
          console.error(error)
          toast.error("Đăng ký không thành công")
        } finally {
          set({ loading: false })
        }
      },

      signIn: async (username, password) => {
        try {
          set({ loading: true })
          localStorage.clear()
          useChatStore.getState().reset()
          const { accessToken, user } = await authService.signIn(username, password)
          /**
           * CÁCH 1:
           * Backend trả về Combo: [Token + User Info] cùng lúc.
           * -> Set state luôn, không cần gọi thêm API nào nữa.
           * -> Nhanh, chỉ tốn 1 Request.
           */
          set({ accessToken, user })

          /**
           * CÁCH 2:
           * Nếu Backend chỉ trả về mỗi [Token].
           * -> 1: Lưu token vào store.
           * -> 2: Dùng token đó gọi hàm fetchMe() để lấy thông tin User.
           * -> Chậm hơn, tốn 2 Requests.
           * get().setAccessToken(accessToken);
           * await get().fetchMe();
           */

          useChatStore.getState().fetchConversations()
          toast.success("Chào mừng bạn quay lại với Memo")
        } catch (error) {
          console.error(error)
          toast.error("Đăng nhập không thành công!")
          throw error
        } finally {
          set({ loading: false })
        }
      },

      signOut: async () => {
        try {
          get().clearState()
          await authService.signOut()
          toast.success("Logout thành công!")
        } catch (error) {
          console.error(error)
          toast.error("Lỗi xảy ra khi logout. Hãy thử lại!")
        }
      },

      fetchMe: async () => {
        try {
          set({ loading: true })
          const user = await authService.fetchMe()
          set({ user })
        } catch (error) {
          console.error(error)
          // Không xóa accessToken ngay nếu chỉ lỗi mạng
          set({ user: null })
          toast.error("Lỗi lấy dữ liệu người dùng.")
        } finally {
          set({ loading: false })
        }
      },

      // Refresh nhẹ, không set loading toàn cục
      refresh: async () => {
        try {
          const { accessToken, user } = get()

            // Nếu có token và chưa (sắp) hết hạn => không cần refresh
          if (accessToken && !isExpired(accessToken)) {
            // Nếu đã có token nhưng chưa có user (lần đầu reload) thì fetch user
            if (!user) {
              await get().fetchMe()
            }
            return
          }

          // Nếu đang có refreshPromise thì dùng lại (tránh song song)
          if (!refreshPromise) {
            refreshPromise = (async () => {
              try {
                const newToken = await authService.refresh()
                get().setAccessToken(newToken)
                return newToken
              } catch (error) {
                console.error("Refresh error:", error)
                // Hết hạn thực sự -> clear
                get().clearState()
                toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!")
                throw error
              } finally {
                refreshPromise = null
              }
            })()
          }

          await refreshPromise

          // Sau khi refresh thành công mà chưa có user thì gọi fetchMe
          if (!get().user) {
            await get().fetchMe()
          }
        } catch {
          // Đã toast bên trong
        }
      },
    }),
    {
      name: "memo-auth",
      // Persist chỉ những gì cần (không persist loading)
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      })
    }
  )
)