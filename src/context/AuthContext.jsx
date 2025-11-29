import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // hydrate from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('ac_token')
    const savedRefresh = localStorage.getItem('ac_refresh')
    const savedUser = localStorage.getItem('ac_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    } else if (!savedToken && savedRefresh) {
      // attempt to refresh the access token
      ;(async () => {
        try {
          const res = await fetch('/api/users/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: savedRefresh })
          })
          if (res.ok) {
            const data = await res.json()
            setToken(data.token)
            setRefreshToken(data.refreshToken)
            setUser(data.user)
            localStorage.setItem('ac_token', data.token)
            localStorage.setItem('ac_refresh', data.refreshToken)
            localStorage.setItem('ac_user', JSON.stringify(data.user))
          } else {
            // refresh failed, clear stored refresh
            localStorage.removeItem('ac_refresh')
          }
        } catch (err) {
          console.error('Failed to refresh token on startup', err)
          localStorage.removeItem('ac_refresh')
        }
      })()
    }
    setLoading(false)
  }, [])

  const signup = async (name, email, password, role = 'buyer') => {
    const res = await fetch('/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    })
    // read text then parse if non-empty to avoid JSON parse errors on empty responses
    const text = await res.text()
    let data = {}
    try {
      data = text ? JSON.parse(text) : {}
    } catch (err) {
      console.error('Failed to parse signup response as JSON', err, 'raw:', text)
      throw new Error('Unexpected server response')
    }
    if (!res.ok) throw new Error(data?.error || 'Signup failed')
    setToken(data.token)
    setRefreshToken(data.refreshToken)
    setUser(data.user)
    localStorage.setItem('ac_token', data.token)
    if (data.refreshToken) localStorage.setItem('ac_refresh', data.refreshToken)
    localStorage.setItem('ac_user', JSON.stringify(data.user))
    return data
  }

  const login = async (email, password) => {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const text = await res.text()
    let data = {}
    try {
      data = text ? JSON.parse(text) : {}
    } catch (err) {
      console.error('Failed to parse login response as JSON', err, 'raw:', text)
      throw new Error('Unexpected server response')
    }
    if (!res.ok) throw new Error(data?.error || 'Login failed')
    setToken(data.token)
    setRefreshToken(data.refreshToken)
    setUser(data.user)
    localStorage.setItem('ac_token', data.token)
    if (data.refreshToken) localStorage.setItem('ac_refresh', data.refreshToken)
    localStorage.setItem('ac_user', JSON.stringify(data.user))
    return data
  }

  const logout = () => {
    // attempt to revoke refresh token on backend
    const savedRefresh = localStorage.getItem('ac_refresh')
    if (savedRefresh) {
      fetch('/api/users/logout', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' } }).catch(() => {})
    }
    setToken(null)
    setRefreshToken(null)
    setUser(null)
    localStorage.removeItem('ac_token')
    localStorage.removeItem('ac_refresh')
    localStorage.removeItem('ac_user')
  }

  // wrapper to refresh access token using refresh token
  const refreshAccess = async () => {
    const savedRefresh = localStorage.getItem('ac_refresh')
    if (!savedRefresh) return false
    try {
      const res = await fetch('/api/users/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: savedRefresh })
      })
      if (!res.ok) return false
      const data = await res.json()
      setToken(data.token)
      setRefreshToken(data.refreshToken)
      setUser(data.user)
      localStorage.setItem('ac_token', data.token)
      localStorage.setItem('ac_refresh', data.refreshToken)
      localStorage.setItem('ac_user', JSON.stringify(data.user))
      return true
    } catch (err) {
      console.error('refreshAccess failed', err)
      return false
    }
  }

  // monkey-patch global fetch to add Authorization header and auto-refresh on 401
  useEffect(() => {
    const originalFetch = window.fetch.bind(window)
    const wrapped = async (input, init = {}) => {
      init.headers = init.headers || {}
      if (token) init.headers['Authorization'] = `Bearer ${token}`
      let res = await originalFetch(input, init)
      if (res.status === 401) {
        const ok = await refreshAccess()
        if (ok) {
          init.headers['Authorization'] = `Bearer ${localStorage.getItem('ac_token')}`
          res = await originalFetch(input, init)
        }
      }
      return res
    }
    window.fetch = wrapped
    return () => { window.fetch = originalFetch }
  }, [token])

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
