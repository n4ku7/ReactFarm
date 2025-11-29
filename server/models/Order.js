import mongoose from 'mongoose'

const OrderItem = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, default: '' }
}, { _id: false })

const BillingSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true }
}, { _id: false })

const TrackingSchema = new mongoose.Schema({
  status: { type: String, default: 'pending' },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: '' }
  }],
  shippingProvider: { type: String, default: '' },
  trackingNumber: { type: String, default: '' },
  estimatedDelivery: { type: Date, default: null }
}, { _id: false })

const OrderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [OrderItem], required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  billing: { type: BillingSchema, required: true },
  tracking: { type: TrackingSchema, default: () => ({ status: 'pending', statusHistory: [{ status: 'pending', timestamp: new Date() }] }) },
  meta: { type: Object, default: {} }
}, { timestamps: true })

// Auto-update tracking status history when status changes
OrderSchema.pre('save', function(next) {
  if (this.isModified('status') && this.tracking) {
    if (!this.tracking.statusHistory) {
      this.tracking.statusHistory = []
    }
    this.tracking.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    })
    this.tracking.status = this.status
  }
  next()
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
