import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, default: 0 },
  stock: { type: Number, default: 0 },
  images: { type: [String], default: [] },
  category: { type: String, default: 'General' },
  farmerId: { type: String, default: null },
  status: { type: String, default: 'active' },
}, { timestamps: true })

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
