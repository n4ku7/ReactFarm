import { Router } from 'express'
import db from '../db.js'
import { nanoid } from 'nanoid'

const router = Router()

// list feedbacks
router.get('/', async (req, res) => {
  await db.read()
  res.json(db.data.feedbacks || [])
})

// create feedback
router.post('/', async (req, res) => {
  const payload = req.body
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
  await db.read()
  db.data.feedbacks = db.data.feedbacks || []
  db.data.feedbacks.push(feedback)
  await db.write()
  res.status(201).json(feedback)
})

export default router
