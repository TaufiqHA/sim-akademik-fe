"use client"

import { useAuth } from "@/hooks/use-auth"
import TuProdiDashboard from "./tu-prodi-dashboard"

export default function TuProdiPage() {
  const { user } = useAuth()

  if (!user || user.role_id !== 5) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-destructive">Access Denied</h2>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
      </div>
    )
  }

  return <TuProdiDashboard />
}
