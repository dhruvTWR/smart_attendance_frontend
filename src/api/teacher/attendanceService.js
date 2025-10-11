
// ============================================================================
// src/api/teacher/attendanceService.js
// ============================================================================
import axios from '../axiosConfig';

export const attendanceService = {
  // Mark attendance via photo upload
  markAttendance: async (formData) => {
    const response = await axios.post('/teacher/attendance/mark', formData, {
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

