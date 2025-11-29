import React from 'react'
import { Box, Button, Paper, TextField, Typography, Grid, Card, CardContent, Divider, Alert, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const CartCheckout = () => {
  const navigate = useNavigate()
  const { cart, total } = useCart()
  const { token, user } = useAuth()
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState({ type: '', text: '' })
  const [billing, setBilling] = React.useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  })

  const [paymentMethod, setPaymentMethod] = React.useState('card')
  const [stripeLoading, setStripeLoading] = React.useState(false)

  React.useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/cart')
    }
  }, [cart, navigate])

  const handleInputChange = (field, value) => {
    setBilling(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const { firstName, lastName, email, phone, address, city, state, zipCode } = billing
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zipCode) {
      setMessage({ type: 'error', text: 'Please fill all required fields' })
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' })
      return false
    }
    return true
  }

  const handlePayment = async () => {
    if (!validateForm()) return

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      if (paymentMethod === 'cod') {
        // Cash on Delivery - create order directly
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            items: cart,
            total,
            billing
          })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Order creation failed')
        
        setMessage({ type: 'success', text: 'Order placed successfully! You will pay on delivery.' })
        setTimeout(() => {
          navigate('/orders')
        }, 2000)
        return
      }

      // Create payment intent for card/UPI
      const paymentRes = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Convert to paise
          currency: 'inr',
          items: cart
        })
      })

      const paymentData = await paymentRes.json()
      if (!paymentRes.ok) throw new Error(paymentData?.error || 'Payment initialization failed')

      if (paymentData.clientSecret) {
        // For now, we'll create the order after payment
        // In production, you'd integrate Stripe Elements here
        setMessage({ type: 'info', text: 'Payment gateway integration in progress. For now, please use Cash on Delivery.' })
        setLoading(false)
      } else {
        throw new Error('Payment initialization failed')
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
      setLoading(false)
      setStripeLoading(false)
    }
  }

  if (!cart || cart.length === 0) {
    return (
      <Box className="page-container">
        <Alert severity="info">Your cart is empty. <Button href="#/cart">Go to Cart</Button></Alert>
      </Box>
    )
  }

  return (
    <Box className="page-container">
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/cart')} sx={{ mb: 2 }}>
        Back to Cart
      </Button>

      <Typography variant="h4" gutterBottom>Checkout</Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Billing Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Billing Information</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  required
                  value={billing.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  required
                  value={billing.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={billing.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  fullWidth
                  required
                  value={billing.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  fullWidth
                  required
                  multiline
                  rows={2}
                  value={billing.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="City"
                  fullWidth
                  required
                  value={billing.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="State"
                  fullWidth
                  required
                  value={billing.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="ZIP Code"
                  fullWidth
                  required
                  value={billing.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Country"
                  fullWidth
                  value={billing.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Payment Method */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Payment Method</Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                onClick={() => setPaymentMethod('card')}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                💳 Credit/Debit Card
              </Button>
              <Button
                variant={paymentMethod === 'upi' ? 'contained' : 'outlined'}
                onClick={() => setPaymentMethod('upi')}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                📱 UPI
              </Button>
              <Button
                variant={paymentMethod === 'cod' ? 'contained' : 'outlined'}
                onClick={() => setPaymentMethod('cod')}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                💵 Cash on Delivery
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Divider sx={{ my: 2 }} />
            {cart.map((item) => (
              <Box key={item.productId} sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{item.price.toFixed(2)} × {item.quantity}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>₹{total.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping</Typography>
              <Typography>Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">₹{total.toFixed(2)}</Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              onClick={handlePayment}
              disabled={loading || stripeLoading}
            >
              {loading || stripeLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Processing...
                </>
              ) : (
                `Pay ₹${total.toFixed(2)}`
              )}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CartCheckout

