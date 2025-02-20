import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!email.endsWith('@brokenmachines.com.br')) {
      setError('Only @brokenmachines.com.br emails are allowed');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting to create user with:', { email }); // Debug log

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email_confirmed: false,
          }
        }
      });

      console.log('Supabase response:', { data, error }); // Debug log

      if (error) {
        throw error;
      }

      if (data?.user) {
        alert('Account created! Please check your email to confirm your registration.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Full error object:', error); // Debug log
      setError(error.message || 'Failed to create account. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Create Account</h1>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="your-email@brokenmachines.com.br"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;