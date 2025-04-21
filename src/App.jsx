import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import FormPage from './pages/FormPage';
import Settings from './pages/Settings';
import './index.css';
import Conseiller from './pages/Conseiller';

const App = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/conseiller" element={<Conseiller />} />

        </Routes>
      </main>
    </div>
  );
};

export default App;