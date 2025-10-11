import axios from '../axiosConfig';

export const reportService = {
  // Get attendance report
  getReport: async (classSubjectId, startDate, endDate) => {
    const params = new URLSearchParams({ class_subject_id: classSubjectId });
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await axios.get(`/teacher/attendance/report?${params}`);
    return response.data;
  },

  // Get attendance by date
  getByDate: async (classSubjectId, date) => {
    const params = new URLSearchParams({ class_subject_id: classSubjectId });
    if (date) params.append('date', date);
    
    const response = await axios.get(`/teacher/attendance/by-date?${params}`);
    return response.data;
  },
};

