import mongoose from 'mongoose'

const RegistrySchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: Object, default: {} },
  source: { type: String, default: 'migrate' },
  meta: { type: Object, default: {} }
}, { timestamps: true })

// create an index on key for upserts
RegistrySchema.index({ key: 1 }, { unique: true })

export default mongoose.models.Registry || mongoose.model('Registry', RegistrySchema)
