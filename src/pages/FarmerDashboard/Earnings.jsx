import React from 'react'
import { Box, Card, CardContent, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material'
import { useAuth } from '../../context/AuthContext'

const FarmerEarnings = () => {
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
        console.error(err)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [token])

  const totalEarnings = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const deliveredEarnings = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.total || 0), 0)

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>

  return (
    <Box className="page-container">
      <Typography variant="h4" gutterBottom>Earnings & Payouts</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Earnings</Typography>
              <Typography variant="h5">₹{totalEarnings.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Delivered Orders</Typography>
              <Typography variant="h5">₹{deliveredEarnings.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Orders</Typography>
              <Typography variant="h5">{orders.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Pending Payouts</Typography>
              <Typography variant="h5">₹{(totalEarnings - deliveredEarnings).toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>Recent Orders</Typography>
      {!orders.length ? (
        <Typography>No orders yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell align="right"><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Items</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice().reverse().map(o => (
                <TableRow key={o._id}>
                  <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">₹{o.total?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>{o.status || 'pending'}</TableCell>
                  <TableCell align="right">{o.items?.length || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default FarmerEarnings
