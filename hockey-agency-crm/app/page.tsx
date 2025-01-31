"use client"
import { Suspense } from "react"
import PageContent from "./PageContent"
import AuthenticatedLayout from "./components/AuthenticatedLayout"

export default function Home() {
  return (
    <AuthenticatedLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <PageContent />
      </Suspense>
    </AuthenticatedLayout>
  )
}
