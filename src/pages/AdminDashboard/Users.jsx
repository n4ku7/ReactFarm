import React from 'react'
import { Box, Card, CardContent, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import { useAuth } from '../../../context/AuthContext'

const AdminUsers = () => {
  const { token } = useAuth()
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState(null)
  const [newStatus, setNewStatus] = React.useState('active')

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (res.ok) setUsers(data)
      } catch (err) {
        console.error('Failed to fetch users', err)
      }
      setLoading(false)
    }
    fetchUsers()
  }, [token])

  const farmersCount = users.filter(u => u.role === 'farmer').length
  const buyersCount = users.filter(u => u.role === 'buyer').length
  const adminsCount = users.filter(u => u.role === 'admin').length

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>

  return (
    <Box className="page-container">
      <Typography variant="h4" gutterBottom>User Management</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Users</Typography>
              <Typography variant="h5">{users.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Farmers</Typography>
              <Typography variant="h5">{farmersCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Buyers</Typography>
              <Typography variant="h5">{buyersCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Admins</Typography>
              <Typography variant="h5">{adminsCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>All Users</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Joined</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    size="small"
                    color={user.role === 'admin' ? 'error' : user.role === 'farmer' ? 'success' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default AdminUsers
