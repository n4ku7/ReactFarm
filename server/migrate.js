import fs from 'fs/promises'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Product from './models/Product.js'
import User from './models/User.js'
import Order from './models/Order.js'
import Feedback from './models/Feedback.js'
import Registry from './models/Registry.js'

dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in env')
  process.exit(1)
}

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const force = args.includes('--force') || args.includes('--drop')

async function run() {
  // Use explicit connection options (TLS, unified topology) for Atlas
  const connOpts = { useNewUrlParser: true, useUnifiedTopology: true, tls: true }
  await mongoose.connect(MONGODB_URI, connOpts)
  const raw = await fs.readFile(new URL('./db.json', import.meta.url))
  const data = JSON.parse(raw)

  if (force && !dryRun) {
    console.log('Force mode: clearing existing collections (products, users, orders, feedbacks)')
    await Product.deleteMany({})
    await User.deleteMany({})
    await Order.deleteMany({})
    await Feedback.deleteMany({})
  }

  // Products: upsert by externalId (original id in db.json)
  if (data.products && data.products.length) {
    let pCount = 0
    for (const p of data.products) {
      const doc = {
        title: p.title || p.name || 'Untitled',
        description: p.description || '',
        price: p.price || 0,
        stock: p.stock || 0,
        rating: p.rating || 0,
        category: p.category || null,
        image: p.image || null,
        externalId: p.id || undefined,
        createdAt: p.createdAt ? new Date(p.createdAt) : undefined
      }
      if (dryRun) {
        console.log('[dry-run] upsert Product', doc)
      } else {
        const filter = doc.externalId ? { externalId: doc.externalId } : { title: doc.title }
        await Product.updateOne(filter, { $set: doc }, { upsert: true })
        pCount++
      }
    }
    if (!dryRun) console.log(`Migrated/Upserted ${pCount} products`)
  }

  // Users: upsert by email
  if (data.users && data.users.length) {
    let uCount = 0
    for (const u of data.users) {
      const doc = {
        name: u.name,
        email: u.email,
        role: u.role || 'buyer',
        createdAt: u.createdAt ? new Date(u.createdAt) : undefined
      }
      if (dryRun) {
        console.log('[dry-run] upsert User', doc)
      } else if (doc.email) {
        await User.updateOne({ email: doc.email }, { $set: doc }, { upsert: true })
        uCount++
      }
    }
    if (!dryRun) console.log(`Migrated/Upserted ${uCount} users`)
  }

  // Orders: upsert by id
  if (data.orders && data.orders.length) {
    let oCount = 0
    for (const o of data.orders) {
      const doc = { ...o }
      if (dryRun) {
        console.log('[dry-run] upsert Order', doc)
      } else if (doc.id) {
        await Order.updateOne({ id: doc.id }, { $set: doc }, { upsert: true })
        oCount++
      }
    }
    if (!dryRun) console.log(`Migrated/Upserted ${oCount} orders`)
  }

  // Feedbacks: upsert by id
  if (data.feedbacks && data.feedbacks.length) {
    let fCount = 0
    for (const f of data.feedbacks) {
      const doc = {
        name: f.name,
        email: f.email,
        topic: f.topic,
        rating: f.rating,
        message: f.message,
        consent: f.consent,
        createdAt: f.createdAt ? new Date(f.createdAt) : undefined,
        id: f.id
      }
      if (dryRun) {
        console.log('[dry-run] upsert Feedback', doc)
      } else if (doc.id) {
        await Feedback.updateOne({ id: doc.id }, { $set: doc }, { upsert: true })
        fCount++
      }
    }
    if (!dryRun) console.log(`Migrated/Upserted ${fCount} feedbacks`)
  }

  // Registry: upsert by key (if present in db.json)
  if (data.registry && Array.isArray(data.registry) && data.registry.length) {
    let rCount = 0
    for (const r of data.registry) {
      const doc = {
        key: r.key || (r.name || undefined),
        value: r.value || r.data || {},
        source: r.source || 'migrate',
        meta: r.meta || {}
      }
      if (dryRun) {
        console.log('[dry-run] upsert Registry', doc)
      } else if (doc.key) {
        await Registry.updateOne({ key: doc.key }, { $set: doc }, { upsert: true })
        rCount++
      }
    }
    if (!dryRun) console.log(`Migrated/Upserted ${rCount} registry entries`)
  }

  await mongoose.disconnect()
  console.log('Migration finished')
}

run().catch(err => { console.error(err); process.exit(1) })
