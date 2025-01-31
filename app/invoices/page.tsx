"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from 
"@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } 
from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } 
from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

interface Invoice {
  id: string
  playerId: string
  playerName: string
  amount: number
  description: string
  dueDate: string
  isPaid: boolean
}

export default function InvoicesPage() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, "id" | 
"playerName">>({
    playerId: "",
    amount: 0,
    description: "",
    dueDate: "",
    isPaid: false,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | 
null>(null)
  const [players, setPlayers] = useState<{ id: string; name: string 
}[]>([])

  useEffect(() => {
    fetchInvoices()
    fetchPlayers()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices")
      if (!response.ok) {
        throw new Error("Failed to fetch invoices")
      }
      const data = await response.json()
      setInvoices(data)
    } catch (error) {
      console.error("Error fetching invoices:", error)
      toast({
        title: "Error",
        description: "Failed to fetch invoices. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players")
      if (!response.ok) {
        throw new Error("Failed to fetch players")
      }
      const data = await response.json()
      setPlayers(data)
    } catch (error) {
      console.error("Error fetching players:", error)
      toast({
        title: "Error",
        description: "Failed to fetch players. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | 
HTMLSelectElement>) => {
    const { name, value } = e.target
    if (editingInvoice) {
      setEditingInvoice({ ...editingInvoice, [name]: value })
    } else {
      setNewInvoice({ ...newInvoice, [name]: value })
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    if (editingInvoice) {
      setEditingInvoice({ ...editingInvoice, isPaid: checked })
    } else {
      setNewInvoice({ ...newInvoice, isPaid: checked })
    }
  }

  const handleAddInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice),
      })
      if (!response.ok) {
        throw new Error("Failed to add invoice")
      }
      await fetchInvoices()
      setNewInvoice({
        playerId: "",
        amount: 0,
        description: "",
        dueDate: "",
        isPaid: false,
      })
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Invoice added successfully.",
      })
    } catch (error) {
      console.error("Error adding invoice:", error)
      toast({
        title: "Error",
        description: "Failed to add invoice. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingInvoice) return
    try {
      const response = await fetch("/api/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingInvoice),
      })
      if (!response.ok) {
        throw new Error("Failed to update invoice")
      }
      await fetchInvoices()
      setEditingInvoice(null)
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Invoice updated successfully.",
      })
    } catch (error) {
      console.error("Error updating invoice:", error)
      toast({
        title: "Error",
        description: "Failed to update invoice. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return
    try {
      const response = await fetch("/api/invoices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        throw new Error("Failed to delete invoice")
      }
      await fetchInvoices()
      toast({
        title: "Success",
        description: "Invoice deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting invoice:", error)
      toast({
        title: "Error",
        description: "Failed to delete invoice. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="p-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Invoices 
Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p>Manage your invoices here.</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingInvoice(null)
                      setNewInvoice({
                        playerId: "",
                        amount: 0,
                        description: "",
                        dueDate: "",
                        isPaid: false,
                      })
                    }}
                  >
                    Add New Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingInvoice ? "Edit Invoice" : "Add 
New Invoice"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={editingInvoice ? handleEditInvoice : 
handleAddInvoice} className="space-y-4">
                    <div>
                      <Label htmlFor="playerId">Player</Label>
                      <select
                        id="playerId"
                        name="playerId"
                        value={editingInvoice ? editingInvoice.playerId : 
newInvoice.playerId}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      >
                        <option value="">Select a player</option>
                        {players.map((player) => (
                          <option key={player.id} value={player.id}>
                            {player.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={editingInvoice ? editingInvoice.amount : 
newInvoice.amount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        value={editingInvoice ? editingInvoice.description 
: newInvoice.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={editingInvoice ? editingInvoice.dueDate : 
newInvoice.dueDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isPaid"
                        checked={editingInvoice ? editingInvoice.isPaid : 
newInvoice.isPaid}
                        onCheckedChange={handleCheckboxChange}
                      />
                      <Label htmlFor="isPaid">Paid</Label>
                    </div>
                    <Button type="submit">{editingInvoice ? "Update 
Invoice" : "Add Invoice"}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.playerName}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>{new 
Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{invoice.isPaid ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="mr-2"
                        onClick={() => {
                          setEditingInvoice(invoice)
                          setIsDialogOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => 
handleDeleteInvoice(invoice.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}


