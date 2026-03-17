# API Services Documentation

## 🗂️ Structure Overview

```
api/
├── index.js                    # Main export file (centralized imports)
├── axiosConfig.js             # Axios configuration & interceptors
├── auth/
│   └── authService.js         # Authentication endpoints
├── admin/
│   ├── studentService.js      # Student management
│   ├── teacherService.js      # Teacher management
│   ├── subjectService.js      # Subject management
│   ├── classSubjectService.js # Class-Subject assignments
│   ├── logService.js          # System logs
│   └── unrecognizedService.js # Unrecognized faces
├── teacher/
│   ├── attendanceService.js   # Attendance operations
│   ├── classService.js        # Class/Subject retrieval
│   └── reportService.js       # Reports & analytics
└── shared/
    └── dropdownService.js     # Shared dropdown data
```

---

## 📡 Services Guide

### Authentication Service (`auth/authService.js`)

**Methods:**
- `adminLogin(username, password)` - Admin login
- `teacherLogin(username, password)` - Teacher login
- `logout()` - Logout user
- `verifySession()` - Check if user is authenticated

**Usage:**
```jsx
import { authService } from '@/api';

const handleLogin = async () => {
  const result = await authService.adminLogin(username, password);
  if (result.success) {
    // Store user info
  }
};
```

---

### Admin Services

#### Student Service (`admin/studentService.js`)
**Methods:**
- `getStudents(filters)` - Get all students
- `addStudent(formData)` - Add new student with photo
- `updateStudent(studentId, data)` - Update student
- `deleteStudent(studentId)` - Delete student
- `searchStudents(query)` - Search students

**Usage:**
```jsx
import { studentService } from '@/api';

// Get students with filters
const students = await studentService.getStudents({ branch_id: 18, year: 3 });

// Add student with photo
const formData = new FormData();
formData.append('file', photoFile);
formData.append('roll_number', 'CSE001');
formData.append('name', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('branch_id', 18);
formData.append('year', 3);
formData.append('section', 'A');

await studentService.addStudent(formData);
```

---

#### Teacher Service (`admin/teacherService.js`)
**Methods:**
- `getTeachers()` - Get all teachers
- `addTeacher(username, password)` - Create new teacher
- `updateTeacher(teacherId, data)` - Update teacher
- `deleteTeacher(teacherId)` - Delete teacher (optional)

**Usage:**
```jsx
import { teacherService } from '@/api';

const teachers = await teacherService.getTeachers();
await teacherService.addTeacher('teacher_username', 'password');
```

---

#### Subject Service (`admin/subjectService.js`)
**Methods:**
- `getSubjects()` - Get all subjects
- `addSubject(subjectCode, subjectName)` - Create subject
- `deleteSubject(subjectId)` - Delete subject
- `searchSubjects(query)` - Search subjects

**Usage:**
```jsx
import { subjectService } from '@/api';

const subjects = await subjectService.getSubjects();
await subjectService.addSubject('CS101', 'Data Structures');
```

---

#### Class-Subject Service (`admin/classSubjectService.js`)
**Methods:**
- `getMappings(filters)` - Get class-subject mappings
- `assignSubject(assignment)` - Assign subject to class
- `updateMapping(mappingId, data)` - Update mapping
- `deleteMapping(mappingId)` - Delete mapping

**Usage:**
```jsx
import { classSubjectService } from '@/api';

const mappings = await classSubjectService.getMappings({ 
  academic_year: '2024-25',
  branch_id: 18 
});

await classSubjectService.assignSubject({
  subject_id: 1,
  branch_id: 18,
  year: 3,
  section: 'A',
  semester: 1,
  academic_year: '2024-25'
});
```

---

#### Log Service (`admin/logService.js`)
**Methods:**
- `getLogs(filters)` - Get logs with optional filters
- `getRecentLogs(limit)` - Get recent logs
- `getErrorLogs(hours, limit)` - Get error logs
- `getAttendanceLogs(date, limit)` - Get attendance logs
- `getAdminLogs(limit)` - Get admin action logs
- `cleanup(days)` - Cleanup old logs

**Usage:**
```jsx
import { logService } from '@/api';

const logs = await logService.getLogs({ 
  log_type: 'attendance',
  start_date: '2024-01-01',
  end_date: '2024-01-31',
  limit: 50
});

const recentLogs = await logService.getRecentLogs(20);
```

