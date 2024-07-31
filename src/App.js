
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PrivateDeclarations from './components/PrivateDeclarations';
import PublicDeclarations from './components/PublicDeclarations';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container"> { }
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/private-declarations" element={<PrivateDeclarations />} />
          <Route path="/public-declarations" element={<PublicDeclarations />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
