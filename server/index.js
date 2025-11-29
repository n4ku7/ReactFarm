import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import productsRouter from './routes/products.js'
import usersRouter from './routes/users.js'
import ordersRouter from './routes/orders.js'
import feedbacksRouter from './routes/feedbacks.js'
// local-file based routes (used when MONGODB_URI not set)
import localUsersRouter from './localRoutes/users.js'
import localProductsRouter from './localRoutes/products.js'
import localOrdersRouter from './localRoutes/orders.js'
import localFeedbacksRouter from './localRoutes/feedbacks.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI

async function main() {
	app.use(cors())
	app.use(express.json())

	// If a MongoDB URI is provided, use mongoose-backed routes.
	if (MONGODB_URI) {
		try {
			await mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || undefined })
			console.log('Connected to MongoDB')
			app.use('/api/products', productsRouter)
			app.use('/api/users', usersRouter)
			app.use('/api/orders', ordersRouter)
			app.use('/api/feedbacks', feedbacksRouter)
		} catch (err) {
			console.error('Failed to connect to MongoDB, falling back to local JSON DB', err)
		}
	}

	// Always mount the local file-based routes as a fallback / primary local store
	app.use('/api/products', localProductsRouter)
	app.use('/api/users', localUsersRouter)
	app.use('/api/orders', localOrdersRouter)
	app.use('/api/feedbacks', localFeedbacksRouter)

	app.get('/api/health', (req, res) => res.json({ ok: true }))

	app.listen(PORT, () => console.log(`AgriCraft backend listening on http://localhost:${PORT}`))
}

main().catch((err) => {
	console.error('Failed to start server', err)
	process.exit(1)
})
