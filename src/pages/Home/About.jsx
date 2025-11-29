import React from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'

const About = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box component="img" src="/images/group-logo.svg" alt="AgriCraft group logo" sx={{ width: 120, height: 120 }} />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom>About AgriCraft</Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                AgriCraft is a marketplace built to connect small and medium farmers with buyers around the world. We
                prioritise fairness, transparency and traceability so producers can get a better price and buyers can
                trust the origin and quality of their purchases.
            </Typography>

            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 3 }}>
                        <Typography variant="h6">Our Mission</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Empower farmers by providing simple listing tools, transparent pricing, and direct access to
                            regional and international buyers.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 3 }}>
                        <Typography variant="h6">Our Vision</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            A resilient agricultural supply chain where quality producers are rewarded fairly and consumers
                            can discover sustainably produced farm goods.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                    <Typography variant="h6">Values we stand by</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                        <Paper sx={{ p: 2, minWidth: 160 }} elevation={0}>
                            <Typography fontWeight={700}>Transparency</Typography>
                            <Typography color="text.secondary">Clear fees, seller information and traceability.</Typography>
                        </Paper>
                        <Paper sx={{ p: 2, minWidth: 160 }} elevation={0}>
                            <Typography fontWeight={700}>Fair Pricing</Typography>
                            <Typography color="text.secondary">Tools to help producers capture more value.</Typography>
                        </Paper>
                        <Paper sx={{ p: 2, minWidth: 160 }} elevation={0}>
                            <Typography fontWeight={700}>Quality</Typography>
                            <Typography color="text.secondary">Verified producers and buyer feedback to maintain standards.</Typography>
                        </Paper>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                        <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }}>AC</Avatar>
                        <Typography variant="subtitle1">Get Involved</Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>Become a seller or partner with AgriCraft.</Typography>
                        <Button variant="contained" href="/contact">Contact Us</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default About