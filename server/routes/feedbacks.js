import { Router } from 'express'
import Feedback from '../models/Feedback.js'

const router = Router()

// list feedbacks
router.get('/', async (req, res) => {
  const items = await Feedback.find().sort({ createdAt: -1 }).limit(500)
  res.json(items)
})

// create feedback
router.post('/', async (req, res) => {
  const payload = req.body
  const feedback = await Feedback.create({
    name: payload.name || null,
    email: payload.email || null,
    topic: payload.topic || 'General',
    rating: payload.rating || null,
    message: payload.message || '',
    consent: !!payload.consent
  })
  res.status(201).json(feedback)
})

export default router
