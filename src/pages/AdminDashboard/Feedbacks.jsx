import React from 'react'
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material'

const Feedbacks = () => {
  const [loading, setLoading] = React.useState(true)
  const [feedbacks, setFeedbacks] = React.useState([])
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/feedbacks')
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        if (mounted) setFeedbacks(data)
      } catch (err) {
        console.error(err)
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="page-container">
      <Typography variant="h4" gutterBottom>Feedbacks</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Topic</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{new Date(f.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{f.name || '-'}</TableCell>
                  <TableCell>{f.email || '-'}</TableCell>
                  <TableCell>{f.topic}</TableCell>
                  <TableCell>{f.rating || '-'}</TableCell>
                  <TableCell style={{ maxWidth: 400, whiteSpace: 'normal' }}>{f.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )
}

export default Feedbacks
