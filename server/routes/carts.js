import { Router } from 'express'
import Cart from '../models/Cart.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// Get user's cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId')
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] })
    }
    res.json(cart)
  } catch (err) {
    console.error('Error fetching cart:', err)
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
})

// Add item to cart
router.post('/items', authMiddleware, async (req, res) => {
  try {
    const { productId, title, price, quantity = 1, image } = req.body
    
    if (!productId || !title || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields: productId, title, price' })
    }

    let cart = await Cart.findOne({ userId: req.user._id })
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] })
    }

    const existingItemIndex = cart.items.findIndex(
      item => String(item.productId) === String(productId)
    )

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity
    } else {
      cart.items.push({ productId, title, price, quantity, image: image || '' })
    }

    await cart.save()
    res.json(cart)
  } catch (err) {
    console.error('Error adding to cart:', err)
    res.status(500).json({ error: 'Failed to add item to cart' })
  }
})

// Update item quantity in cart
router.put('/items/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params
    const { quantity } = req.body

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'Valid quantity required' })
    }

    let cart = await Cart.findOne({ userId: req.user._id })
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    if (quantity === 0) {
      cart.items = cart.items.filter(item => String(item.productId) !== String(productId))
    } else {
      const item = cart.items.find(item => String(item.productId) === String(productId))
      if (item) {
        item.quantity = quantity
      } else {
        return res.status(404).json({ error: 'Item not found in cart' })
      }
    }

    await cart.save()
    res.json(cart)
  } catch (err) {
    console.error('Error updating cart item:', err)
    res.status(500).json({ error: 'Failed to update cart item' })
  }
})

// Remove item from cart
router.delete('/items/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params
    const cart = await Cart.findOne({ userId: req.user._id })
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    cart.items = cart.items.filter(item => String(item.productId) !== String(productId))
    await cart.save()
    res.json(cart)
  } catch (err) {
    console.error('Error removing from cart:', err)
    res.status(500).json({ error: 'Failed to remove item from cart' })
  }
})

// Sync entire cart (replace all items)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' })
    }

    let cart = await Cart.findOne({ userId: req.user._id })
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] })
    }

    cart.items = items
    await cart.save()
    res.json(cart)
  } catch (err) {
    console.error('Error syncing cart:', err)
    res.status(500).json({ error: 'Failed to sync cart' })
  }
})

// Clear cart
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    cart.items = []
    await cart.save()
    res.json(cart)
  } catch (err) {
    console.error('Error clearing cart:', err)
    res.status(500).json({ error: 'Failed to clear cart' })
  }
})

export default router

