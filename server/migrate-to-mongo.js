import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs/promises'
import mongoose from 'mongoose'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = process.env.MONGODB_DB || undefined

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in .env. Please set it and re-run the script.')
  process.exit(1)
}

async function run() {
  const dbPath = path.join(process.cwd(), 'server', 'db.json')
  let raw
  try {
    raw = await fs.readFile(dbPath, 'utf8')
  } catch (err) {
    console.error('Failed to read server/db.json:', err.message)
    process.exit(1)
  }

  let data
  try {
    data = JSON.parse(raw)
  } catch (err) {
    console.error('Failed to parse server/db.json:', err.message)
    process.exit(1)
  }

  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {})
  console.log('Connected to MongoDB')

  const collnames = ['users', 'products', 'orders', 'feedbacks']

  for (const name of collnames) {
    const items = Array.isArray(data[name]) ? data[name] : []
    const coll = mongoose.connection.collection(name)
    console.log(`\nProcessing collection: ${name} (${items.length} items)`) 

    let inserted = 0
    let skipped = 0
    let updated = 0

    for (const it of items) {
      const doc = { ...it }
      // preserve existing id in _id so relationships still match
      if (doc.id) {
        doc._id = String(doc.id)
        delete doc.id
      } else if (doc._id) {
        doc._id = String(doc._id)
      }

      try {
        if (doc._id) {
          // upsert: insert if not exists
          const existing = await coll.findOne({ _id: doc._id })
          if (existing) {
            skipped++
            continue
          }
          await coll.insertOne(doc)
          inserted++
        } else {
          // no id provided, insert and let Mongo generate _id
          await coll.insertOne(doc)
          inserted++
        }
      } catch (err) {
        console.error(`Failed to insert document into ${name}:`, err.message)
      }
    }

    console.log(`Collection ${name}: inserted=${inserted} skipped=${skipped} updated=${updated}`)
  }

  console.log('\nMigration complete. Closing connection.')
  await mongoose.disconnect()
  process.exit(0)
}

run().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
