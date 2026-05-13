import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import StudentDashboard from '../components/StudentDashboard';
import AdminDashboard from '../pages/AdminDashboard';

import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const dashboardResponse = await axios.get(`${config.API_BASE_URL}/dashboard`, {
        withCredentials: true
      });
      if (dashboardResponse.data?.success) {
        setDashboardData(dashboardResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A2540]"></div>
      </div>
    );
  }

  if (user.role === 'admin') {
    return <AdminDashboard data={dashboardData} user={user} />;
  }

  return <StudentDashboard user={user} dashboardData={dashboardData || {}} />;
};

export default Dashboard;
