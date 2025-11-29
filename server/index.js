import express from 'express'
import cors from 'cors'
import db from './db.js'
import { nanoid } from 'nanoid'
import productsRouter from './routes/products.js'
import usersRouter from './routes/users.js'
import ordersRouter from './routes/orders.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
app.use('/api/orders', ordersRouter)

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log(`AgriCraft backend listening on http://localhost:${PORT}`))
