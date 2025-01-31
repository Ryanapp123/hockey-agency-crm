import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10)
}

export const comparePasswords = async (password: string, hashedPassword: 
string) => {
  return await bcrypt.compare(password, hashedPassword)
}

export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET is not defined")
  }
  return jwt.sign({ userId }, secret, { expiresIn: "1d" })
}

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET is not defined")
  }
  try {
    return jwt.verify(token, secret) as { userId: string }
  } catch (error) {
    return null
  }
}


