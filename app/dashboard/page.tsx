"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { useAuth } from "../contexts/AuthContext"
import { usePermissions } from "../hooks/usePermissions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from 
"@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } 
from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } 
from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } 
from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "AGENT" | "ASSISTANT"
}

export default function UserManagementPage() {
  const { user } = useAuth()
  const { isAdmin } = usePermissions()
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    role: "ASSISTANT",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value })
    } else {
      setNewUser({ ...newUser, [name]: value })
    }
  }

  const handleRoleChange = (value: "ADMIN" | "AGENT" | "ASSISTANT") => {
    if (editingUser) {
      setEditingUser({ ...editingUser, role: value })
    } else {
      setNewUser({ ...newUser, role: value })
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
      if (!response.ok) {
        throw new Error("Failed to add user")
      }
      await fetchUsers()
      setNewUser({
        name: "",
        email: "",
        role: "ASSISTANT",
      })
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "User added successfully.",
      })
    } catch (error) {
      console.error("Error adding user:", error)
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      })
      if (!response.ok) {
        throw new Error("Failed to update user")
      }
      await fetchUsers()
      setEditingUser(null)
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "User updated successfully.",
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        throw new Error("Failed to delete user")
      }
      await fetchUsers()
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isAdmin) {
    return <div>You do not have permission to access this page.</div>
  }

  return (
    <ProtectedRoute>
      <div className="p-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">User 
Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p>Manage user accounts here.</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingUser(null)
                      setNewUser({
                        name: "",
                        email: "",
                        role: "ASSISTANT",
                      })
                    }}
                  >
                    Add New User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingUser ? "Edit User" : "Add New 
User"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={editingUser ? handleEditUser : 
handleAddUser} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={editingUser ? editingUser.name : 
newUser.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={editingUser ? editingUser.email : 
newUser.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={editingUser ? editingUser.role : 
newUser.role}
                        onValueChange={(value: "ADMIN" | "AGENT" | 
"ASSISTANT") => handleRoleChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="AGENT">Agent</SelectItem>
                          <SelectItem 
value="ASSISTANT">Assistant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit">{editingUser ? "Update User" : 
"Add User"}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="mr-2"
                        onClick={() => {
                          setEditingUser(user)
                          setIsDialogOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => 
handleDeleteUser(user.id)}>
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


