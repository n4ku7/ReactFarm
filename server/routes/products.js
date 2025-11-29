import { Router } from 'express'
import Product from '../models/Product.js'

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
router.post('/', async (req, res) => {
  const payload = req.body
  const product = await Product.create(payload)
  res.status(201).json(product)
})

// update
router.put('/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!updated) return res.status(404).json({ error: 'Not found' })
  res.json(updated)
})

// delete
router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

export default router
