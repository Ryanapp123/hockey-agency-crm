import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET all players
export async function GET() {
  try {
    const players = await prisma.player.findMany()
    return NextResponse.json(players)
  } catch (error) {
    console.error("Error fetching players:", error)
    return NextResponse.json({ error: "Error fetching players" }, { 
status: 500 })
  }
}

// POST a new player
export async function POST(req: Request) {
  try {
    const playerData = await req.json()
    const player = await prisma.player.create({
      data: playerData,
    })
    return NextResponse.json(player, { status: 201 })
  } catch (error) {
    console.error("Error creating player:", error)
    return NextResponse.json({ error: "Error creating player" }, { status: 
500 })
  }
}

// PUT (update) a player
export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json()
    const player = await prisma.player.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json(player)
  } catch (error) {
    console.error("Error updating player:", error)
    return NextResponse.json({ error: "Error updating player" }, { status: 
500 })
  }
}

// DELETE a player
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await prisma.player.delete({
      where: { id },
    })
    return NextResponse.json({ message: "Player deleted successfully" })
  } catch (error) {
    console.error("Error deleting player:", error)
    return NextResponse.json({ error: "Error deleting player" }, { status: 
500 })
  }
}


