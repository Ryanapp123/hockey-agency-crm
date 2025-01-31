"use client"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 
"@/components/ui/card"
import Link from "next/link"

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <ProtectedRoute>
      <div className="p-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome to your 
Dashboard</CardTitle>
            <CardDescription>
              Hello, {user?.name}! Your role is: {user?.role}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This is your Hockey Agency CRM dashboard. Here you can 
manage players, invoices, and potential clients.
            </p>
            <Button onClick={logout}>Logout</Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage your hockey players here.</p>
              <Link href="/players">
                <Button className="mt-4">View Players</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Handle billing and invoices for your clients.</p>
              <Link href="/invoices">
                <Button className="mt-4">Manage Invoices</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Potential Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Track and manage potential new clients.</p>
              <Button className="mt-4">View Potential Clients</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}


