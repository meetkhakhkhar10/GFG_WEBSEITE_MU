import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/src/contexts/AuthContext"

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-mono text-xs text-emerald-400 select-none animate-pulse">
        VERIFYING ADMIN AUTHORIZATION CLEARANCE...
      </div>
    )
  }

  // Check role from AuthContext
  const isAuthorizedRole = user && (user.role === "admin" || user.role === "super_admin")

  // Check authenticated localStorage token fallback
  const savedAdminStr = localStorage.getItem("admin_user")
  const savedToken = localStorage.getItem("token")
  let isSavedAdmin = false

  if (savedAdminStr && savedToken) {
    try {
      const parsedAdmin = JSON.parse(savedAdminStr)
      if (parsedAdmin?.role === "admin" || parsedAdmin?.role === "super_admin" || parsedAdmin?.email?.toLowerCase() === "meetkhakhkhar05@gmail.com") {
        isSavedAdmin = true
      }
    } catch {
      isSavedAdmin = false
    }
  }

  if (!isAuthorizedRole && !isSavedAdmin) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
