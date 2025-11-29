import { Router } from 'express'
import Order from '../models/Order.js'

const router = Router()

router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(200)
  res.json(orders)
})

router.post('/', async (req, res) => {
  const order = await Order.create(req.body)
  res.status(201).json(order)
})

export default router
