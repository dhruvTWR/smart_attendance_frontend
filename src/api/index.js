
export { authService } from './auth/authService';

// Admin services
export { classSubjectService } from './admin/classSubjectService';
export { logService } from './admin/logService';
export { studentService } from './admin/studentService';
export { subjectService } from './admin/subjectService';
export { teacherService } from './admin/teacherService';
export { unrecognizedService } from './admin/unrecognizedService';

// Teacher services
export { attendanceService } from './teacher/attendanceService';
export { classService } from './teacher/classService';
export { reportService } from './teacher/reportService';

// Shared services
export { dropdownService } from './shared/dropdownService';


// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// In your React components:

// 1. Login
import { authService } from '@/api';

const handleLogin = async () => {
  try {
    const result = await authService.adminLogin(username, password);
    if (result.success) {
      // Handle success
    }
  } catch (error) {
    console.error(error);
  }
};


// 2. Admin - Add Student
import { studentService } from '@/api';

const handleAddStudent = async () => {
  const formData = new FormData();
  formData.append('file', photoFile);
  formData.append('roll_number', rollNumber);
  formData.append('name', name);
  formData.append('email', email);
  formData.append('branch_id', branchId);
  formData.append('year', year);
  formData.append('section', section);
  
  const result = await studentService.addStudent(formData);
};


// 3. Teacher - Mark Attendance
import { attendanceService } from '@/api';

const handleMarkAttendance = async () => {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('class_subject_id', classSubjectId);
  formData.append('attendance_date', date);
  
  const result = await attendanceService.markAttendance(formData);
};


// 4. Get Dropdowns
import { dropdownService } from '@/api';

useEffect(() => {
  const loadDropdowns = async () => {
    const branches = await dropdownService.getBranches();
    const years = await dropdownService.getYears();
    const sections = await dropdownService.getSections();
  };
  loadDropdowns();
}, []);
*/