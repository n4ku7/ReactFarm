import React from 'react'
import { Box, Button, Card, CardContent, CardMedia, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const BuyerCart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart()
  const { token } = useAuth()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [message, setMessage] = React.useState({ type: '', text: '' })

  const handleCheckout = async () => {
    if (!cart.length) {
      setMessage({ type: 'error', text: 'Cart is empty' })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          total
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Checkout failed')
      setMessage({ type: 'success', text: 'Order placed successfully!' })
      clearCart()
      setDialogOpen(false)
      setTimeout(() => window.location.hash = '/orders', 2000)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
    setSubmitting(false)
  }

  if (!cart.length) {
    return (
      <Box className="page-container">
        <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
        <Alert severity="info">Your cart is empty. <Button href="#/marketplace">Continue Shopping</Button></Alert>
      </Box>
    )
  }

  return (
    <Box className="page-container">
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell align="right"><strong>Price</strong></TableCell>
              <TableCell align="center"><strong>Quantity</strong></TableCell>
              <TableCell align="right"><strong>Subtotal</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map(item => (
              <TableRow key={item.productId}>
                <TableCell>{item.title}</TableCell>
                <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Button size="small" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                    <RemoveIcon sx={{ fontSize: 18 }} />
                  </Button>
                  {item.quantity}
                  <Button size="small" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                    <AddIcon sx={{ fontSize: 18 }} />
                  </Button>
                </TableCell>
                <TableCell align="right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Button size="small" color="error" onClick={() => removeFromCart(item.productId)}>
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6">Total: ₹{total.toFixed(2)}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" href="#/marketplace">Continue Shopping</Button>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>Proceed to Checkout</Button>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Order</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              You are about to place an order with {cart.length} item(s)
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total Amount: ₹{total.toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={submitting}>Cancel</Button>
          <Button variant="contained" onClick={handleCheckout} disabled={submitting}>
            {submitting ? 'Processing...' : 'Confirm Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BuyerCart
