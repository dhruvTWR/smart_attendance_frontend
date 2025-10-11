
// ============================================================================
// src/api/teacher/classService.js
// ============================================================================
import axios from '../axiosConfig';

export const classService = {
  // Get subjects for selected class
  getSubjectsForClass: async (branchId, year, section, academicYear) => {
    const params = new URLSearchParams({
      branch_id: branchId,
      year,
      section,
    });
    if (academicYear) params.append('academic_year', academicYear);
    
    const response = await axios.get(`/teacher/class-subjects?${params}`);
    return response.data;
  },
};