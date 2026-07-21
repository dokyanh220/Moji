# Moji - Ứng Dụng Chat Trực Tuyến (Real-time Chat App)

Moji là một ứng dụng trò chuyện trực tuyến toàn diện, cho phép người dùng kết nối, nhắn tin theo thời gian thực, quản lý bạn bè và các cuộc hội thoại.

## Tính Năng Chính
- **Xác thực người dùng:** Đăng ký, đăng nhập an toàn với JWT và mã hóa mật khẩu (Bcrypt).
- **Nhắn tin theo thời gian thực:** Giao tiếp tức thì không có độ trễ nhờ sức mạnh của Socket.io.
- **Quản lý bạn bè:** Gửi lời mời kết bạn, chấp nhận/từ chối và quản lý danh sách bạn bè.
- **Quản lý hội thoại:** Hỗ trợ tạo và xem lịch sử các cuộc hội thoại cá nhân.
- **Giao diện hiện đại & Thân thiện:** Thiết kế đáp ứng (responsive), hỗ trợ Emoji (Emoji-mart), và trải nghiệm người dùng mượt mà với Radix UI và Tailwind CSS.

## Công Nghệ Sử Dụng

### Frontend
- **Framework:** React 19, Vite
- **Styling:** Tailwind CSS 4, Radix UI
- **Quản lý State:** Zustand
- **Routing:** React Router v7
- **Giao tiếp Real-time:** Socket.io-client
- **Khác:** Lucide React (Icons), Emoji-mart (Biểu tượng cảm xúc), Axios, Zod, React Hook Form.

### Backend
- **Runtime & Framework:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Giao tiếp Real-time:** Socket.io
- **Xác thực:** JSON Web Token (JWT), Cookie-parser
- **Bảo mật:** Bcrypt (Mã hóa mật khẩu), Cors

## Yêu Cầu Cài Đặt
- **Node.js** (Khuyến nghị phiên bản 18 trở lên)
- **Bun** hoặc **npm** (Dự án hiện đang sử dụng Bun làm package manager chính)
- **MongoDB** (Local hoặc MongoDB Atlas)

## Hướng Dẫn Cài Đặt

### 1. Clone dự án về máy
```bash
git clone https://github.com/your-username/Moji.git
cd Moji
```

### 2. Cài đặt Backend
Di chuyển vào thư mục backend, cài đặt dependencies và thiết lập biến môi trường:
```bash
cd backend
bun install # hoặc npm install
```
Tạo file `.env` trong thư mục `backend` (tham khảo `.env.example` nếu có):
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```
Khởi động server backend:
```bash
bun run dev # hoặc npm run dev
```
Backend sẽ chạy tại `http://localhost:5001`.

### 3. Cài đặt Frontend
Mở một terminal mới, di chuyển vào thư mục frontend và cài đặt dependencies:
```bash
cd frontend
bun install # hoặc npm install
```
Tạo file `.env.development` trong thư mục `frontend`:
```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```
Khởi động ứng dụng frontend:
```bash
bun run dev # hoặc npm run dev
```
Frontend sẽ chạy tại `http://localhost:5173`.

## Kịch Bản Chạy Ứng Dụng
- Cả Backend và Frontend đều cần được chạy đồng thời để ứng dụng hoạt động đầy đủ tính năng.
- Truy cập `http://localhost:5173` trên trình duyệt để trải nghiệm Moji.
