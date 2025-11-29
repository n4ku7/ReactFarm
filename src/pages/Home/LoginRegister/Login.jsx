import React from 'react'
import { Box, Paper, Typography, TextField, Button, RadioGroup, FormControlLabel, Radio, FormLabel, Stack, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [role, setRole] = React.useState('buyer')
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const form = new FormData(e.currentTarget)
        const email = form.get('email')
        const password = form.get('password')
        if (!email || !password) return setError('Email and password required')
        setLoading(true)
        try {
            await login(email, password)
            navigate('/')
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
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
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</Button>
                </Stack>
            </Paper>
        </Box>
    )
}

export default Login