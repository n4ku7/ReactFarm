import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router-dom'

const Navbar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        AgriCraft
      </Typography>
      <Button color="inherit" component={RouterLink} to="/">Home</Button>
      <Button color="inherit" component={RouterLink} to="/about">About</Button>
      <Button color="inherit" component={RouterLink} to="/contact">Contact</Button>
      <Button color="inherit" component={RouterLink} to="/login">Login</Button>
      <Button color="inherit" component={RouterLink} to="/signup">Signup</Button>
    </Toolbar>
  </AppBar>
)

export default Navbar