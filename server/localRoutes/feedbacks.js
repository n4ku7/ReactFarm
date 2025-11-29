import { Router } from 'express'
import { nanoid } from 'nanoid'
import db from '../db.js'

const router = Router()

// list feedbacks
router.get('/', async (req, res) => {
  await db.read()
  const items = (db.data.feedbacks || []).slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json(items)
})

// create feedback
router.post('/', async (req, res) => {
  const payload = req.body
  await db.read()
  const feedback = {
    id: nanoid(),
    name: payload.name || null,
    email: payload.email || null,
    topic: payload.topic || 'General',
    rating: payload.rating || null,
    message: payload.message || '',
    consent: !!payload.consent,
    createdAt: new Date().toISOString()
  }
  db.data.feedbacks = db.data.feedbacks || []
  db.data.feedbacks.push(feedback)
  await db.write()
  res.status(201).json(feedback)
})

export default router
