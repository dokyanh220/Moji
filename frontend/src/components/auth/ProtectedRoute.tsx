import { useAuthStore } from "@/stores/useAuthStore"
import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router"

const ProtectedRoute = () => {
  const { accessToken } = useAuthStore()
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Gọi refresh 1 lần – nếu token còn sống thì hàm refresh() sẽ tự bỏ qua (theo bản store đã tối ưu)
        await useAuthStore.getState().refresh()
      } finally {
        setInitializing(false)
      }
    }
    bootstrap()
  }, [])

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    )
  }

  if (!accessToken) {
    return (
      <Navigate
        to="/signin"
        replace
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
