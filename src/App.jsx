// Main App Component for Monetized Voting App
// This component sets up routing and global providers

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Vote from './pages/Vote';
import AdminRoute from './components/AdminPanel/AdminRoute';
import AdminPanel from './components/AdminPanel/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import ContestantManagement from './pages/ContestantManagement';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vote/:contestantId" element={<Vote />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/admin/contestants" element={<AdminRoute><ContestantManagement /></AdminRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
