import React from 'react'

const Home = () => (
  <div className="page-container">
    <h1>Welcome to AgriCraft</h1>
    <p>Your global marketplace for value-added farm goods.</p>
    <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
      <div style={{ flex: 1, padding: 16, background: '#fff', borderRadius: 8 }}>
        <h3>Explore Products</h3>
        <p>Browse trending and featured farm products from verified producers.</p>
      </div>
      <div style={{ flex: 1, padding: 16, background: '#fff', borderRadius: 8 }}>
        <h3>Sell as Farmer</h3>
        <p>List your harvests and reach buyers globally with minimal fees.</p>
      </div>
    </div>
  </div>
)

export default Home


