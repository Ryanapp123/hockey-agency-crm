import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } 
})
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { 
status: 400 })
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    // Generate JWT token
    const token = generateToken(user.id)

    // Return user data and token
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 
500 })
  }
}


