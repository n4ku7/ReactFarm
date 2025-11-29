import React from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, CircularProgress } from '@mui/material'
import { useAuth } from '../../context/AuthContext'

const BuyerOrders = () => {
  const { token } = useAuth()
  const [orders, setOrders] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (res.ok) setOrders(data)
      } catch (err) {
        console.error('Failed to fetch orders', err)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [token])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>

  return (
    <Box className="page-container">
      <Typography variant="h4" gutterBottom>My Orders</Typography>

      {!orders.length ? (
        <Typography>No orders yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell align="right"><strong>Total</strong></TableCell>
                <TableCell><strong>Items</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order._id}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{order._id?.slice(-8)}</TableCell>
                  <TableCell align="right">₹{order.total?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>{order.items?.length || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status || 'pending'}
                      size="small"
                      color={order.status === 'delivered' ? 'success' : order.status === 'pending' ? 'warning' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default BuyerOrders
