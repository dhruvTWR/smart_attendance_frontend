
// ============================================================================
// src/api/admin/subjectService.js
// ============================================================================
import axios from '../axiosConfig';

export const subjectService = {
  // Get all subjects
  getSubjects: async () => {
    const response = await axios.get('/admin/subjects');
    return response.data;
  },

  // Add subject
  addSubject: async (subjectCode, subjectName) => {
    const response = await axios.post('/admin/subjects', {
      subject_code: subjectCode,
      subject_name: subjectName,
    });
    return response.data;
  },

  // Delete subject
  deleteSubject: async (subjectId) => {
    const response = await axios.delete(`/admin/subjects/${subjectId}`);
    return response.data;
  },

  // Search subjects
  searchSubjects: async (query) => {
    const response = await axios.get(`/admin/subjects/search?q=${query}`);
    return response.data;
  },
};

