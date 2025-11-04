import React from 'react'
import { Box, Paper, Typography, TextField, Button, Stack } from '@mui/material'

const Register = () => {
  const [form, setForm] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = React.useState({ passwordMatch: '' })

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'password' || name === 'confirmPassword') {
      const nextPassword = name === 'password' ? value : form.password
      const nextConfirm = name === 'confirmPassword' ? value : form.confirmPassword
      setErrors({ passwordMatch: nextPassword && nextConfirm && nextPassword !== nextConfirm ? 'Passwords do not match' : '' })
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setErrors({ passwordMatch: 'Passwords do not match' })
      return
    }
    console.log('Register submit', { username: form.username, email: form.email })
    // Hook up API here
  }

  return (
    <Box className="page-container" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={1} sx={{ p: 3, width: '100%', maxWidth: 480 }}>
        <Typography variant="h5" gutterBottom>Create your account</Typography>
        <Stack component="form" onSubmit={onSubmit} spacing={2}>
          <TextField
            name="username"
            label="Username"
            required
            fullWidth
            value={form.username}
            onChange={onChange}
          />
          <TextField
            name="email"
            type="email"
            label="Email"
            required
            fullWidth
            value={form.email}
            onChange={onChange}
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            required
            fullWidth
            value={form.password}
            onChange={onChange}
          />
          <TextField
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            required
            fullWidth
            value={form.confirmPassword}
            onChange={onChange}
            error={Boolean(errors.passwordMatch)}
            helperText={errors.passwordMatch}
          />
          <Button type="submit" variant="contained" color="primary">Create account</Button>
        </Stack>
      </Paper>
    </Box>
  )
}

export default Register