import axios from '../axiosConfig';

export const dropdownService = {
  // Get branches
  getBranches: async () => {
    const response = await axios.get('/branches');
    return response.data;
  },

  // Get years
  getYears: async () => {
    const response = await axios.get('/dropdowns/years');
    return response.data;
  },

  // Get sections
  getSections: async () => {
    const response = await axios.get('/dropdowns/sections');
    return response.data;
  },

  // Get semesters
  getSemesters: async () => {
    const response = await axios.get('/dropdowns/semesters');
    return response.data;
  },
};
    