import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          window.location.replace('/login');
          return;
        }
      } catch (error) {
        console.error('Session error:', error);
        window.location.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.replace('/login');
    } catch (error) {
      console.error('Error:', error);
      window.location.replace('/login');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`text-xl ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>Loading...</div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-[#151932] text-white ${
          isSidebarOpen ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transform transition-transform duration-300 ease-in-out fixed md:static z-10 w-64 ${
        darkMode ? 'bg-gray-800' : 'bg-[#151932]'
      } min-h-screen p-4 flex flex-col`}>
        <div className="flex items-center justify-between mb-8">
          <span className="text-white text-2xl font-semibold">BrokenMachines</span>
          <button onClick={toggleSidebar} className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center text-white p-2 rounded-lg hover:bg-opacity-25 hover:bg-white">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-white p-2 rounded-lg hover:bg-opacity-25 hover:bg-white">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Team
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-white p-2 rounded-lg hover:bg-opacity-25 hover:bg-white">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Projects
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-white p-2 rounded-lg hover:bg-opacity-25 hover:bg-white">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendar
              </a>
            </li>
            
            {/* Dark Mode Button */}
            <li className="mt-auto pt-4 border-t border-white/20">
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center text-white p-2 rounded-lg hover:bg-opacity-25 hover:bg-white"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {darkMode ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  )}
                </svg>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </li>
            
            {/* Sign Out Button */}
            <li>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center text-white p-2 rounded-lg hover:bg-opacity-25 hover:bg-white"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 md:mt-0">
        <DashboardLayout>
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-lg shadow-lg p-4 md:p-6 border`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Getting Started
            </h2>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Welcome to your dashboard! You've successfully logged in to your account.
            </p>
          </div>
        </DashboardLayout>
      </div>
    </div>
  );
}

export default Dashboard;