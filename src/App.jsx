import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ThemeProvider from './components/common/ThemeProvider';
import Home from './pages/Home/Index';
import AdminDashboard from './pages/AdminDashboard/Index';
import BuyerDashboard from './pages/BuyerDashboard/Index';
import FarmerDashboard from './pages/FarmerDashboard/Index';
import GlobalMarketplace from './pages/GlobalMarketplace/Categories';
import About from './pages/Home/About';
import Contact from './pages/Home/Contact';
import Login from './pages/Home/LoginRegister/Login';
import Register from './pages/Home/LoginRegister/Register';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/buyer" element={<BuyerDashboard />} />
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/marketplace" element={<GlobalMarketplace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;