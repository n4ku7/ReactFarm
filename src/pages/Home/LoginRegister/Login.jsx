import React, { useRef } from 'react'
import { Box, Paper, Typography, TextField, Button, RadioGroup, FormControlLabel, Radio, FormLabel, Stack, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const form = new FormData(e.currentTarget)
        const email = form.get('email')
        const password = form.get('password')
        if (!email || !password) return setError('Email and password required')
        
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
            await login(email, password, recaptchaToken)
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
        <Box className="page-container" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={1} sx={{ p: 3, width: '100%', maxWidth: 420 }}>
                <Typography variant="h5" gutterBottom>Login</Typography>
                <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <div>
                        <FormLabel component="legend">Login as</FormLabel>
                        <RadioGroup row name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                            <FormControlLabel value="farmer" control={<Radio />} label="Farmer" />
                            <FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
                            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                        </RadioGroup>
                    </div>
                    <TextField name="email" type="email" label="Email" required fullWidth />
                    <TextField name="password" type="password" label="Password" required fullWidth />
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                      <div ref={recaptchaRef}></div>
                    </Box>
                    <Button type="submit" variant="contained" color="primary" disabled={loading || !recaptchaLoaded}>{loading ? 'Signing in...' : 'Login'}</Button>
                </Stack>
            </Paper>
        </Box>
    )
}

export default Login