---

#### Unrecognized Service (`admin/unrecognizedService.js`)
**Methods:**
- `getUnrecognized(filters)` - Get unrecognized faces
- `getUnresolvedCount(classSubjectId)` - Count unresolved faces
- `getRecentUnresolved(days, limit)` - Get recent unresolved
- `resolveFace(faceId, studentId)` - Resolve single face
- `bulkResolve(faceIds, studentId)` - Resolve multiple faces
- `deleteFace(faceId)` - Delete face record
- `cleanup(days)` - Cleanup old resolved faces

**Usage:**
```jsx
import { unrecognizedService } from '@/api';

const unresolved = await unrecognizedService.getUnrecognized({
  class_subject_id: 1,
  resolved: false,
  limit: 50
});

await unrecognizedService.resolveFace(faceId, studentId);
```

---

### Teacher Services

#### Attendance Service (`teacher/attendanceService.js`)
**Methods:**
- `markAttendance(formData)` - Mark attendance (single image)
- `checkImageQuality(formData)` - Check image quality
- `markBatch(formData)` - Mark attendance (batch images)
- `getReport(classSubjectId, startDate, endDate)` - Get report
- `getByDate(classSubjectId, date)` - Get by specific date
- `export(classSubjectId, params)` - Export to Excel

**Usage:**
```jsx
import { attendanceService } from '@/api';

// Mark attendance with single image
const formData = new FormData();
formData.append('file', imageFile);
formData.append('class_subject_id', 1);
formData.append('attendance_date', '2024-01-15');

await attendanceService.markAttendance(formData);

// Get attendance report
const report = await attendanceService.getReport(1, '2024-01-01', '2024-01-31');
```

---

#### Class Service (`teacher/classService.js`)
**Methods:**
- `getClassSubjects(filters)` - Get teacher's classes/subjects

**Usage:**
```jsx
import { classService } from '@/api';

const subjects = await classService.getClassSubjects({
  branch_id: 18,
  year: 3,
  section: 'A',
  academic_year: '2024-25'
});
```

---

#### Report Service (`teacher/reportService.js`)
**Methods:**
- `getAttendanceStats(classSubjectId, period)` - Get stats
- `getStudentAttendance(classSubjectId, studentId)` - Get student attendance
- `getClassReport(classSubjectId, period)` - Get class report

**Usage:**
```jsx
import { reportService } from '@/api';

const stats = await reportService.getAttendanceStats(1, { days: 30 });
const classReport = await reportService.getClassReport(1, { month: 'January' });
```

---

### Shared Services

#### Dropdown Service (`shared/dropdownService.js`)
**Methods:**
- `getBranches()` - Get all branches
- `getYears()` - Get available years
- `getSections()` - Get available sections
- `getSemesters()` - Get available semesters

**Usage:**
```jsx
import { dropdownService } from '@/api';

const branches = await dropdownService.getBranches();
const years = await dropdownService.getYears();
const sections = await dropdownService.getSections();
```

---

## 🔌 Base Configuration

**Base URL:** `http://localhost:5000/api`

**Axios Setup:** ([axiosConfig.js](./axiosConfig.js))
- Includes CORS credentials
- Error handling interceptors
- Timeout configuration
- Request/Response logging

---

## 📝 Common Usage Pattern

```jsx
import { 
  authService, 
  studentService, 
  attendanceService,
  dropdownService 
} from '@/api';

// In component
useEffect(async () => {
  try {
    // Get dropdowns
    const branches = await dropdownService.getBranches();
    
    // Get data
    const students = await studentService.getStudents({ branch_id: 1 });
    
    // Update state
    setData({ branches, students });
  } catch (error) {
    console.error('API Error:', error);
    setError(error.message);
  }
}, []);
```

---

## ❌ Error Handling

All services use promise-based error handling. Implement try-catch:

```jsx
try {
  const result = await authService.adminLogin(username, password);
} catch (error) {
  console.error('Login failed:', error.response?.data?.message || error.message);
}
```

---

## 🔄 Response Format

Most endpoints return standardized format:

```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

On error:

```javascript
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

---

## 📋 Next Steps

1. **Import services** where needed using centralized exports
2. **Handle errors** with try-catch blocks
3. **Use TypeScript** for better type safety (optional upgrade)
4. **Add loading states** while API calls are in progress
5. **Implement caching** for frequently accessed data (optional)
