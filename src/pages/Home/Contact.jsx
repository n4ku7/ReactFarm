import React, { useState } from 'react'
import { Container, TextField, Button, Paper, Grid, Box, Typography, Divider, Snackbar, Alert, InputAdornment } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SendIcon from '@mui/icons-material/Send'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [snack, setSnack] = useState({ open: false, severity: 'success', message: '' })

  const onChange = (field) => (e) => setForm((s) => ({ ...s, [field]: e.target.value }))

  const isEmailValid = (email) => {
    if (!email) return true // optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validate = () => {
    if (!form.subject || form.subject.trim().length < 3) return { ok: false, msg: 'Please enter a subject (3+ characters).' }
    if (!form.message || form.message.trim().length < 10) return { ok: false, msg: 'Message should be at least 10 characters.' }
    if (!isEmailValid(form.email)) return { ok: false, msg: 'Please enter a valid email address.' }
    return { ok: true }
  }

  const handleSubmit = async (e) => {
    e && e.preventDefault()
    const v = validate()
    if (!v.ok) {
      setSnack({ open: true, severity: 'error', message: v.msg })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, subject: form.subject, message: form.message, topic: form.subject })
      })
      if (!res.ok) throw new Error('Network response was not ok')
      setSnack({ open: true, severity: 'success', message: 'Thanks — we received your message and will get back shortly.' })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      console.error(err)
      setSnack({ open: true, severity: 'error', message: 'Could not send message. Please try again later.' })
    }
    setSubmitting(false)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Contact Us</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Questions, partnership inquiries or feedback — we're happy to help. Use the form or reach us through the contact details.</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6">Get in touch</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>Our team typically replies within 1 business day.</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PhoneIcon color="action" />
              <Typography>+91 98765 43210</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <EmailIcon color="action" />
              <Typography>support@agricraft.example</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon color="action" />
              <Typography>Chennai, India</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary">Business hours</Typography>
            <Typography color="text.secondary">Mon — Fri: 9:00 AM — 6:00 PM IST</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper elevation={1} sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Your name" value={form.name} onChange={onChange('name')} fullWidth placeholder="First & last name" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={form.email}
                  onChange={onChange('email')}
                  fullWidth
                  placeholder="you@company.com"
                  InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>) }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField label="Subject" value={form.subject} onChange={onChange('subject')} fullWidth placeholder="What is this regarding?" />
              </Grid>

              <Grid item xs={12}>
                <TextField label="Message" value={form.message} onChange={onChange('message')} fullWidth multiline rows={6} placeholder="Tell us more — be as specific as you can." />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" sx={{ mr: 2 }} onClick={() => setForm({ name: '', email: '', subject: '', message: '' })} disabled={submitting}>Clear</Button>
                <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={submitting}>Send Message</Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Contact