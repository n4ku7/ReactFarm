import { Router } from 'express'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import db from '../db.js'
import { signToken, signRefreshToken, verifyRefreshToken, authMiddleware, requireRole } from '../middleware/auth.js'

const router = Router()

// list users (admin only)
router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
  await db.read()
  const users = (db.data.users || []).map(u => {
    const { password, ...rest } = u
    return rest
  })
  res.json(users.slice(0, 500))
})

// signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body
  console.log('[localRoutes/users] signup request', { name, email, role })
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  await db.read()
  const existing = (db.data.users || []).find(u => u.email === email)
  if (existing) return res.status(409).json({ error: 'Email already in use' })
  const hash = await bcrypt.hash(password, 10)
  const user = { id: nanoid(), name: name || null, email, password: hash, role: role || 'buyer', createdAt: new Date().toISOString() }
  // issue refresh token
  const refreshToken = signRefreshToken(user)
  user.refreshToken = refreshToken
  db.data.users.push(user)
  await db.write()
  const token = signToken(user)
  res.status(201).json({ token, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  await db.read()
  const user = (db.data.users || []).find(u => u.email === email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const refreshToken = signRefreshToken(user)
  user.refreshToken = refreshToken
  await db.write()
  const token = signToken(user)
  res.json({ token, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

// refresh access token
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' })
  const payload = verifyRefreshToken(refreshToken)
  if (!payload) return res.status(401).json({ error: 'Invalid refresh token' })
  await db.read()
  const user = (db.data.users || []).find(u => String(u.id) === String(payload.sub))
  if (!user) return res.status(401).json({ error: 'Invalid refresh token' })
  if (!user.refreshToken || user.refreshToken !== refreshToken) return res.status(401).json({ error: 'Refresh token revoked' })
  // rotate refresh token
  const newRefresh = signRefreshToken(user)
  user.refreshToken = newRefresh
  await db.write()
  const token = signToken(user)
  res.json({ token, refreshToken: newRefresh, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

// logout - revoke refresh token
router.post('/logout', authMiddleware, async (req, res) => {
  await db.read()
  const u = db.data.users.find(x => String(x.id) === String(req.user.id))
  if (u) {
    delete u.refreshToken
    await db.write()
  }
  res.status(204).end()
})

export default router
