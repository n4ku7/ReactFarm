import { Router } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { signToken } from '../middleware/auth.js'

const router = Router()

// list users (admin only)
import { authMiddleware, requireRole } from '../middleware/auth.js'
router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
  const users = await User.find().select('-password').limit(500)
  res.json(users)
})

// signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const existing = await User.findOne({ email })
  if (existing) return res.status(409).json({ error: 'Email already in use' })
  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hash, role: role || 'buyer' })
  const token = signToken(user)
  res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } })
})

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = signToken(user)
  res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } })
})

export default router
