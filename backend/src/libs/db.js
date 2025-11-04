<<<<<<< HEAD
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("Liên kết CSDL thành công!");
  } catch (error) {
    console.log("Lỗi khi kết nối CSDL:", error);
    process.exit(1);
  }
};
=======
import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.log('MongoDB connection failed: ', error)
    process.exit(1)
  }
}
>>>>>>> origin/master
