import "./globals.css"
import { Inter } from 'next/font/google'
import Header from "./components/Header"
import { Toaster } from "@/components/ui/toaster"
import { PlayersProvider } from "./contexts/PlayersContext"
import { AuthProvider } from "./contexts/AuthContext"
import type { Metadata } from "next"
import React from 'react'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hockey Agency CRM",
  description: "CRM system for managing hockey players and contracts",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PlayersProvider>
            <Header />
            {children}
            <Toaster />
          </PlayersProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
