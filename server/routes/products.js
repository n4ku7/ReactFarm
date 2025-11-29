import { Router } from 'express'
import Product from '../models/Product.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'

const router = Router()

// list products (optionally filter by q)
router.get('/', async (req, res) => {
  const q = req.query.q
  const filter = q ? { $text: { $search: q } } : {}
  const products = await Product.find(filter).sort({ createdAt: -1 }).limit(100)
  res.json(products)
})

// get product
router.get('/:id', async (req, res) => {
  const p = await Product.findById(req.params.id)
  if (!p) return res.status(404).json({ error: 'Not found' })
  res.json(p)
})

// create product (farmers)
router.post('/', authMiddleware, requireRole('farmer', 'admin'), async (req, res) => {
  const payload = req.body
  // if farmer, set farmerId to the requester
  if (req.user.role === 'farmer') payload.farmerId = String(req.user._id)
  const product = await Product.create(payload)
  res.status(201).json(product)
})

// update
router.put('/:id', authMiddleware, async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ error: 'Not found' })
  // only admin or owning farmer can update
  if (req.user.role !== 'admin' && String(product.farmerId) !== String(req.user._id)) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  Object.assign(product, req.body)
  await product.save()
  res.json(product)
})

// delete
router.delete('/:id', authMiddleware, async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ error: 'Not found' })
  if (req.user.role !== 'admin' && String(product.farmerId) !== String(req.user._id)) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  await Product.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

export default router
