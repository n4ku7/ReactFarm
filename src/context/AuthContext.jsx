import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // hydrate from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('ac_token')
    const savedUser = localStorage.getItem('ac_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signup = async (name, email, password, role = 'buyer') => {
    const res = await fetch('http://localhost:4000/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'Signup failed')
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('ac_token', data.token)
    localStorage.setItem('ac_user', JSON.stringify(data.user))
    return data
  }

  const login = async (email, password) => {
    const res = await fetch('http://localhost:4000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'Login failed')
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('ac_token', data.token)
    localStorage.setItem('ac_user', JSON.stringify(data.user))
    return data
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('ac_token')
    localStorage.removeItem('ac_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
