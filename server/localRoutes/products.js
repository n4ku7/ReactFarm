import { Router } from 'express'
import { nanoid } from 'nanoid'
import db from '../db.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'

const router = Router()

// list products (optional q search in title/description)
router.get('/', async (req, res) => {
  const q = req.query.q
  await db.read()
  let products = db.data.products || []
  if (q) {
    const s = q.toLowerCase()
    products = products.filter(p => (p.title || '').toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s))
  }
  res.json(products.slice(0, 100))
})

// get product
router.get('/:id', async (req, res) => {
  await db.read()
  const p = (db.data.products || []).find(x => String(x.id) === String(req.params.id))
  if (!p) return res.status(404).json({ error: 'Not found' })
  res.json(p)
})

// create product (farmers)
router.post('/', authMiddleware, requireRole('farmer', 'admin'), async (req, res) => {
  const payload = req.body
  await db.read()
  if (req.user.role === 'farmer') payload.farmerId = String(req.user.id)
  const product = { id: nanoid(), ...payload, createdAt: new Date().toISOString() }
  db.data.products.push(product)
  await db.write()
  res.status(201).json(product)
})

// update
router.put('/:id', authMiddleware, async (req, res) => {
  await db.read()
  const product = (db.data.products || []).find(x => String(x.id) === String(req.params.id))
  if (!product) return res.status(404).json({ error: 'Not found' })
  if (req.user.role !== 'admin' && String(product.farmerId) !== String(req.user.id)) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  Object.assign(product, req.body)
  await db.write()
  res.json(product)
})

// delete
router.delete('/:id', authMiddleware, async (req, res) => {
  await db.read()
  const idx = (db.data.products || []).findIndex(x => String(x.id) === String(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const product = db.data.products[idx]
  if (req.user.role !== 'admin' && String(product.farmerId) !== String(req.user.id)) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  db.data.products.splice(idx, 1)
  await db.write()
  res.status(204).end()
})

export default router
