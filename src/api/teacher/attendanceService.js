// ============================================================================
// src/api/teacher/attendanceService.js
// ============================================================================
import axios from '../axiosConfig';

export const attendanceService = {
  // Mark attendance via photo upload (single image)
  markAttendance: async (formData) => {
    const response = await axios.post('/teacher/attendance/mark', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Check image quality before upload
  checkImageQuality: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post('/teacher/attendance/check-quality', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Mark attendance with multiple images (batch)
  markAttendanceBatch: async (formData) => {
    const response = await axios.post('/teacher/attendance/mark-batch', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Enhanced single image upload with quality check
  markAttendanceV2: async (formData) => {
    const response = await axios.post('/teacher/attendance/mark-v2', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Manual attendance marking
  markManual: async (data) => {
    const response = await axios.post('/teacher/attendance/manual', data);
    return response.data;
  },
};