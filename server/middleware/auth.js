import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/User.js'
import db from '../db.js'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const REFRESH_SECRET = process.env.REFRESH_SECRET || (JWT_SECRET + '-refresh')

// authMiddleware supports both mongoose-backed users and the local JSON DB
export const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = auth.slice(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET)

    // prefer mongoose model when MONGODB_URI is configured
    if (process.env.MONGODB_URI) {
      const user = await User.findById(payload.sub).select('-password')
      if (!user) return res.status(401).json({ error: 'Unauthorized' })
      req.user = user
      return next()
    }

    // fallback: local JSON DB
    await db.read()
    const u = db.data.users.find((x) => String(x.id) === String(payload.sub))
    if (!u) return res.status(401).json({ error: 'Unauthorized' })
    // clone without password
    const { password, ...userSafe } = u
    req.user = userSafe
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
  const sub = user._id ? String(user._id) : String(user.id)
  return jwt.sign({ sub, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export const signRefreshToken = (user) => {
  const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES || '30d'
  const sub = user._id ? String(user._id) : String(user.id)
  return jwt.sign({ sub }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES })
}

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET)
  } catch (err) {
    return null
  }
}
