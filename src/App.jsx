import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ThemeProvider from './components/common/ThemeProvider';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard/Index';
import BuyerDashboard from './pages/BuyerDashboard/Index';
import FarmerDashboard from './pages/FarmerDashboard/Index';
import GlobalMarketplace from './pages/GlobalMarketplace/Categories';
import About from './pages/Home/About';
import Contact from './pages/Home/Contact';

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
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;