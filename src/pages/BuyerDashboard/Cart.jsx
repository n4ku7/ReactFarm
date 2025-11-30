import React from 'react'
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Alert, Fade, IconButton, Card, CardContent, Divider, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const BuyerCart = () => {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, total, loading } = useCart()

  if (!cart.length) {
    return (
      <Box className="page-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Fade in timeout={500}>
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3, boxShadow: 3, maxWidth: 500 }}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Your Cart is Empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Add some products to get started!
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/marketplace')}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              Browse Products
            </Button>
          </Card>
        </Fade>
      </Box>
    )
  }

  return (
    <Box className="page-container">
      <Fade in timeout={500}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Shopping Cart
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: 'primary.light' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Quantity</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Subtotal</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.map(item => (
                        <TableRow 
                          key={item.productId}
                          sx={{ 
                            '&:hover': { 
                              bgcolor: 'action.hover',
                              transition: 'background-color 0.2s ease'
                            } 
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              {item.image && (
                                <Box
                                  component="img"
                                  src={item.image}
                                  alt={item.title}
                                  sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                                />
                              )}
                              <Typography variant="body1" fontWeight={500}>
                                {item.title}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1" fontWeight={500}>
                              ₹{item.price.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <IconButton 
                                size="small" 
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                sx={{ 
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  '&:hover': { bgcolor: 'action.hover' }
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
                                {item.quantity}
                              </Typography>
                              <IconButton 
                                size="small" 
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                sx={{ 
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  '&:hover': { bgcolor: 'action.hover' }
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1" fontWeight={600}>
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => removeFromCart(item.productId)}
                              sx={{ 
                                '&:hover': { 
                                  bgcolor: 'error.light',
                                  color: 'error.contrastText'
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, position: 'sticky', top: 20 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Order Summary
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="text.secondary">Subtotal ({cart.length} items)</Typography>
                    <Typography>₹{total.toFixed(2)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="text.secondary">Shipping</Typography>
                    <Typography color="success.main" fontWeight={500}>Free</Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      ₹{total.toFixed(2)}
                    </Typography>
                  </Box>

                  <Button 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    onClick={() => navigate('/checkout')}
                    disabled={loading}
                    sx={{ 
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
                  >
                    Proceed to Checkout
                  </Button>

                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ 
                      mt: 2,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                    onClick={() => navigate('/marketplace')}
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Box>
  )
}

export default BuyerCart
