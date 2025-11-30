import React from 'react'
import { Box, Card, CardContent, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useAuth } from '../../context/AuthContext'

const AdminUsers = () => {
  const { token } = useAuth()
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState('edit') // 'edit' or 'delete'
  const [selectedUser, setSelectedUser] = React.useState(null)
  const [newRole, setNewRole] = React.useState('')
  const [snack, setSnack] = React.useState({ open: false, severity: 'success', message: '' })

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', {
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

  const openEditDialog = (user) => {
    setDialogMode('edit')
    setSelectedUser(user)
    setNewRole(user.role)
    setDialogOpen(true)
  }

  const openDeleteDialog = (user) => {
    setDialogMode('delete')
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const handleEditRole = async () => {
    if (!newRole || newRole === selectedUser.role) {
      setSnack({ open: true, severity: 'warning', message: 'No changes made' })
      return
    }
    try {
      const userId = selectedUser._id || selectedUser.id
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      })
      if (res.ok) {
        const updatedUser = await res.json()
        setUsers(users.map(u => (u._id || u.id) === (updatedUser._id || updatedUser.id) ? updatedUser : u))
        setSnack({ open: true, severity: 'success', message: `Role updated to ${newRole}` })
      } else {
        const data = await res.json().catch(() => ({}))
        setSnack({ open: true, severity: 'error', message: data.error || 'Failed to update role' })
      }
    } catch (err) {
      console.error(err)
      setSnack({ open: true, severity: 'error', message: 'Error updating role' })
    }
    setDialogOpen(false)
    setSelectedUser(null)
  }

  const handleDeleteUser = async () => {
    try {
      const userId = selectedUser._id || selectedUser.id
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok || res.status === 204) {
        setUsers(users.filter(u => (u._id || u.id) !== userId))
        setSnack({ open: true, severity: 'success', message: `User ${selectedUser.email} deleted successfully` })
      } else {
        const data = await res.json().catch(() => ({}))
        setSnack({ open: true, severity: 'error', message: data.error || 'Failed to delete user' })
      }
    } catch (err) {
      console.error(err)
      setSnack({ open: true, severity: 'error', message: err.message || 'Error deleting user' })
    }
    setDialogOpen(false)
    setSelectedUser(null)
  }

  const farmersCount = users.filter(u => u.role === 'farmer').length
  const buyersCount = users.filter(u => u.role === 'buyer').length
  const adminsCount = users.filter(u => u.role === 'admin').length

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>

  return (
    <Box className="page-container">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        User Management
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Total Users
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {users.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Farmers
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                {farmersCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Buyers
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                {buyersCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Admins
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.main' }}>
                {adminsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        All Users
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.light', '& .MuiTableCell-head': { fontWeight: 600 } }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Joined</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id || user.id}>
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
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    variant="outlined"
                    sx={{ 
                      mr: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                    onClick={() => openEditDialog(user)}
                  >
                    Edit Role
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    variant="outlined"
                    color="error"
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                    onClick={() => openDeleteDialog(user)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 4
          }
        }}
      >
        {dialogMode === 'edit' && (
          <>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>User:</strong> {selectedUser?.email}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select value={newRole} onChange={(e) => setNewRole(e.target.value)} label="Role">
                    <MenuItem value="buyer">Buyer</MenuItem>
                    <MenuItem value="farmer">Farmer</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button 
                onClick={() => setDialogOpen(false)}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditRole} 
                variant="contained"
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none',
                  px: 3,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Update Role
              </Button>
            </DialogActions>
          </>
        )}
        {dialogMode === 'delete' && (
          <>
            <DialogTitle>Delete User</DialogTitle>
            <DialogContent>
              <Typography sx={{ mt: 2, color: 'error.main' }}>
                Are you sure you want to delete <strong>{selectedUser?.email}</strong>?
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                This action will also remove all their products and orders.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button 
                onClick={() => setDialogOpen(false)}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteUser} 
                variant="contained" 
                color="error"
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none',
                  px: 3,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Delete User
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AdminUsers
