
// ============================================================================
// src/api/admin/teacherService.js
// ============================================================================
import axios from '../axiosConfig';

export const teacherService = {
  // Get all teachers
  getTeachers: async () => {
    const response = await axios.get('/admin/teachers');
    return response.data;
  },

  // Add teacher
  addTeacher: async ({username, password}) => {
    const response = await axios.post('/admin/teachers', { username, password });
    return response.data;
  },

  // Update teacher
   // Update teacher
  updateTeacher: async (teacherId, { username, password }) => {
    const payload = { username };
    if (password) payload.password = password; // Only send password if provided

    const response = await axios.put(`/admin/teachers/${teacherId}`, payload);
    return response.data;
  }};

