// ============================================================================
// src/admin/studentService.js
// ============================================================================
import axios from '../axiosConfig';

export const studentService = {
  // Get all students (with optional filters)
  getStudents: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.branch_id) params.append('branch_id', filters.branch_id);
    if (filters.year) params.append('year', filters.year);
    if (filters.section) params.append('section', filters.section);
    
    const response = await axios.get(`/admin/students?${params}`);
    return response.data;
  },

  // Add student with photo
  addStudent: async (formData) => {
    const response = await axios.post('/admin/students', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update student
  updateStudent: async (studentId, formData) => {
    const response = await axios.put(`/admin/students/${studentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete student
  deleteStudent: async (studentId) => {
    const response = await axios.delete(`/admin/students/${studentId}`);
    return response.data;
  },

  // Search students
  searchStudents: async (query) => {
    const response = await axios.get(`/admin/students/search?q=${query}`);
    return response.data;
  },
};
