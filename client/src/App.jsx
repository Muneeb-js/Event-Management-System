import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import EditProfile from './pages/EditProfile';
import PreviousEvents from './pages/PreviousEvents';
import Calendar from './pages/Calendar';
import AskAnything from './pages/AskAnything';
import CheckInPass from './pages/CheckInPass';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        
        {/* Protected Routes */}
        <Route path="/events/:eventId/checkin-pass/:studentId" element={
          <ProtectedRoute>
            <CheckInPass />
          </ProtectedRoute>
        } />
        <Route path="/events/:id/edit" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <EditEvent />
          </ProtectedRoute>
        } />
        <Route path="/previous-events" element={<PreviousEvents />} />
        <Route path="/calendar" element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/create-event" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <CreateEvent />
          </ProtectedRoute>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/ask-anything" element={<AskAnything />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
