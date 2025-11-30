import React from 'react'
import { Box, Button, Paper, TextField, Typography, Grid, Card, CardContent, Divider, Alert, CircularProgress, Fade } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { validators, validateForm } from '../../utils/validation'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const CartCheckout = () => {
  const navigate = useNavigate()
  const { cart, total, clearCart } = useCart()
  const { token, user } = useAuth()
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState({ type: '', text: '' })
  const [orderSuccess, setOrderSuccess] = React.useState(false)
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
  const [errors, setErrors] = React.useState({})
  const [touched, setTouched] = React.useState({})
  const [paymentMethod, setPaymentMethod] = React.useState('cod')
  const [stripeLoading, setStripeLoading] = React.useState(false)

  React.useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/cart')
    }
  }, [cart, navigate])

  const handleInputChange = (field, value) => {
    setBilling(prev => ({ ...prev, [field]: value }))
    
    if (touched[field]) {
      let error = ''
      switch (field) {
        case 'email':
          error = validators.email(value)
          break
        case 'phone':
          error = validators.phone(value)
          break
        case 'zipCode':
          error = validators.zipCode(value)
          break
        default:
          error = validators.required(value, field.charAt(0).toUpperCase() + field.slice(1))
      }
      setErrors(prev => ({ ...prev, [field]: error }))
    }
    
    if (message.text) setMessage({ type: '', text: '' })
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const value = billing[field]
    let error = ''
    switch (field) {
      case 'email':
        error = validators.email(value)
        break
      case 'phone':
        error = validators.phone(value)
        break
      case 'zipCode':
        error = validators.zipCode(value)
        break
      default:
        error = validators.required(value, field.charAt(0).toUpperCase() + field.slice(1))
    }
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const validateBillingForm = () => {
    const validation = validateForm(billing, {
      firstName: [(val) => validators.required(val, 'First name')],
      lastName: [(val) => validators.required(val, 'Last name')],
      email: [validators.email],
      phone: [validators.phone],
      address: [(val) => validators.required(val, 'Address')],
      city: [(val) => validators.required(val, 'City')],
      state: [(val) => validators.required(val, 'State')],
      zipCode: [validators.zipCode]
    })
    
    setErrors(validation.errors)
    return validation.isValid
  }

  const handlePayment = async () => {
    if (!validateBillingForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors below' })
      return
    }

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
        
        // Clear cart after successful order
        await clearCart()
        
        setOrderSuccess(true)
        setMessage({ type: 'success', text: 'Order placed successfully! You will pay on delivery. Redirecting...' })
        
        setTimeout(() => {
          navigate('/orders')
        }, 2500)
        return
      }

      // For card/UPI payments - create payment intent first, then order
      let paymentIntentId = null
      
      if (paymentMethod === 'card' || paymentMethod === 'upi') {
        try {
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
          if (paymentRes.ok && paymentData.paymentIntentId) {
            paymentIntentId = paymentData.paymentIntentId
          } else {
            // If Stripe is not configured, fall back to creating order without payment
            console.warn('Payment gateway not available, creating order without payment verification')
          }
        } catch (err) {
          console.warn('Payment initialization failed, creating order without payment verification:', err)
        }
      }

      // Create order (with or without payment verification)
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          total,
          billing,
          paymentMethod,
          paymentIntentId
        })
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData?.error || 'Order creation failed')

      // Clear cart after successful order
      await clearCart()
      
      setOrderSuccess(true)
      const successMessage = paymentMethod === 'cod' 
        ? 'Order placed successfully! You will pay on delivery.'
        : 'Order placed successfully! Payment will be processed.'
      setMessage({ type: 'success', text: successMessage + ' Redirecting...' })
      
      setTimeout(() => {
        navigate('/orders')
      }, 2500)
    } catch (err) {
      console.error('Payment/Order error:', err)
      setMessage({ type: 'error', text: err.message || 'Something went wrong. Please try again.' })
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
      <Fade in timeout={500}>
        <Box>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/cart')} 
            sx={{ mb: 2 }}
            variant="outlined"
          >
            Back to Cart
          </Button>

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Checkout
          </Typography>

      {orderSuccess && (
        <Alert 
          severity="success" 
          icon={<CheckCircleIcon />}
          sx={{ mb: 2 }}
        >
          Order placed successfully! Redirecting to orders...
        </Alert>
      )}

      {message.text && !orderSuccess && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Billing Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Billing Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  required
                  value={billing.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  required
                  value={billing.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                  onBlur={() => handleBlur('email')}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  fullWidth
                  required
                  value={billing.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone || 'Include country code if outside India'}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                  onBlur={() => handleBlur('address')}
                  error={Boolean(errors.address)}
                  helperText={errors.address}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="City"
                  fullWidth
                  required
                  value={billing.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  onBlur={() => handleBlur('city')}
                  error={Boolean(errors.city)}
                  helperText={errors.city}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="State"
                  fullWidth
                  required
                  value={billing.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  onBlur={() => handleBlur('state')}
                  error={Boolean(errors.state)}
                  helperText={errors.state}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="ZIP Code"
                  fullWidth
                  required
                  value={billing.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  onBlur={() => handleBlur('zipCode')}
                  error={Boolean(errors.zipCode)}
                  helperText={errors.zipCode || '5-6 digits'}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Payment Method
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                onClick={() => setPaymentMethod('card')}
                fullWidth
                sx={{ 
                  justifyContent: 'flex-start',
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(4px)'
                  }
                }}
              >
                💳 Credit/Debit Card
              </Button>
              <Button
                variant={paymentMethod === 'upi' ? 'contained' : 'outlined'}
                onClick={() => setPaymentMethod('upi')}
                fullWidth
                sx={{ 
                  justifyContent: 'flex-start',
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(4px)'
                  }
                }}
              >
                📱 UPI
              </Button>
              <Button
                variant={paymentMethod === 'cod' ? 'contained' : 'outlined'}
                onClick={() => setPaymentMethod('cod')}
                fullWidth
                sx={{ 
                  justifyContent: 'flex-start',
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(4px)'
                  }
                }}
              >
                💵 Cash on Delivery
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Order Summary
            </Typography>
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
              sx={{ 
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                },
                transition: 'all 0.3s ease'
              }}
              onClick={handlePayment}
              disabled={loading || stripeLoading || orderSuccess}
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
      </Fade>
    </Box>
  )
}

export default CartCheckout

