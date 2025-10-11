
// ============================================================================
// src/api/admin/classSubjectService.js
// ============================================================================
import axios from '../axiosConfig';

export const classSubjectService = {
  // Get all class-subject mappings
  getMappings: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.academic_year) params.append('academic_year', filters.academic_year);
    if (filters.branch_id) params.append('branch_id', filters.branch_id);
    
    const response = await axios.get(`/admin/class-subjects?${params}`);
    return response.data;
  },

  // Assign subject to class
  assignSubject: async (data) => {
    const response = await axios.post('/admin/class-subjects', data);
    return response.data;
  },

  // Update mapping
  updateMapping: async (classSubjectId, data) => {
    const response = await axios.put(`/admin/class-subjects/${classSubjectId}`, data);
    return response.data;
  },

  // Delete mapping
  deleteMapping: async (classSubjectId) => {
    const response = await axios.delete(`/admin/class-subjects/${classSubjectId}`);
    return response.data;
  },
};
