import mongoose from 'mongoose'

const OrderItem = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: String,
  price: Number,
  quantity: Number
}, { _id: false })

const OrderSchema = new mongoose.Schema({
  buyerId: { type: String },
  items: { type: [OrderItem], default: [] },
  total: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
  meta: { type: Object, default: {} }
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
