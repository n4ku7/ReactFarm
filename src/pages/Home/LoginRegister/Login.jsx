import React, { useRef } from 'react'
import { Box, Paper, Typography, TextField, Button, RadioGroup, FormControlLabel, Radio, FormLabel, Stack, Alert, Fade } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { validators } from '../../../utils/validation'

// Load reCAPTCHA script
const loadRecaptcha = () => {
  return new Promise((resolve) => {
    if (window.grecaptcha) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => {
      window.grecaptcha.ready(() => resolve())
    }
    document.body.appendChild(script)
  })
}

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [role, setRole] = React.useState('buyer')
    const [form, setForm] = React.useState({ email: '', password: '' })
    const [errors, setErrors] = React.useState({})
    const [touched, setTouched] = React.useState({})
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const recaptchaRef = useRef(null)
    const [recaptchaLoaded, setRecaptchaLoaded] = React.useState(false)

    React.useEffect(() => {
      loadRecaptcha().then(() => {
        setRecaptchaLoaded(true)
        if (recaptchaRef.current && window.grecaptcha) {
          window.grecaptcha.render(recaptchaRef.current, {
            sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Google's test key - replace with your own
            theme: 'light'
          })
        }
      })
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        
        if (touched[name]) {
            const error = name === 'email' ? validators.email(value) : validators.required(value, 'Password')
            setErrors(prev => ({ ...prev, [name]: error }))
        }
        
        if (error) setError('')
    }

    const handleBlur = (e) => {
        const { name, value } = e.target
        setTouched(prev => ({ ...prev, [name]: true }))
        const error = name === 'email' ? validators.email(value) : validators.required(value, 'Password')
        setErrors(prev => ({ ...prev, [name]: error }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        
        // Mark all fields as touched
        setTouched({ email: true, password: true })
        
        // Validate
        const emailError = validators.email(form.email)
        const passwordError = validators.required(form.password, 'Password')
        const validationErrors = {}
        if (emailError) validationErrors.email = emailError
        if (passwordError) validationErrors.password = passwordError
        
        setErrors(validationErrors)
        
        if (Object.keys(validationErrors).length > 0) {
            setError('Please fix the errors below')
            return
        }
        
        // Get reCAPTCHA token
        let recaptchaToken = ''
        if (window.grecaptcha && recaptchaRef.current) {
          try {
            recaptchaToken = window.grecaptcha.getResponse()
            if (!recaptchaToken) {
              setError('Please complete the reCAPTCHA verification')
              return
            }
          } catch (err) {
            console.error('reCAPTCHA error:', err)
            setError('reCAPTCHA verification failed. Please try again.')
            return
          }
        }
        
        setLoading(true)
        try {
            await login(form.email, form.password, recaptchaToken)
            navigate('/')
        } catch (err) {
            setError(err.message)
        } finally {
          setLoading(false)
          // Reset reCAPTCHA
          if (window.grecaptcha && recaptchaRef.current) {
            window.grecaptcha.reset()
          }
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
                        maxWidth: 450,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                    }}
                >
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                        Welcome Back
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}
                    
                    <Stack component="form" onSubmit={handleSubmit} spacing={3}>
                        <Box>
                            <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>Login as</FormLabel>
                            <RadioGroup row name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                                <FormControlLabel value="farmer" control={<Radio />} label="Farmer" />
                                <FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
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
                            onChange={handleChange}
                            onBlur={handleBlur}
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
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            autoComplete="current-password"
                            sx={{ 
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                            <div ref={recaptchaRef}></div>
                        </Box>
                        
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            disabled={loading || !recaptchaLoaded}
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
                            {loading ? 'Signing in...' : 'Login'}
                        </Button>
                    </Stack>
                </Paper>
            </Fade>
        </Box>
    )
}

export default Login