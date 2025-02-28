import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function SetupPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from URL hash params (Supabase adds these after email confirmation)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (accessToken) {
      // Get user info from the token
      const getUserInfo = async () => {
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);
        if (error) {
          console.error('Error getting user:', error);
          setError('Failed to verify your account. Please try again.');
        } else if (user) {
          setEmail(user.email);
        }
      };
      
      getUserInfo();
    } else {
      setError('Invalid confirmation link. Please check your email and try again.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      // Create profile entry if it doesn't exist
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .single();
          
        if (!profile) {
          // Create profile if it doesn't exist
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email,
            role: user.user_metadata?.role || 'editor',
            created_at: new Date().toISOString()
          });
        }
      }
      
      // Redirect to dashboard
      toast.success('Password set successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error setting password:', error);
      setError(error.message || 'Failed to set password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Set Your Password</h1>
        
        {email && (
          <div className="mb-4 text-center text-gray-600">
            Setting up password for: <strong>{email}</strong>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              {loading ? 'Setting Password...' : 'Set Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SetupPassword;