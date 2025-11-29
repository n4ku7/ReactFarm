import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'
import AgricultureIcon from '@mui/icons-material/Agriculture'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import StarIcon from '@mui/icons-material/Star'

const Card = ({ icon, title, children }) => (
  <Paper elevation={1} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
    {icon}
    <div>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary">{children}</Typography>
    </div>
  </Paper>
)

const Home = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Typography variant="h3" component="h1">Welcome to AgriCraft</Typography>
    <Typography variant="subtitle1" sx={{ mt: 1 }}>Your global marketplace for value-added farm goods.</Typography>

    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
      <Box sx={{ flex: 1 }}>
        <Card icon={<LocalGroceryStoreIcon color="primary" sx={{ fontSize: 36 }} />} title="Explore Products">
          Browse trending and featured farm products from verified producers.
        </Card>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Card icon={<AgricultureIcon color="primary" sx={{ fontSize: 36 }} />} title="Sell as Farmer">
          List your harvests and reach buyers globally with minimal fees.
        </Card>
      </Box>
    </Box>
    
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2">Our Aim</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        AgriCraft aims to create transparent, fair, and efficient market access for small and medium farmers by
        providing them with tools to list products, reach new buyers, and manage orders — while giving buyers
        discovery tools to find high-quality, responsibly produced agricultural goods.
      </Typography>
    </Box>

    {/* Professional section below Our Aim */}
    <Box sx={{ mt: 6 }}>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
            <Typography variant="h6">Trusted Producers</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>All sellers go through a verification process to ensure product quality and reliability.</Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <StarIcon color="warning" /> <StarIcon color="warning" /> <StarIcon color="warning" />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
            <Typography variant="h6">Fair Pricing</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>Transparent fees and pricing tools help farmers realise fair returns.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
            <Typography variant="h6">Logistics Support</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>Integration with local carriers and pickup options to simplify shipping.</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6">Real Impact</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Through AgriCraft, thousands of producers have found new markets and improved earnings. Join a community
              focused on sustainable growth and traceable quality.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Ready to start?</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>Create a seller account or browse products now.</Typography>
            <Button variant="contained" href="/marketplace">Explore Marketplace</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  </Container>
)

export default Home


