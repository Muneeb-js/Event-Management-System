import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1'; // Standard port for the server

const test = async () => {
  try {
    console.log('Testing Login...');
    const loginRes = await axios.post(`${API_BASE_URL}/users/login`, {
      username: 'dr_sarah',
      password: 'password123'
    });
    const cookies = loginRes.headers['set-cookie'];
    console.log('Login Successful');

    console.log('Fetching Dashboard...');
    const dashboardRes = await axios.get(`${API_BASE_URL}/dashboard`, {
      headers: { Cookie: cookies.join('; ') }
    });
    
    console.log('Dashboard Data:', JSON.stringify(dashboardRes.data.data, null, 2));
    
    if (dashboardRes.data.data.role === 'teacher' && dashboardRes.data.data.organizedEventsCount !== undefined) {
      console.log('✅ Teacher dashboard data verification passed!');
    } else {
      console.log('❌ Teacher dashboard data verification failed!');
    }

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
};

test();
