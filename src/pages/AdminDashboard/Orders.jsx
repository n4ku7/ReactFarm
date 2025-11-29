import React from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import { useAuth } from '../../context/AuthContext'

const AdminOrders = () => {
  const { token } = useAuth()
  const [orders, setOrders] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedOrder, setSelectedOrder] = React.useState(null)
  const [newStatus, setNewStatus] = React.useState('pending')

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

  const handleStatusUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/orders/${selectedOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === selectedOrder._id ? { ...o, status: newStatus } : o))
        setDialogOpen(false)
        setSelectedOrder(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <Box className="page-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">All Orders</Typography>
        <Typography variant="h6">Total Revenue: ₹{totalRevenue.toFixed(2)}</Typography>
      </Box>

      {!orders.length ? (
        <Typography>No orders yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>Buyer</strong></TableCell>
                <TableCell align="right"><strong>Total</strong></TableCell>
                <TableCell align="center"><strong>Items</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order._id}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{order._id?.slice(-8)}</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem' }}>{order.buyerId?.slice(-6) || 'N/A'}</TableCell>
                  <TableCell align="right">₹{order.total?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell align="center">{order.items?.length || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status || 'pending'}
                      size="small"
                      color={order.status === 'delivered' ? 'success' : order.status === 'pending' ? 'warning' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedOrder(order)
                        setNewStatus(order.status || 'pending')
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminOrders
