import { Router } from 'express'
import { nanoid } from 'nanoid'
import db from '../db.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'

const router = Router()

// list orders - role aware
router.get('/', authMiddleware, async (req, res) => {
  await db.read()
  const orders = db.data.orders || []
  if (req.user.role === 'admin') return res.json(orders.slice().reverse().slice(0,200))

  if (req.user.role === 'farmer') {
    // find product ids owned by farmer
    const products = (db.data.products || []).filter(p => String(p.farmerId) === String(req.user.id)).map(p => p.id)
    const matched = orders.filter(o => (o.items || []).some(it => products.includes(String(it.productId))))
    return res.json(matched.slice().reverse().slice(0,200))
  }

  // buyer
  const buyerOrders = orders.filter(o => String(o.buyerId) === String(req.user.id))
  res.json(buyerOrders.slice().reverse().slice(0,200))
})

// create order - buyer only
router.post('/', authMiddleware, requireRole('buyer'), async (req, res) => {
  const payload = req.body
  await db.read()
  const order = { id: nanoid(), ...payload, buyerId: String(req.user.id), status: 'pending', createdAt: new Date().toISOString() }
  db.data.orders.push(order)
  await db.write()
  res.status(201).json(order)
})

// update order status - admin only
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  const { status } = req.body
  if (!status) return res.status(400).json({ error: 'Status required' })
  await db.read()
  const order = (db.data.orders || []).find(x => String(x.id) === String(req.params.id))
  if (!order) return res.status(404).json({ error: 'Not found' })
  order.status = status
  await db.write()
  res.json(order)
})

export default router
