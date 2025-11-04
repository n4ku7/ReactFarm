import React from 'react'
import { Box, Paper, Typography, TextField, Button, RadioGroup, FormControlLabel, Radio, FormLabel, Stack } from '@mui/material'

const Login = () => {
    const [role, setRole] = React.useState('customer')

    const handleSubmit = (e) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const email = form.get('email')
        const password = form.get('password')
        console.log('Login submit', { email, role, passwordPresent: Boolean(password) })
        // Navigate or call API here
    }

    return (
        <Box className="page-container" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={1} sx={{ p: 3, width: '100%', maxWidth: 420 }}>
                <Typography variant="h5" gutterBottom>Login</Typography>
                <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                    <div>
                        <FormLabel component="legend">Login as</FormLabel>
                        <RadioGroup row name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                            <FormControlLabel value="farmer" control={<Radio />} label="Farmer" />
                            <FormControlLabel value="customer" control={<Radio />} label="Customer" />
                            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                        </RadioGroup>
                    </div>
                    <TextField name="email" type="email" label="Email" required fullWidth />
                    <TextField name="password" type="password" label="Password" required fullWidth />
                    <Button type="submit" variant="contained" color="primary">Login</Button>
                </Stack>
            </Paper>
        </Box>
    )
}

export default Login