import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AgricultureIcon from '@mui/icons-material/Agriculture'
import React from 'react'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [query, setQuery] = React.useState('')
  const [anchorEl, setAnchorEl] = React.useState(null)

  const submitSearch = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/marketplace?q=${encodeURIComponent(trimmed)}` : '/marketplace')
  }

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)
  const handleLogout = () => {
    logout()
    handleMenuClose()
    navigate('/')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <AgricultureIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 0, mr: 2 }} component={RouterLink} to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          AgriCraft
        </Typography>

        <Box component="form" onSubmit={submitSearch} sx={{ flexGrow: 1, maxWidth: 520, mx: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search products, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>

        <Button color="inherit" component={RouterLink} to="/">Home</Button>
        <Button color="inherit" component={RouterLink} to="/marketplace">Marketplace</Button>
        <Button color="inherit" component={RouterLink} to="/about">About</Button>
        <Button color="inherit" component={RouterLink} to="/contact">Contact</Button>

        {user?.role === 'farmer' && (
          <Button color="inherit" component={RouterLink} to="/farmer">Farm</Button>
        )}

        {user?.role === 'admin' && (
          <Button color="inherit" component={RouterLink} to="/admin">Admin</Button>
        )}

        {!user ? (
          <>
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            <Button color="inherit" component={RouterLink} to="/signup">Signup</Button>
          </>
        ) : (
          <>
            {user.role === 'buyer' && (
              <IconButton color="inherit" component={RouterLink} to="/cart" sx={{ ml: 1 }}>
                <ShoppingCartIcon />
              </IconButton>
            )}
            <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {user.name?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>{user.email}</MenuItem>
              <MenuItem disabled sx={{ fontSize: '0.85rem' }}>{user.role}</MenuItem>
              {user.role === 'buyer' && (
                <MenuItem component={RouterLink} to="/orders" onClick={handleMenuClose}>My Orders</MenuItem>
              )}
              {user.role === 'farmer' && (
                <>
                  <MenuItem component={RouterLink} to="/farmer/products" onClick={handleMenuClose}>My Products</MenuItem>
                  <MenuItem component={RouterLink} to="/farmer/orders" onClick={handleMenuClose}>Orders</MenuItem>
                  <MenuItem component={RouterLink} to="/farmer/earnings" onClick={handleMenuClose}>Earnings</MenuItem>
                </>
              )}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
