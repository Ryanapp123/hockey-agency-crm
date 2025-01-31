"use client"

import React, { useState, useEffect } from 'react'
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

interface Player {
  id: string
  name: string
  position: string
  team: string
  dateOfBirth: string
  height: number
  weight: number
  nationality: string
  stats: any
  contractStart: string | null
  contractEnd: string | null
  contractValue: number | null
}

export default function PlayersPage() {
  const { user } = useAuth()
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayer, setNewPlayer] = useState<Omit<Player, 'id'>>({
    name: '',
    position: '',
    team: '',
    dateOfBirth: '',
    height: 0,
    weight: 0,
    nationality: '',
    stats: {},
    contractStart: null,
    contractEnd: null,
    contractValue: null,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players')
      if (!response.ok) {
        throw new Error('Failed to fetch players')
      }
      const data = await response.json()
      setPlayers(data)
    } catch (error) {
      console.error('Error fetching players:', error)
      toast({
        title: "Error",
        description: "Failed to fetch players. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editingPlayer) {
      setEditingPlayer({ ...editingPlayer, [name]: value })
    } else {
      setNewPlayer({ ...newPlayer, [name]: value })
    }
  }

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlayer),
      })
      if (!response.ok) {
        throw new Error('Failed to add player')
      }
      await fetchPlayers()
      setNewPlayer({
        name: '',
        position: '',
        team: '',
        dateOfBirth: '',
        height: 0,
        weight: 0,
        nationality: '',
        stats: {},
        contractStart: null,
        contractEnd: null,
        contractValue: null,
      })
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Player added successfully.",
      })
    } catch (error) {
      console.error('Error adding player:', error)
      toast({
        title: "Error",
        description: "Failed to add player. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditPlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPlayer) return
    try {
      const response = await fetch('/api/players', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPlayer),
      })
      if (!response.ok) {
        throw new Error('Failed to update player')
      }
      await fetchPlayers()
      setEditingPlayer(null)
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Player updated successfully.",
      })
    } catch (error) {
      console.error('Error updating player:', error)
      toast({
        title: "Error",
        description: "Failed to update player. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePlayer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this player?')) return
    try {
      const response = await fetch('/api/players', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        throw new Error('Failed to delete player')
      }
      await fetchPlayers()
      toast({
        title: "Success",
        description: "Player deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting player:', error)
      toast({
        title: "Error",
        description: "Failed to delete player. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="p-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Players 
Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p>Manage your hockey players here.</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingPlayer(null); 
setNewPlayer({
                    name: '',
                    position: '',
                    team: '',
                    dateOfBirth: '',
                    height: 0,
                    weight: 0,
                    nationality: '',
                    stats: {},
                    contractStart: null,
                    contractEnd: null,
                    contractValue: null,
                  }) }}>
                    Add New Player
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingPlayer ? 'Edit Player' : 'Add New 
Player'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={editingPlayer ? handleEditPlayer : 
handleAddPlayer} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={editingPlayer ? editingPlayer.name : 
newPlayer.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        name="position"
                        value={editingPlayer ? editingPlayer.position : 
newPlayer.position}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="team">Team</Label>
                      <Input
                        id="team"
                        name="team"
                        value={editingPlayer ? editingPlayer.team : 
newPlayer.team}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={editingPlayer ? editingPlayer.dateOfBirth : 
newPlayer.dateOfBirth}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        value={editingPlayer ? editingPlayer.height : 
newPlayer.height}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        value={editingPlayer ? editingPlayer.weight : 
newPlayer.weight}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        name="nationality"
                        value={editingPlayer ? editingPlayer.nationality : 
newPlayer.nationality}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contractStart">Contract 
Start</Label>
                      <Input
                        id="contractStart"
                        name="contractStart"
                        type="date"
                        value={editingPlayer ? editingPlayer.contractStart 
|| '' : newPlayer.contractStart || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contractEnd">Contract End</Label>
                      <Input
                        id="contractEnd"
                        name="contractEnd"
                        type="date"
                        value={editingPlayer ? editingPlayer.contractEnd 
|| '' : newPlayer.contractEnd || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contractValue">Contract 
Value</Label>
                      <Input
                        id="contractValue"
                        name="contractValue"
                        type="number"
                        value={editingPlayer ? editingPlayer.contractValue 
|| '' : newPlayer.contractValue || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <Button type="submit">{editingPlayer ? 'Update Player' 
: 'Add Player'}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Player List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell>{player.team}</TableCell>
                    <TableCell>{new 
Date(player.dateOfBirth).toLocaleDateString()}</Table

