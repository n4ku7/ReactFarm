import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

const topics = ['General', 'Product Feedback', 'Shipping', 'Other']

const Contact = () => {
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [form, setForm] = React.useState({ name: '', email: '', topic: 'General', rating: 0, message: '', consent: false })

  const openForm = () => setOpen(true)
  const closeForm = () => setOpen(false)

  const onChange = (field) => (e) => {
    const value = field === 'consent' ? e.target.checked : e.target.value
    setForm((s) => ({ ...s, [field]: value }))
  }

  const [snack, setSnack] = React.useState({ open: false, severity: 'success', message: '' })

  const isValid = () => {
    // require message at least 10 chars
    return form.message && form.message.trim().length >= 10
  }

  const submit = async () => {
    if (!isValid()) {
      setSnack({ open: true, severity: 'error', message: 'Please enter a message of at least 10 characters.' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('http://localhost:4000/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setSnack({ open: true, severity: 'success', message: 'Thank you — your feedback was submitted.' })
      setForm({ name: '', email: '', topic: 'General', rating: 0, message: '', consent: false })
      closeForm()
    } catch (err) {
      console.error(err)
      setSnack({ open: true, severity: 'error', message: 'Could not submit feedback. Please try again later.' })
    }
    setSubmitting(false)
  }

  return (
    <div className="page-container">
      <Typography variant="h4" component="h1">Contact Us</Typography>
      <Typography sx={{ mt: 1 }}>Need help or want to share feedback? We’d love to hear from you.</Typography>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={openForm}>Send Feedback</Button>
      </Box>

      <Dialog open={open} onClose={closeForm} fullWidth maxWidth="sm">
        <DialogTitle>Send Feedback</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Name (optional)" value={form.name} onChange={onChange('name')} fullWidth />
            <TextField label="Email (optional)" value={form.email} onChange={onChange('email')} fullWidth />
            <TextField select label="Topic" value={form.topic} onChange={onChange('topic')}>
              {topics.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Rating</Typography>
              <Rating value={form.rating} onChange={(e, v) => setForm((s) => ({ ...s, rating: v || 0 }))} />
            </Box>

            <TextField label="Message" value={form.message} onChange={onChange('message')} multiline rows={4} fullWidth />
            <FormControlLabel control={<Checkbox checked={form.consent} onChange={onChange('consent')} />} label="I consent to my feedback being stored for product improvement (optional)" />
          </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeForm} disabled={submitting}>Cancel</Button>
            <Button onClick={submit} variant="contained" disabled={submitting || !isValid()}>Send</Button>
        </DialogActions>
      </Dialog>
        <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))} sx={{ width: '100%' }}>
            {snack.message}
          </Alert>
        </Snackbar>
    </div>
  )
}

export default Contact