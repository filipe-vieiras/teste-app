import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';  // Updated import path

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Checking...');

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setConnectionStatus('Connection Error');
          console.error('Supabase connection error:', error);
        } else {
          setConnectionStatus('Connected to Supabase!');
          console.log('Supabase connection successful');
        }
      } catch (error) {
        setConnectionStatus('Connection Error');
        console.error('Error:', error);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Supabase Connection Test
        </h1>
        <p className={`text-center ${connectionStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {connectionStatus}
        </p>
      </div>
    </div>
  );
}

export default App;