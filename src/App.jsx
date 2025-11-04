import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ThemeProvider from './components/common/ThemeProvider'
import Home from './pages/Home/Index'
import About from './pages/Home/About'
import Contact from './pages/Home/Contact'
import Login from './pages/Home/LoginRegister/Login'
import Register from './pages/Home/LoginRegister/Register'
import AdminDashboard from './pages/AdminDashboard/Index'
import BuyerDashboard from './pages/BuyerDashboard/Index'
import FarmerDashboard from './pages/FarmerDashboard/Index'
import GlobalMarketplace from './pages/GlobalMarketplace/Categories'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, padding: 16 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/buyer" element={<BuyerDashboard />} />
            <Route path="/farmer" element={<FarmerDashboard />} />
            <Route path="/marketplace" element={<GlobalMarketplace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
