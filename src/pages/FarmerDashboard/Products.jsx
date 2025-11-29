import React from 'react'
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Alert, CircularProgress, Chip } from '@mui/material'
import { useAuth } from '../../../context/AuthContext'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const FarmerProducts = () => {
  const { token } = useAuth()
  const [products, setProducts] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState(null)
  const [form, setForm] = React.useState({ title: '', description: '', price: 0, stock: 0, category: 'Vegetables' })
  const [message, setMessage] = React.useState({ type: '', text: '' })
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    fetchProducts()
  }, [token])

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) setProducts(data.filter(p => p.farmerId)) // filter to own products
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingId(product._id)
      setForm({ title: product.title, description: product.description, price: product.price, stock: product.stock, category: product.category })
    } else {
      setEditingId(null)
      setForm({ title: '', description: '', price: 0, stock: 0, category: 'Vegetables' })
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title || form.price <= 0 || form.stock < 0) {
      setMessage({ type: 'error', text: 'Please fill all required fields' })
      return
    }
    setSubmitting(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId
        ? `http://localhost:4000/api/products/${editingId}`
        : 'http://localhost:4000/api/products'
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed')
      setMessage({ type: 'success', text: editingId ? 'Product updated' : 'Product created' })
      setDialogOpen(false)
      fetchProducts()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
    setSubmitting(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      const res = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete')
      setMessage({ type: 'success', text: 'Product deleted' })
      fetchProducts()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>

  return (
    <Box className="page-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">My Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Add Product</Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      {!products.length ? (
        <Typography>No products yet. <Button onClick={() => handleOpenDialog()}>Create one</Button></Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell align="right"><strong>Price</strong></TableCell>
                <TableCell align="right"><strong>Stock</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(p => (
                <TableRow key={p._id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell align="right">₹{p.price}</TableCell>
                  <TableCell align="right">{p.stock}</TableCell>
                  <TableCell><Chip label={p.category} size="small" /></TableCell>
                  <TableCell align="center">
                    <Button size="small" onClick={() => handleOpenDialog(p)}><EditIcon sx={{ fontSize: 18 }} /></Button>
                    <Button size="small" color="error" onClick={() => handleDelete(p._id)}><DeleteIcon sx={{ fontSize: 18 }} /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Product Name"
              fullWidth
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
              label="Price (₹)"
              type="number"
              fullWidth
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
            />
            <TextField
              label="Stock Quantity"
              type="number"
              fullWidth
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
            />
            <TextField
              label="Category"
              fullWidth
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FarmerProducts
