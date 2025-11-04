import React from 'react'
import { Grid, Card, CardContent, Typography, Button, List, ListItem, ListItemText } from '@mui/material'

const pendingOrder = (id, buyer) => (
    <ListItem key={id} divider>
        <ListItemText primary={`Order #${id}`} secondary={`Buyer: ${buyer}`} />
        <Button size="small" color="primary">Mark Shipped</Button>
    </ListItem>
)

const FarmerDashboardIndex = () => (
    <div className="page-container">
        <Typography variant="h4" gutterBottom>Farmer Dashboard</Typography>

        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Inventory Snapshot</Typography>
                        <Typography>Products listed: 24</Typography>
                        <Typography>Low stock: 3</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Earnings</Typography>
                        <Typography>$4,320 this month</Typography>
                        <Button variant="outlined" sx={{ mt: 1 }}>Request Payout</Button>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Typography variant="h6">Pending Orders</Typography>
                <List>
                    {pendingOrder(5001, 'Buyer A')}
                    {pendingOrder(5000, 'Buyer B')}
                </List>
            </CardContent>
        </Card>
    </div>
)

export default FarmerDashboardIndex