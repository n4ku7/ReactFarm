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
  try {
    const payload = req.body || {}
    // basic validation
    if (!Array.isArray(payload.items) || payload.items.length === 0) return res.status(400).json({ error: 'No items in order' })
    // normalize items: ensure productId, quantity and price present
    const items = payload.items.map((it) => {
      const productId = it.productId || it.id || it._id || null
      const quantity = Number(it.quantity || it.qty || 0)
      const price = Number(it.price || 0)
      return { productId, title: it.title || it.name || '', price, quantity }
    })
    if (items.some(i => !i.productId || !i.quantity || isNaN(i.price))) {
      return res.status(400).json({ error: 'Invalid order items' })
    }
    const orderPayload = {
      buyerId: String(req.user._id),
      items,
      total: Number(payload.total || items.reduce((s, x) => s + (x.price * x.quantity), 0)),
      meta: payload.meta || {}
    }
    const order = await Order.create(orderPayload)
    res.status(201).json(order)
  } catch (err) {
    console.error('Failed to create order', err && err.stack ? err.stack : err)
    res.status(500).json({ error: err.message || 'Failed to create order' })
  }
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
