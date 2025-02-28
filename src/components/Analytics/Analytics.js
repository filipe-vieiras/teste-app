import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

function Analytics({ darkMode }) {
  const [analyticsData, setAnalyticsData] = useState({
    totalCanvases: 0,
    totalUsers: 0,
    activeUsers: 0,
    lastUpdated: null
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Get total number of business canvases
      const { data: canvasData, error: canvasError } = await supabase
        .from('business_canvas')
        .select('id', { count: 'exact' });

      // Get total number of users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id', { count: 'exact' });

      // Get active users (users who updated their canvas in the last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: activeUserData, error: activeUserError } = await supabase
        .from('business_canvas')
        .select('user_id')
        .gt('updated_at', sevenDaysAgo.toISOString())
        .distinct();

      if (canvasError || userError || activeUserError) {
        console.error('Error fetching analytics:', { canvasError, userError, activeUserError });
        return;
      }

      setAnalyticsData({
        totalCanvases: canvasData.length || 0,
        totalUsers: userData.length || 0,
        activeUsers: activeUserData?.length || 0,
        lastUpdated: new Date().toLocaleString()
      });
    } catch (error) {
      console.error('Error in fetchAnalytics:', error);
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg`}>
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Canvases Card */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className="text-lg font-semibold mb-2">Total Business Canvases</h3>
          <p className="text-3xl font-bold">{analyticsData.totalCanvases}</p>
        </div>

        {/* Total Users Card */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{analyticsData.totalUsers}</p>
        </div>

        {/* Active Users Card */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className="text-lg font-semibold mb-2">Active Users (7 days)</h3>
          <p className="text-3xl font-bold">{analyticsData.activeUsers}</p>
        </div>
      </div>

      <div className="mt-6 text-sm text-right">
        Last updated: {analyticsData.lastUpdated}
      </div>

      <button
        onClick={fetchAnalytics}
        className={`mt-4 px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
      >
        Refresh Data
      </button>
    </div>
  );
}

export default Analytics;