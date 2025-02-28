import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import EmailConfirmSuccess from './components/EmailConfirmSuccess';
import SetupPassword from './components/SetupPassword';
import { ToastContainer } from 'react-toastify';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Routes>
          <Route path="/signup" element={!session ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
          <Route path="/email-confirm-success" element={<EmailConfirmSuccess />} />
          {/* Make setup-password accessible regardless of auth state */}
          <Route path="/setup-password" element={<SetupPassword />} />
          <Route path="/" element={session ? <Dashboard /> : <Navigate to="/login" />} />
          {/* ... other routes ... */}
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;