import React from 'react'
import { Box, Paper, Typography, TextField, Button, Stack, Alert, RadioGroup, FormControlLabel, Radio, FormLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [form, setForm] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  })
  const [errors, setErrors] = React.useState({ passwordMatch: '' })
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

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
    setErrors({ passwordMatch: '' })
    setLoading(true)
    fetch('http://localhost:4000/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.username, email: form.email, password: form.password, role: form.role })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Registration failed')
        // store token and user
        if (data.token) localStorage.setItem('ac_token', data.token)
        if (data.user) localStorage.setItem('ac_user', JSON.stringify(data.user))
        navigate('/')
      })
      .catch((err) => setErrors((prev) => ({ ...prev, submit: err.message })))
      .finally(() => setLoading(false))
  }

  return (
    <Box className="page-container" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={1} sx={{ p: 3, width: '100%', maxWidth: 480 }}>
        <Typography variant="h5" gutterBottom>Create your account</Typography>
        <Stack component="form" onSubmit={onSubmit} spacing={2}>
          {errors.submit && <Alert severity="error">{errors.submit}</Alert>}
          <TextField
            name="username"
            label="Username"
            required
            fullWidth
            value={form.username}
            onChange={onChange}
          />
          <div>
            <FormLabel component="legend">Sign up as</FormLabel>
            <RadioGroup row name="role" value={form.role} onChange={onChange}>
              <FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
              <FormControlLabel value="farmer" control={<Radio />} label="Farmer" />
              <FormControlLabel value="admin" control={<Radio />} label="Admin" />
            </RadioGroup>
          </div>
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
          <Button type="submit" variant="contained" color="primary" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</Button>
        </Stack>
      </Paper>
    </Box>
  )
}

export default Register