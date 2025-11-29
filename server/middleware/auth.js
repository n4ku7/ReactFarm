import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = auth.slice(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.sub).select('-password')
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    if (allowedRoles.length === 0) return next()
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}

export const signToken = (user) => {
  const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d'
  return jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}
