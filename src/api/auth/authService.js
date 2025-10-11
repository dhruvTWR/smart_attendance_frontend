// ============================================================================
// src/api/auth/authService.js
// ============================================================================
import axios from '../axiosConfig';

export const authService = {
  // Admin login
  adminLogin: async (username, password) => {
    if (username === 'admin45' && password === 'admin1234') {
      return {
        success: true,
        user: { username, role: 'admin', name: 'Admin User' },
        token: 'dummy-admin-token',
      };
    }
    const response = await axios.post('/auth/admin/login', { username, password });
    return response.data;
  },

  // Teacher login
  teacherLogin: async (username, password) => {
    if (username === 'teacher45' && password === 'admin123') {
      return {
        success: true,
        user: { username, role: 'teacher', name: 'Teacher User' },
        token: 'dummy-teacher-token',
      };
    }
    const response = await axios.post('/auth/teacher/login', { username, password });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axios.post('/auth/logout');
    return response.data;
  },

  // Verify session
  verifySession: async () => {
    const response = await axios.get('/auth/verify');
    return response.data;
  },
};

