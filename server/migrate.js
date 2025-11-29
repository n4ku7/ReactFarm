import fs from 'fs/promises'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Product from './models/Product.js'
import User from './models/User.js'
import Order from './models/Order.js'
import Feedback from './models/Feedback.js'

dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in env')
  process.exit(1)
}

async function run() {
  await mongoose.connect(MONGODB_URI)
  const raw = await fs.readFile(new URL('./db.json', import.meta.url))
  const data = JSON.parse(raw)

  if (data.products && data.products.length) {
    await Product.insertMany(data.products.map(p => ({ title: p.title || p.name || 'Untitled', description: p.description || '', price: p.price || 0, stock: p.stock || 0 })))
    console.log('Migrated products')
  }
  if (data.users && data.users.length) {
    await User.insertMany(data.users.map(u => ({ name: u.name, email: u.email, role: u.role || 'buyer' })))
    console.log('Migrated users')
  }
  if (data.orders && data.orders.length) {
    await Order.insertMany(data.orders)
    console.log('Migrated orders')
  }
  if (data.feedbacks && data.feedbacks.length) {
    await Feedback.insertMany(data.feedbacks.map(f => ({ name: f.name, email: f.email, topic: f.topic, rating: f.rating, message: f.message, consent: f.consent })))
    console.log('Migrated feedbacks')
  }

  await mongoose.disconnect()
  console.log('Migration finished')
}

run().catch(err => { console.error(err); process.exit(1) })
