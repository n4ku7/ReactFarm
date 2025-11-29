import React from 'react'
import { Box, Grid, Paper, Typography, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Chip, Stack, Divider, Button } from '@mui/material'
import { Search as SearchIcon, FilterAlt as FilterAltIcon, Sort as SortIcon } from '@mui/icons-material'
import ProductCard from '../../components/common/ProductCard'
import { useSearchParams } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const ALL_PRODUCTS = [
  { id: 1, title: 'Organic Honey 500g', price: 499, category: 'Honey', rating: 4.6, image: 'https://spiisry.in/wp-content/uploads/2021/06/Honey-PNG-Transparent-Image.png' },
  { id: 2, title: 'Free-range Eggs (12 pack)', price: 249, category: 'Eggs', rating: 4.4, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800&auto=format&fit=crop' },
  { id: 3, title: 'Extra Virgin Olive Oil 1L', price: 799, category: 'Oils', rating: 4.7, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=800&auto=format&fit=crop' },
  { id: 4, title: 'Almonds 1kg', price: 799, category: 'Nuts', rating: 4.5, image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?q=80&w=800&auto=format&fit=crop' },
  { id: 5, title: 'Sun-dried Tomatoes 250g', price: 349, category: 'Vegetables', rating: 4.2, image: 'https://panettamercato.com.au/wp-content/uploads/2021/07/Tomatoes-Semi-Dried-250g-Panneta-Mercato.png' },
  { id: 6, title: 'Goat Cheese 200g', price: 449, category: 'Dairy', rating: 4.3, image: 'https://m.media-amazon.com/images/I/61vq-5dGCxL._SX679_.jpg' },
]

const categories = ['All', 'Honey', 'Eggs', 'Oils', 'Nuts', 'Vegetables', 'Dairy']

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [search, setSearch] = React.useState(q)
  const [category, setCategory] = React.useState('All')
  const [sortBy, setSortBy] = React.useState('relevance')
  const { addToCart } = useCart()

  const filtered = React.useMemo(() => {
    let items = ALL_PRODUCTS.filter(p =>
      (!q || p.title.toLowerCase().includes(q.toLowerCase())) &&
      (category === 'All' || p.category === category)
    )
    if (sortBy === 'priceAsc') items = items.slice().sort((a, b) => a.price - b.price)
    if (sortBy === 'priceDesc') items = items.slice().sort((a, b) => b.price - a.price)
    if (sortBy === 'rating') items = items.slice().sort((a, b) => b.rating - a.rating)
    return items
  }, [q, category, sortBy])

  const applySearch = (e) => {
    e.preventDefault()
    const next = search.trim()
    const params = new URLSearchParams(searchParams)
    if (next) params.set('q', next); else params.delete('q')
    setSearchParams(params)
  }

  const clearFilters = () => {
    setCategory('All')
    setSortBy('relevance')
    setSearch('')
    setSearchParams(new URLSearchParams())
  }

  return (
    <Box className="page-container">
      <Typography variant="h4" gutterBottom>Marketplace</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} component="form" onSubmit={applySearch}>
          <TextField
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="cat-label"><FilterAltIcon sx={{ mr: 1 }} />Category</InputLabel>
            <Select labelId="cat-label" value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
              {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="sort-label"><SortIcon sx={{ mr: 1 }} />Sort by</InputLabel>
            <Select labelId="sort-label" value={sortBy} label="Sort by" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="relevance">Relevance</MenuItem>
              <MenuItem value="priceAsc">Price: Low to High</MenuItem>
              <MenuItem value="priceDesc">Price: High to Low</MenuItem>
              <MenuItem value="rating">Customer Rating</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained">Apply</Button>
          <Button type="button" variant="text" onClick={clearFilters}>Reset</Button>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {category !== 'All' && <Chip label={`Category: ${category}`} />}
          {q && <Chip label={`Search: ${q}`} />}
          {sortBy !== 'relevance' && <Chip label={`Sorted: ${sortBy}`} />}
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        {filtered.map(p => (
          <Grid item key={p.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={p} onAddToCart={(product) => addToCart({ productId: p.id, title: p.title, price: p.price, quantity: 1 })} />
          </Grid>
        ))}
      </Grid>
      {filtered.length === 0 && (
        <Typography sx={{ mt: 2 }}>No products found. Try adjusting your search or filters.</Typography>
      )}
    </Box>
  )
}

export default Marketplace