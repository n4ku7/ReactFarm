import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const { token, user } = useAuth()

  // Fetch cart from MongoDB when user is logged in
  useEffect(() => {
    if (token && user) {
      fetchCart()
    } else {
      // Fallback to localStorage for guests
      const saved = localStorage.getItem('ac_cart')
      if (saved) {
        try {
          setCart(JSON.parse(saved))
        } catch (err) {
          console.error('Error parsing saved cart:', err)
        }
      }
    }
  }, [token, user])

  const fetchCart = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch('/api/carts', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setCart(data.items || [])
      } else {
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem('ac_cart')
        if (saved) {
          try {
            setCart(JSON.parse(saved))
          } catch (err) {
            console.error('Error parsing saved cart:', err)
          }
        }
      }
    } catch (err) {
      console.error('Error fetching cart:', err)
      // Fallback to localStorage
      const saved = localStorage.getItem('ac_cart')
      if (saved) {
        try {
          setCart(JSON.parse(saved))
        } catch (err) {
          console.error('Error parsing saved cart:', err)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const syncToBackend = async (newCart) => {
    if (!token || !user) {
      // Save to localStorage for guests
      localStorage.setItem('ac_cart', JSON.stringify(newCart))
      return
    }

    try {
      // Sync to MongoDB
      const res = await fetch('/api/carts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: newCart
        })
      })
      if (!res.ok) {
        console.error('Failed to sync cart to backend')
        // Still save to localStorage as backup
        localStorage.setItem('ac_cart', JSON.stringify(newCart))
      }
    } catch (err) {
      console.error('Error syncing cart:', err)
      // Save to localStorage as backup
      localStorage.setItem('ac_cart', JSON.stringify(newCart))
    }
  }

  const addToCart = async (product, quantity = 1) => {
    const newItem = {
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.images?.[0] || ''
    }

    if (token && user) {
      // Use API for logged-in users
      try {
        const res = await fetch('/api/carts/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newItem)
        })
        if (res.ok) {
          const data = await res.json()
          setCart(data.items || [])
          return
        }
      } catch (err) {
        console.error('Error adding to cart:', err)
      }
    }

    // Fallback to local state
    setCart(prev => {
      const existing = prev.find(item => item.productId === product._id)
      let updated
      if (existing) {
        updated = prev.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        updated = [...prev, newItem]
      }
      syncToBackend(updated)
      return updated
    })
  }

  const removeFromCart = async (productId) => {
    if (token && user) {
      try {
        const res = await fetch(`/api/carts/items/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setCart(data.items || [])
          return
        }
      } catch (err) {
        console.error('Error removing from cart:', err)
      }
    }

    // Fallback to local state
    setCart(prev => {
      const updated = prev.filter(item => item.productId !== productId)
      syncToBackend(updated)
      return updated
    })
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    if (token && user) {
      try {
        const res = await fetch(`/api/carts/items/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ quantity })
        })
        if (res.ok) {
          const data = await res.json()
          setCart(data.items || [])
          return
        }
      } catch (err) {
        console.error('Error updating cart:', err)
      }
    }

    // Fallback to local state
    setCart(prev => {
      const updated = prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
      syncToBackend(updated)
      return updated
    })
  }

  const clearCart = async () => {
    if (token && user) {
      try {
        const res = await fetch('/api/carts', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          setCart([])
          return
        }
      } catch (err) {
        console.error('Error clearing cart:', err)
      }
    }

    // Fallback to local state
    setCart([])
    localStorage.removeItem('ac_cart')
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
