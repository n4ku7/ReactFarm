import { Router } from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Cart from '../models/Cart.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'

const router = Router()

// list orders - role aware
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const orders = await Order.find()
        .populate('buyerId', 'name email')
        .sort({ createdAt: -1 })
        .limit(200)
      return res.json(orders)
    }

    if (req.user.role === 'farmer') {
      // fetch products owned by farmer
      const products = await Product.find({ farmerId: String(req.user._id) }).select('_id')
      const pids = products.map((p) => p._id)
      const orders = await Order.find({ 'items.productId': { $in: pids } })
        .populate('buyerId', 'name email')
        .sort({ createdAt: -1 })
        .limit(200)
      return res.json(orders)
    }

    // buyer - return own orders
    const orders = await Order.find({ buyerId: req.user._id })
      .populate('items.productId', 'title images')
      .sort({ createdAt: -1 })
      .limit(200)
    res.json(orders)
  } catch (err) {
    console.error('Error fetching orders:', err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// create order - buyer only
router.post('/', authMiddleware, requireRole('buyer'), async (req, res) => {
  try {
    const { items, total, billing } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' })
    }

    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Valid total is required' })
    }

    if (!billing || !billing.firstName || !billing.lastName || !billing.email || 
        !billing.phone || !billing.address || !billing.city || !billing.state || !billing.zipCode) {
      return res.status(400).json({ error: 'Complete billing information is required' })
    }

    // Create order
    const order = await Order.create({
      buyerId: req.user._id,
      items,
      total,
      billing,
      status: 'pending'
    })

    // Clear cart after successful order creation
    try {
      const cart = await Cart.findOne({ userId: req.user._id })
      if (cart) {
        cart.items = []
        await cart.save()
      }
    } catch (cartErr) {
      console.error('Error clearing cart after order:', cartErr)
      // Don't fail the order creation if cart clearing fails
    }

    res.status(201).json(order)
  } catch (err) {
    console.error('Error creating order:', err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// get single order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyerId', 'name email')
      .populate('items.productId', 'title images')

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    // Check permissions
    if (req.user.role === 'buyer' && String(order.buyerId._id) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    if (req.user.role === 'farmer') {
      const products = await Product.find({ farmerId: String(req.user._id) }).select('_id')
      const pids = products.map((p) => String(p._id))
      const hasProduct = order.items.some(item => pids.includes(String(item.productId)))
      if (!hasProduct) {
        return res.status(403).json({ error: 'Access denied' })
      }
    }

    res.json(order)
  } catch (err) {
    console.error('Error fetching order:', err)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// update order status - admin or farmer (for their products)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, trackingNumber, shippingProvider, estimatedDelivery } = req.body
    
    if (!status) {
      return res.status(400).json({ error: 'Status required' })
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    // Check permissions
    if (req.user.role === 'admin') {
      // Admin can update any order
    } else if (req.user.role === 'farmer') {
      // Farmer can only update orders containing their products
      const products = await Product.find({ farmerId: String(req.user._id) }).select('_id')
      const pids = products.map((p) => String(p._id))
      const hasProduct = order.items.some(item => pids.includes(String(item.productId)))
      if (!hasProduct) {
        return res.status(403).json({ error: 'Access denied' })
      }
    } else {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Update order
    order.status = status
    if (trackingNumber) order.tracking.trackingNumber = trackingNumber
    if (shippingProvider) order.tracking.shippingProvider = shippingProvider
    if (estimatedDelivery) order.tracking.estimatedDelivery = new Date(estimatedDelivery)

    await order.save()
    res.json(order)
  } catch (err) {
    console.error('Error updating order:', err)
    res.status(500).json({ error: 'Failed to update order' })
  }
})

export default router
