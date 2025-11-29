import React from 'react'
import { Box, Button, Card, CardContent, CardMedia, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const BuyerCart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart()
  const { token, refreshAccess } = useAuth()
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [message, setMessage] = React.useState({ type: '', text: '' })
  const [billing, setBilling] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })

  const handleCheckout = async () => {
    if (!cart.length) {
      setMessage({ type: 'error', text: 'Cart is empty' })
      return
    }
    if (!token) {
      // try silent refresh with refresh token before forcing login
      setMessage({ type: 'info', text: 'Checking session...' })
      const refreshed = await (refreshAccess ? refreshAccess() : Promise.resolve(false))
      if (!refreshed) {
        setMessage({ type: 'error', text: 'You must be logged in to place an order. Redirecting to login...' })
        setTimeout(() => navigate('/login'), 1200)
        return
      }
      // token refreshed, proceed
    }
    const { firstName, lastName, email, phone, address, city, state, zipCode } = billing
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zipCode) {
      setMessage({ type: 'error', text: 'Please fill all billing details' })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cart,
          total,
          billing
        })
      })
      const text = await res.text()
      let data = null
      try { data = text ? JSON.parse(text) : null } catch (e) { data = null }
      if (!res.ok) {
        const errPayload = { url: '/api/orders', status: res.status, body: text }
        localStorage.setItem('lastApiError_orders', JSON.stringify(errPayload))
        throw new Error((data && data.error) || text || `HTTP ${res.status}`)
      }
      if (!data) {
        localStorage.setItem('lastApiResponse_orders', text)
        throw new Error('Invalid server response')
      }
      setMessage({ type: 'success', text: 'Order placed successfully!' })
      clearCart()
      setDialogOpen(false)
      setBilling({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      })
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
        <DialogTitle>Billing Details & Confirm Order</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Shipping Address</Typography>
            <TextField
              label="First Name"
              fullWidth
              size="small"
              value={billing.firstName}
              onChange={(e) => setBilling({ ...billing, firstName: e.target.value })}
            />
            <TextField
              label="Last Name"
              fullWidth
              size="small"
              value={billing.lastName}
              onChange={(e) => setBilling({ ...billing, lastName: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              size="small"
              value={billing.email}
              onChange={(e) => setBilling({ ...billing, email: e.target.value })}
            />
            <TextField
              label="Phone"
              fullWidth
              size="small"
              value={billing.phone}
              onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
            />
            <TextField
              label="Address"
              fullWidth
              size="small"
              value={billing.address}
              onChange={(e) => setBilling({ ...billing, address: e.target.value })}
            />
            <TextField
              label="City"
              fullWidth
              size="small"
              value={billing.city}
              onChange={(e) => setBilling({ ...billing, city: e.target.value })}
            />
            <TextField
              label="State"
              fullWidth
              size="small"
              value={billing.state}
              onChange={(e) => setBilling({ ...billing, state: e.target.value })}
            />
            <TextField
              label="ZIP Code"
              fullWidth
              size="small"
              value={billing.zipCode}
              onChange={(e) => setBilling({ ...billing, zipCode: e.target.value })}
            />
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
