
// ============================================================================
// src/api/admin/unrecognizedService.js
// ============================================================================
import axios from '../axiosConfig';

export const unrecognizedService = {
  // Get unrecognized faces
  getUnrecognizedFaces: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.class_subject_id) params.append('class_subject_id', filters.class_subject_id);
    if (filters.resolved !== undefined) params.append('resolved', filters.resolved);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await axios.get(`/unrecognized-faces?${params}`);
    return response.data;
  },

  // Get unresolved count
  getUnresolvedCount: async (classSubjectId) => {
    const params = classSubjectId ? `?class_subject_id=${classSubjectId}` : '';
    const response = await axios.get(`/unrecognized-faces/count${params}`);
    return response.data;
  },

  // Get recent unresolved
  getRecentUnresolved: async (days = 7, limit = 50) => {
    const response = await axios.get(`/unrecognized-faces/recent?days=${days}&limit=${limit}`);
    return response.data;
  },

  // Get by date
  getByDate: async (date, classSubjectId) => {
    const params = new URLSearchParams({ date });
    if (classSubjectId) params.append('class_subject_id', classSubjectId);
    const response = await axios.get(`/unrecognized-faces/by-date?${params}`);
    return response.data;
  },

  // Resolve face
  resolveFace: async (faceId, studentId) => {
    const response = await axios.post(`/unrecognized-faces/${faceId}/resolve`, { student_id: studentId });
    return response.data;
  },

  // Bulk resolve
  bulkResolve: async (faceIds, studentId) => {
    const response = await axios.post('/unrecognized-faces/bulk-resolve', {
      face_ids: faceIds,
      student_id: studentId,
    });
    return response.data;
  },

  // Delete face
  deleteFace: async (faceId) => {
    const response = await axios.delete(`/unrecognized-faces/${faceId}`);
    return response.data;
  },

  // Cleanup old resolved
  cleanupOldResolved: async (days = 90) => {
    const response = await axios.post(`/unrecognized-faces/cleanup?days=${days}`);
    return response.data;
  },
};

