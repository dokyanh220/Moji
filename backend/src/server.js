import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./libs/db.js"
import authRoute from "./routes/authRoute.js"
import userRoute from "./routes/userRoute.js"
import cookieParser from "cookie-parser"
import { protectedRoute } from "./middlewares/authMiddleware.js"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))

// middlewares
app.use(express.json())
app.use(cookieParser())

// public routes
app.use("/api/auth", authRoute)

// private routes
app.use(protectedRoute)
app.use("/api/users", userRoute)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`)
  })
})
