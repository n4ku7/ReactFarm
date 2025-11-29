import React from 'react'
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Alert } from '@mui/material'
import { useCart } from '../../context/CartContext'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const BuyerCart = () => {
  const { cart, removeFromCart, updateQuantity, total } = useCart()

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
        <Button variant="contained" onClick={() => window.location.hash = '/checkout'}>Proceed to Checkout</Button>
      </Box>
    </Box>
  )
}

export default BuyerCart
