import { Card, CardContent, Typography, Grid, Button } from '@mui/material'

const stat = (title, value) => (
  <Card>
    <CardContent>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h5">{value}</Typography>
    </CardContent>
  </Card>
)

const AdminDashboard = () => (
  <div className="page-container">
    <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>{stat('Total Users', '12,342')}</Grid>
      <Grid item xs={12} sm={4}>{stat('Active Listings', '1,235')}</Grid>
      <Grid item xs={12} sm={4}>{stat('Pending Approvals', '18')}</Grid>
    </Grid>

    <Card style={{ marginTop: 16 }}>
      <CardContent>
        <Typography variant="h6">Recent Actions</Typography>
        <Typography variant="body2">- Approved 3 product listings</Typography>
        <Typography variant="body2">- Resolved 1 transaction dispute</Typography>
      </CardContent>
    </Card>

    <div style={{ marginTop: 16 }}>
      <Button variant="contained" color="primary">Go to Platform Settings</Button>
    </div>
  </div>
)

export default AdminDashboard