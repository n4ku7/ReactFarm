import { Router } from 'express'
import db from '../db.js'
import { nanoid } from 'nanoid'

const router = Router()

// list products
router.get('/', async (req, res) => {
  await db.read()
  res.json(db.data.products)
})

// get product
router.get('/:id', async (req, res) => {
  await db.read()
  const p = db.data.products.find(p => p.id === req.params.id)
  if (!p) return res.status(404).json({ error: 'Not found' })
  res.json(p)
})

// create product
router.post('/', async (req, res) => {
  const payload = req.body
  const product = { id: nanoid(), ...payload }
  db.data.products.push(product)
  await db.write()
  res.status(201).json(product)
})

// update
router.put('/:id', async (req, res) => {
  await db.read()
  const idx = db.data.products.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  db.data.products[idx] = { ...db.data.products[idx], ...req.body }
  await db.write()
  res.json(db.data.products[idx])
})

// delete
router.delete('/:id', async (req, res) => {
  await db.read()
  db.data.products = db.data.products.filter(p => p.id !== req.params.id)
  await db.write()
  res.status(204).end()
})

export default router
