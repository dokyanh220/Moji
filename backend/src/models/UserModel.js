import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowerCase: true
  },
  hashPassword: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowerCase: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  avartarUrl: {
    type: String // đường dẫn
  },
  avatarId: {
    type: String // public_id cloudinary
  },
  bio: {
    type: String,
    maxlength: 500
  },
  phone: {
    type: String,
    sparse: true // cho phép null, không được trùng
  }
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)