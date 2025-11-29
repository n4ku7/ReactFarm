import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

// Guard: redirect to login if not authenticated
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />
  return children
}

// Guard: check if user has required role(s)
export const RoleRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (!roles.includes(user.role)) return <Navigate to="/" />
  return children
}
