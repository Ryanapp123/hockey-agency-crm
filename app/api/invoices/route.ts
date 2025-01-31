import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET all invoices
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        player: {
          select: {
            name: true,
          },
        },
      },
    })
    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Error fetching invoices" }, { 
status: 500 })
  }
}

// POST a new invoice
export async function POST(req: Request) {
  try {
    const { playerId, amount, description, dueDate, isPaid } = await 
req.json()
    const invoice = await prisma.invoice.create({
      data: {
        playerId,
        amount,
        description,
        dueDate: new Date(dueDate),
        isPaid,
      },
    })
    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Error creating invoice" }, { 
status: 500 })
  }
}

// PUT (update) an invoice
export async function PUT(req: Request) {
  try {
    const { id, playerId, amount, description, dueDate, isPaid } = await 
req.json()
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        playerId,
        amount,
        description,
        dueDate: new Date(dueDate),
        isPaid,
      },
    })
    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json({ error: "Error updating invoice" }, { 
status: 500 })
  }
}

// DELETE an invoice
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await prisma.invoice.delete({
      where: { id },
    })
    return NextResponse.json({ message: "Invoice deleted successfully" })
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return NextResponse.json({ error: "Error deleting invoice" }, { 
status: 500 })
  }
}


