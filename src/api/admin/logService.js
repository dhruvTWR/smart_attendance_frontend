
// ============================================================================
// src/api/admin/logService.js
// ============================================================================
import axios from '../axiosConfig';

export const logService = {
  // Get logs with filters
  getLogs: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.log_type) params.append('log_type', filters.log_type);
    if (filters.user_type) params.append('user_type', filters.user_type);
    if (filters.user_id) params.append('user_id', filters.user_id);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await axios.get(`/logs?${params}`);
    return response.data;
  },

  // Get recent logs
  getRecentLogs: async (limit = 100) => {
    const response = await axios.get(`/logs/recent?limit=${limit}`);
    return response.data;
  },

  // Get error logs
  getErrorLogs: async (hours = 24, limit = 100) => {
    const response = await axios.get(`/logs/errors?hours=${hours}&limit=${limit}`);
    return response.data;
  },

  // Get attendance logs
  getAttendanceLogs: async (date, limit = 100) => {
    const params = new URLSearchParams({ limit });
    if (date) params.append('date', date);
    const response = await axios.get(`/logs/attendance?${params}`);
    return response.data;
  },

  // Get admin actions
  getAdminActions: async (limit = 50) => {
    const response = await axios.get(`/logs/admin-actions?limit=${limit}`);
    return response.data;
  },

  // Get logs by action
  getLogsByAction: async (action, limit = 50) => {
    const response = await axios.get(`/logs/by-action?action=${action}&limit=${limit}`);
    return response.data;
  },

  // Cleanup old logs
  cleanupOldLogs: async (days = 90) => {
    const response = await axios.post(`/logs/cleanup?days=${days}`);
    return response.data;
  },
};

