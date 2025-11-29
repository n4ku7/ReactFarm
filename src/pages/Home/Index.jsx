import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'
import AgricultureIcon from '@mui/icons-material/Agriculture'

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
  <div className="page-container">
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
  </div>
)

export default Home


