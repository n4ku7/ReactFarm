import { Router } from 'express'
import Stripe from 'stripe'
import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'

const router = Router()

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  : null

// Create payment intent
router.post('/create-intent', authMiddleware, requireRole('buyer'), async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Payment gateway not configured. Please use Cash on Delivery.' })
    }

    const { amount, currency = 'inr', items } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in smallest currency unit (paise for INR)
      currency: currency.toLowerCase(),
      metadata: {
        userId: String(req.user._id),
        items: JSON.stringify(items)
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: err.message || 'Payment initialization failed' })
  }
})

// Create order with payment (for card/UPI - creates order first, payment processed separately)
router.post('/create-order', authMiddleware, requireRole('buyer'), async (req, res) => {
  try {
    const { items, total, billing, paymentMethod, paymentIntentId } = req.body

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

    // For card/UPI, verify payment if paymentIntentId is provided
    let paymentStatus = 'pending'
    if (paymentIntentId && stripe) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
        paymentStatus = paymentIntent.status
        if (paymentStatus !== 'succeeded' && paymentMethod !== 'cod') {
          return res.status(400).json({ error: 'Payment not completed. Please complete the payment first.' })
        }
      } catch (err) {
        console.error('Error verifying payment:', err)
        // Continue with order creation if payment verification fails
      }
    }

    // Create order
    const order = await Order.create({
      buyerId: req.user._id,
      items,
      total,
      billing,
      status: paymentStatus === 'succeeded' ? 'processing' : 'pending',
      meta: {
        paymentMethod: paymentMethod || 'cod',
        paymentIntentId: paymentIntentId || null,
        paymentStatus
      }
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

    res.status(201).json({
      success: true,
      order,
      message: 'Order placed successfully!'
    })
  } catch (err) {
    console.error('Error creating order with payment:', err)
    res.status(500).json({ error: err.message || 'Failed to create order' })
  }
})

// Webhook for Stripe events (optional, for production)
// Note: For webhooks, you need to use express.raw() middleware in index.js
router.post('/webhook', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment gateway not configured' })
  }

  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    // Update order status if needed
    console.log('Payment succeeded:', paymentIntent.id)
  }

  res.json({ received: true })
})

export default router

