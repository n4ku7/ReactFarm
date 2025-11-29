import React from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, Avatar } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useNavigate } from 'react-router-dom'

const BuyerDashboard = () => {
  const { user } = useAuth()
  const { cart, total } = useCart()
  const navigate = useNavigate()
  const [orders, setOrders] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0
  })

  React.useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('ac_token')
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.slice(0, 5)) // Show last 5 orders
        
        // Calculate stats
        const totalOrders = data.length
        const totalSpent = data.reduce((sum, order) => sum + (order.total || 0), 0)
        const pendingOrders = data.filter(o => o.status === 'pending' || o.status === 'processing').length
        
        setStats({ totalOrders, totalSpent, pendingOrders })
      }
    } catch (err) {
      console.error('Failed to fetch orders', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box className="page-container" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box className="page-container">
      <Typography variant="h4" gutterBottom>My Dashboard</Typography>

      {/* Welcome Section */}
      <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 64, height: 64 }}>
              <AccountCircleIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h5">Welcome back, {user?.name || user?.email || 'User'}!</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>Total Orders</Typography>
                  <Typography variant="h4">{stats.totalOrders}</Typography>
                </Box>
                <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>Total Spent</Typography>
                  <Typography variant="h4">₹{stats.totalSpent.toFixed(2)}</Typography>
                </Box>
                <ShoppingCartIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>Pending Orders</Typography>
                  <Typography variant="h4">{stats.pendingOrders}</Typography>
                </Box>
                <ReceiptIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={() => navigate('/marketplace')}>
              Browse Products
            </Button>
            <Button variant="outlined" onClick={() => navigate('/cart')}>
              View Cart ({cart.length})
            </Button>
            <Button variant="outlined" onClick={() => navigate('/orders')}>
              View All Orders
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">Items in Cart</Typography>
                <Typography variant="body2" color="text.secondary">
                  {cart.length} item(s) • Total: ₹{total.toFixed(2)}
                </Typography>
              </Box>
              <Button variant="contained" onClick={() => navigate('/checkout')}>
                Checkout
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Recent Orders</Typography>
            <Button size="small" onClick={() => navigate('/orders')}>
              View All
            </Button>
          </Box>
          {orders.length === 0 ? (
            <Typography color="text.secondary">No orders yet. Start shopping!</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        #{order._id?.slice(-8)}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">₹{order.total?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status || 'pending'}
                          size="small"
                          color={
                            order.status === 'delivered' ? 'success' :
                            order.status === 'pending' ? 'warning' :
                            'default'
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button size="small" onClick={() => navigate(`/orders`)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default BuyerDashboard

