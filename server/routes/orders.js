import { Router } from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'

const router = Router()

// list orders - role aware
router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role === 'admin') {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(200)
    return res.json(orders)
  }

  if (req.user.role === 'farmer') {
    // fetch products owned by farmer
    const products = await Product.find({ farmerId: String(req.user._id) }).select('_id')
    const pids = products.map((p) => p._id)
    const orders = await Order.find({ 'items.productId': { $in: pids } }).sort({ createdAt: -1 }).limit(200)
    return res.json(orders)
  }

  // buyer - return own orders
  const orders = await Order.find({ buyerId: String(req.user._id) }).sort({ createdAt: -1 }).limit(200)
  res.json(orders)
})

// create order - buyer only
router.post('/', authMiddleware, requireRole('buyer'), async (req, res) => {
  const payload = req.body
  payload.buyerId = String(req.user._id)
  const order = await Order.create(payload)
  res.status(201).json(order)
})

// update order status - admin only
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  const { status } = req.body
  if (!status) return res.status(400).json({ error: 'Status required' })
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!order) return res.status(404).json({ error: 'Not found' })
  res.json(order)
})

export default router
