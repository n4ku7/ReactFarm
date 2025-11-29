import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import productsRouter from './routes/products.js'
import usersRouter from './routes/users.js'
import ordersRouter from './routes/orders.js'
import feedbacksRouter from './routes/feedbacks.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
	console.error('MONGODB_URI is not set. Configure server/.env or environment variable MONGODB_URI to point to your MongoDB Atlas or hosted DB.')
	process.exit(1)
}

async function main() {
	await mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || undefined })
	console.log('Connected to MongoDB')

	app.use(cors())
	app.use(express.json())

	app.use('/api/products', productsRouter)
	app.use('/api/users', usersRouter)
	app.use('/api/orders', ordersRouter)
	app.use('/api/feedbacks', feedbacksRouter)

	app.get('/api/health', (req, res) => res.json({ ok: true }))

	app.listen(PORT, () => console.log(`AgriCraft backend listening on http://localhost:${PORT}`))
}

main().catch((err) => {
	console.error('Failed to start server', err)
	process.exit(1)
})
