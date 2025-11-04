import React from 'react'
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router-dom'

const NotFound = () => (
  <div style={{ padding: 32, textAlign: 'center' }}>
    <h1>404 — Page not found</h1>
    <p>The page you were looking for doesn't exist or has been moved.</p>
    <Button component={RouterLink} to="/" variant="contained" color="primary">Go to Home</Button>
  </div>
)

export default NotFound
