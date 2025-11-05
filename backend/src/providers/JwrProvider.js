import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

// Generate a signed JWT with a given ttl string (e.g. '5s', '30m', '14d')
const generateToken = (payload, secret, ttl) => {
  if (!secret) throw new Error('Missing secret')
  const token = jwt.sign(payload, secret, { expiresIn: ttl })
  return token
}

// Verify token (throws if invalid/expired)
const verifyToken = (token, secret) => {
  if (!secret) throw new Error('Missing secret')
  return jwt.verify(token, secret)
}

// Decode without verifying signature/expiry (for debug only)
const decodeToken = (token) => {
  if (!token) return null
  try {
    return jwt.decode(token)
  } catch {
    return null
  }
}

// Helper: compute remaining seconds until exp (returns negative if expired)
const getRemainingSeconds = (decoded) => {
  if (!decoded || !decoded.exp) return null
  const now = Math.floor(Date.now() / 1000)
  return decoded.exp - now
}

export const JwtProvider = {
  generateToken,
  verifyToken,
  decodeToken,
  getRemainingSeconds,
}