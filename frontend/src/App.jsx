import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CarProvider } from './context/CarContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarSelection from './pages/CarSelection';
import Customizer from './pages/Customizer';
import Dashboard from './pages/Dashboard';
import MyGarage from './pages/MyGarage';
import Auth from './pages/Auth';

function App() {
  return (
    <CarProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<CarSelection />} />
              <Route path="/customize" element={<Customizer />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/garage" element={<MyGarage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CarProvider>
  );
}

export default App;
