import React from 'react'
import { Card, CardContent, Typography, Grid, Button, Box, CircularProgress } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const stat = (title, value) => (
  <Card>
    <CardContent>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h5">{value}</Typography>
    </CardContent>
  </Card>
)

const AdminDashboard = () => {
  const { token } = useAuth()
  const [stats, setStats] = React.useState({ users: 0, products: 0, orders: 0, revenue: 0 })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/products'),
          fetch('/api/orders', { headers: { 'Authorization': `Bearer ${token}` } })
        ])
        const [users, products, orders] = await Promise.all([usersRes.json(), productsRes.json(), ordersRes.json()])
        const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
        setStats({ users: users.length, products: products.length, orders: orders.length, revenue })
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchStats()
  }, [token])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>

  return (
    <div className="page-container">
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>{stat('Total Users', stats.users)}</Grid>
        <Grid item xs={12} sm={6} md={3}>{stat('Total Products', stats.products)}</Grid>
        <Grid item xs={12} sm={6} md={3}>{stat('Total Orders', stats.orders)}</Grid>
        <Grid item xs={12} sm={6} md={3}>{stat('Total Revenue', `₹${stats.revenue.toFixed(0)}`)}</Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Management</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" component={RouterLink} to="/admin/users">Manage Users</Button>
            <Button variant="contained" component={RouterLink} to="/admin/orders">View All Orders</Button>
            <Button variant="contained" component={RouterLink} to="/admin/feedbacks">View Feedbacks</Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard