import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AgricultureIcon from '@mui/icons-material/Agriculture'
import React from 'react'

const Navbar = () => {
  const navigate = useNavigate()
  const [query, setQuery] = React.useState('')

  const submitSearch = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/marketplace?q=${encodeURIComponent(trimmed)}` : '/marketplace')
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
        <Button color="inherit" component={RouterLink} to="/login">Login</Button>
        <Button color="inherit" component={RouterLink} to="/signup">Signup</Button>
        <IconButton color="inherit" sx={{ ml: 1 }}>
          <ShoppingCartIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar