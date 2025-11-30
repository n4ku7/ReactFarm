import React from 'react'
import { Box, Paper, Typography, TextField, Button, Stack, Alert, RadioGroup, FormControlLabel, Radio, FormLabel, Fade } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { validators, validateForm } from '../../../utils/validation'

const Register = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  })
  const [errors, setErrors] = React.useState({})
  const [touched, setTouched] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const [submitError, setSubmitError] = React.useState('')

  const validateField = (name, value) => {
    const rules = {
      email: [validators.email],
      password: [validators.password],
      confirmPassword: [(val) => validators.confirmPassword(val, form.password)]
    }
    
    if (rules[name]) {
      for (const rule of rules[name]) {
        const error = rule(value)
        if (error) return error
      }
    }
    return ''
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
    
    // Clear submit error when user starts typing
    if (submitError) setSubmitError('')
  }

  const onBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    
    // Mark all fields as touched
    const allTouched = Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    setTouched(allTouched)
    
    // Validate all fields
    const validation = validateForm(form, {
      email: [validators.email],
      password: [validators.password],
      confirmPassword: [(val) => validators.confirmPassword(val, form.password)]
    })
    
    setErrors(validation.errors)
    
    if (!validation.isValid) {
      setSubmitError('Please fix the errors below')
      return
    }
    
    setLoading(true)
    try {
      await signup('', form.email, form.password, form.role)
      navigate('/')
    } catch (err) {
      setSubmitError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="page-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Fade in timeout={500}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            maxWidth: 500,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            Create Account
          </Typography>
          
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError('')}>
              {submitError}
            </Alert>
          )}
          
          <Stack component="form" onSubmit={onSubmit} spacing={3}>
            <Box>
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>Sign up as</FormLabel>
              <RadioGroup row name="role" value={form.role} onChange={onChange}>
                <FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
                <FormControlLabel value="farmer" control={<Radio />} label="Farmer" />
                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
              </RadioGroup>
            </Box>
            
            <TextField
              name="email"
              type="email"
              label="Email Address"
              required
              fullWidth
              value={form.email}
              onChange={onChange}
              onBlur={onBlur}
              error={Boolean(errors.email)}
              helperText={errors.email}
              autoComplete="email"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            
            <TextField
              name="password"
              type="password"
              label="Password"
              required
              fullWidth
              value={form.password}
              onChange={onChange}
              onBlur={onBlur}
              error={Boolean(errors.password)}
              helperText={errors.password || 'Must be at least 6 characters'}
              autoComplete="new-password"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            
            <TextField
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              required
              fullWidth
              value={form.confirmPassword}
              onChange={onChange}
              onBlur={onBlur}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              autoComplete="new-password"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={loading}
              fullWidth
              size="large"
              sx={{ 
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Stack>
        </Paper>
      </Fade>
    </Box>
  )
}

export default Register