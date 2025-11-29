import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ThemeProvider from './components/common/ThemeProvider'
import { RoleRoute, ProtectedRoute } from './context/ProtectedRoute'
import Home from './pages/Home/Index'
import About from './pages/Home/About'
import Contact from './pages/Home/Contact'
import Login from './pages/Home/LoginRegister/Login'
import Register from './pages/Home/LoginRegister/Register'
import AdminDashboard from './pages/AdminDashboard/Index'
import AdminFeedbacks from './pages/AdminDashboard/Feedbacks'
import AdminUsers from './pages/AdminDashboard/Users'
import AdminOrders from './pages/AdminDashboard/Orders'
import BuyerDashboard from './pages/BuyerDashboard/Index'
import BuyerOrders from './pages/BuyerDashboard/Orders'
import BuyerCart from './pages/BuyerDashboard/Cart'
import FarmerDashboard from './pages/FarmerDashboard/Index'
import FarmerProducts from './pages/FarmerDashboard/Products'
import FarmerOrders from './pages/FarmerDashboard/Orders'
import FarmerEarnings from './pages/FarmerDashboard/Earnings'
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
            <Route path="/marketplace" element={<GlobalMarketplace />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
            <Route path="/admin/feedbacks" element={<RoleRoute roles={['admin']}><AdminFeedbacks /></RoleRoute>} />
            <Route path="/admin/users" element={<RoleRoute roles={['admin']}><AdminUsers /></RoleRoute>} />
            <Route path="/admin/orders" element={<RoleRoute roles={['admin']}><AdminOrders /></RoleRoute>} />

            {/* Farmer Routes */}
            <Route path="/farmer" element={<RoleRoute roles={['farmer']}><FarmerDashboard /></RoleRoute>} />
            <Route path="/farmer/products" element={<RoleRoute roles={['farmer']}><FarmerProducts /></RoleRoute>} />
            <Route path="/farmer/orders" element={<RoleRoute roles={['farmer']}><FarmerOrders /></RoleRoute>} />
            <Route path="/farmer/earnings" element={<RoleRoute roles={['farmer']}><FarmerEarnings /></RoleRoute>} />

            {/* Buyer Routes */}
            <Route path="/buyer" element={<RoleRoute roles={['buyer']}><BuyerDashboard /></RoleRoute>} />
            <Route path="/orders" element={<RoleRoute roles={['buyer']}><BuyerOrders /></RoleRoute>} />
            <Route path="/cart" element={<RoleRoute roles={['buyer']}><BuyerCart /></RoleRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
