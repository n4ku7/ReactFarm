import { Router } from 'express'
import db from '../db.js'
import { nanoid } from 'nanoid'

const router = Router()

router.get('/', async (req, res) => {
  await db.read()
  res.json(db.data.orders)
})

router.post('/', async (req, res) => {
  const order = { id: nanoid(), status: 'pending', ...req.body }
  db.data.orders.push(order)
  await db.write()
  res.status(201).json(order)
})

export default router
