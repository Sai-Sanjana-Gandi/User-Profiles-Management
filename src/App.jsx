import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider, ToastContainer } from './components/Toast';
import { Dashboard } from './pages/Dashboard';

/**
 * Main App component with routing
 */
function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="App">
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
