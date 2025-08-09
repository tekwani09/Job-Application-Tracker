import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import KanbanDashboard from './pages/KanbanDashboard';
import Profile from './pages/Profile';
import AddJob from './pages/AddJob';
import EditJob from './pages/EditJob';
import './App.css';
import './styles/theme.css';


function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<KanbanDashboard />} />
        <Route path="/list-view" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-job" element={<AddJob />} />
        <Route path="/edit-job/:id" element={<EditJob />} />
      </Routes>
    </Router>
  );
}

export default App;


