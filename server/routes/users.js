import { Router } from 'express'
import bcrypt from 'bcrypt'
import axios from 'axios'
import User from '../models/User.js'
import { signToken } from '../middleware/auth.js'

const router = Router()

// Verify reCAPTCHA token
const verifyRecaptcha = async (token) => {
  if (!token) return false
  const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe' // Google's test secret
  try {
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: RECAPTCHA_SECRET,
        response: token
      }
    })
    return response.data.success === true
  } catch (err) {
    console.error('reCAPTCHA verification error:', err)
    return false
  }
}

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
  // Use email as name if name is not provided
  const userName = name || email.split('@')[0]
  const user = await User.create({ name: userName, email, password: hash, role: role || 'buyer' })
  const token = signToken(user)
  res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } })
})

// login
router.post('/login', async (req, res) => {
  const { email, password, recaptchaToken } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  
  // Verify reCAPTCHA
  if (process.env.RECAPTCHA_SECRET_KEY) {
    const isValid = await verifyRecaptcha(recaptchaToken)
    if (!isValid) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' })
    }
  }
  
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = signToken(user)
  res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } })
})

// update user role (admin only)
router.put('/:id/role', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body
    if (!role || !['buyer', 'farmer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error('Error updating user role:', err)
    res.status(500).json({ error: 'Failed to update user role' })
  }
})

// delete user (admin only)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    
    // Prevent deleting yourself
    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ error: 'You cannot delete your own account' })
    }
    
    // Delete user and related data
    await User.findByIdAndDelete(userId)
    
    // Also delete related products and orders (optional - you might want to keep orders for records)
    const Product = (await import('../models/Product.js')).default
    const Order = (await import('../models/Order.js')).default
    
    await Product.deleteMany({ farmerId: String(userId) })
    await Order.deleteMany({ buyerId: userId })
    
    res.status(204).end()
  } catch (err) {
    console.error('Error deleting user:', err)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

export default router
