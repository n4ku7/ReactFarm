import React from 'react'
import { Grid, Card, CardContent, Typography, Button, List, ListItem, ListItemText } from '@mui/material'

const recentOrder = (id, status) => (
    <ListItem key={id} divider>
        <ListItemText primary={`Order #${id}`} secondary={`Status: ${status}`} />
        <Button size="small">View</Button>
    </ListItem>
)

const BuyerDashboardIndex = () => (
    <div className="page-container">
        <Typography variant="h4" gutterBottom>Buyer Dashboard</Typography>

        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Quick Actions</Typography>
                        <Button variant="contained" color="primary" sx={{ mr: 1 }}>Browse Marketplace</Button>
                        <Button variant="outlined">View Cart</Button>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Account Summary</Typography>
                        <Typography>Saved addresses: 2</Typography>
                        <Typography>Payment methods: 1</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Typography variant="h6">Recent Orders</Typography>
                <List>
                    {recentOrder(10234, 'Shipped')}
                    {recentOrder(10233, 'Processing')}
                    {recentOrder(10232, 'Delivered')}
                </List>
            </CardContent>
        </Card>
    </div>
)

export default BuyerDashboardIndex