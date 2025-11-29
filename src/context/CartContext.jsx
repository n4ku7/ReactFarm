import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  // hydrate from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ac_cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem('ac_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      // support both full product objects and minimal payloads
      // payload can be: { _id, title, price, images } or { id|productId, title, price }
      const pid = product && (product._id || product.productId || product.id || product.externalId)
      const title = product && (product.title || product.name)
      const price = product && (product.price || 0)
      const image = product && (product.images?.[0] || product.image || '')

      const existing = prev.find(item => item.productId === pid)
      if (existing) {
        return prev.map(item =>
          item.productId === pid
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, {
        productId: pid,
        title,
        price,
        quantity,
        image
      }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
