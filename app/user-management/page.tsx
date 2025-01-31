import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRole } from "@/app/middleware/checkRole"
import { hashPassword } from "@/lib/auth"

// GET all users
export async function GET(request: Request) {
  const roleCheck = await checkRole(request, ["ADMIN"])
  if (roleCheck) return roleCheck

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Error fetching users" }, { status: 
500 })
  }
}

// POST a new user
export async function POST(request: Request) {
  const roleCheck = await checkRole(request, ["ADMIN"])
  if (roleCheck) return roleCheck

  try {
    const { name, email, role, password } = await request.json()
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Error creating user" }, { status: 
500 })
  }
}

// PUT (update) a user
export async function PUT(request: Request) {
  const roleCheck = await checkRole(request, ["ADMIN"])
  if (roleCheck) return roleCheck

  try {
    const { id, name, email, role } = await request.json()
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Error updating user" }, { status: 
500 })
  }
}

// DELETE a user
export async function DELETE(request: Request) {
  const roleCheck = await checkRole(request, ["ADMIN"])
  if (roleCheck) return roleCheck

  try {
    const { id } = await request.json()
    await prisma.user.delete({
      where: { id },
    })
    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Error deleting user" }, { status: 
500 })
  }
}


