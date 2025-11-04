import React from 'react'
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Chip, Stack } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const ProductCard = ({ product, onAddToCart }) => {
  const { title, price, image, rating, category } = product
  return (
    <Card>
      {image && (
        <CardMedia component="img" height="160" image={image} alt={title} />
      )}
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip label={category} size="small" color="secondary" variant="outlined" />
          <Chip label={`${rating}★`} size="small" color="success" />
        </Stack>
        <Typography variant="subtitle1" gutterBottom noWrap>{title}</Typography>
        <Typography variant="h6">${price.toFixed(2)}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" startIcon={<ShoppingCartIcon />} onClick={() => onAddToCart?.(product)}>
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductCard


