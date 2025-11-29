import React from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import { useAuth } from '../../context/AuthContext'

const FarmerOrders = () => {
  const { token } = useAuth()
  const [orders, setOrders] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [selectedOrder, setSelectedOrder] = React.useState(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [newStatus, setNewStatus] = React.useState('pending')
  const [trackingNumber, setTrackingNumber] = React.useState('')
  const [shippingProvider, setShippingProvider] = React.useState('')

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
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

  const handleStatusUpdate = async () => {
    try {
      const updateData = { status: newStatus }
      if (trackingNumber) updateData.trackingNumber = trackingNumber
      if (shippingProvider) updateData.shippingProvider = shippingProvider

      const res = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })
      if (res.ok) {
        const updatedOrder = await res.json()
        setOrders(prev => prev.map(o => o._id === selectedOrder._id ? updatedOrder : o))
        setDialogOpen(false)
        setSelectedOrder(null)
        setTrackingNumber('')
        setShippingProvider('')
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>

  return (
    <Box className="page-container">
      <Typography variant="h4" gutterBottom>Orders for My Products</Typography>

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
                <TableCell><strong>Tracking</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
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
                  <TableCell sx={{ fontSize: '0.75rem' }}>
                    {order.tracking?.trackingNumber ? (
                      <Box>
                        <Typography variant="caption" display="block">{order.tracking.trackingNumber}</Typography>
                        {order.tracking.shippingProvider && (
                          <Typography variant="caption" color="text.secondary">{order.tracking.shippingProvider}</Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">No tracking</Typography>
                    )}
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedOrder(order)
                        setNewStatus(order.status || 'pending')
                        setTrackingNumber(order.tracking?.trackingNumber || '')
                        setShippingProvider(order.tracking?.shippingProvider || '')
                        setDialogOpen(true)
                      }}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Order Status & Tracking</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Status"
              fullWidth
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              SelectProps={{
                native: true
              }}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </TextField>
            <TextField
              label="Tracking Number"
              fullWidth
              size="small"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
            />
            <TextField
              label="Shipping Provider"
              fullWidth
              size="small"
              value={shippingProvider}
              onChange={(e) => setShippingProvider(e.target.value)}
              placeholder="e.g., FedEx, UPS, DHL"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogOpen(false)
            setTrackingNumber('')
            setShippingProvider('')
          }}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FarmerOrders
