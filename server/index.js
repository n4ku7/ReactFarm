import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import productsRouter from './routes/products.js'
import usersRouter from './routes/users.js'
import ordersRouter from './routes/orders.js'
import feedbacksRouter from './routes/feedbacks.js'
import cartsRouter from './routes/carts.js'
import paymentsRouter from './routes/payments.js'
// local-file based routes (used when MONGODB_URI not set)
import localUsersRouter from './localRoutes/users.js'
import localProductsRouter from './localRoutes/products.js'
import localOrdersRouter from './localRoutes/orders.js'
import localFeedbacksRouter from './localRoutes/feedbacks.js'

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from server directory or project root
dotenv.config({ path: join(__dirname, '.env') })
dotenv.config({ path: join(__dirname, '..', '.env') })

const app = express()
const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI

async function main() {
	app.use(cors())
	app.use(express.json())

	// If a MongoDB URI is provided, use mongoose-backed routes.
	if (MONGODB_URI) {
		try {
			console.log('Attempting to connect to MongoDB...')
			await mongoose.connect(MONGODB_URI, {
				dbName: process.env.MONGODB_DB || undefined,
				serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
				socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
			})
			console.log('✅ Connected to MongoDB successfully')
			
			// Set up connection event handlers
			mongoose.connection.on('error', (err) => {
				console.error('MongoDB connection error:', err)
			})
			
			mongoose.connection.on('disconnected', () => {
				console.warn('MongoDB disconnected')
			})
			
			app.use('/api/products', productsRouter)
			app.use('/api/users', usersRouter)
			app.use('/api/orders', ordersRouter)
			app.use('/api/feedbacks', feedbacksRouter)
			app.use('/api/carts', cartsRouter)
			app.use('/api/payments', paymentsRouter)
		} catch (err) {
			console.error('❌ Failed to connect to MongoDB:', err.message)
			console.error('Falling back to local JSON DB')
			console.error('Error details:', err)
		}
	} else {
		console.log('ℹ️  MONGODB_URI not set, using local JSON DB')
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
