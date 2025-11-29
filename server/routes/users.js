import { Router } from 'express'
import db from '../db.js'
import { nanoid } from 'nanoid'

const router = Router()

// list users (unsafe - for demo only)
router.get('/', async (req, res) => {
  await db.read()
  res.json(db.data.users)
})

// create user
router.post('/', async (req, res) => {
  const user = { id: nanoid(), ...req.body }
  db.data.users.push(user)
  await db.write()
  res.status(201).json(user)
})

export default router
