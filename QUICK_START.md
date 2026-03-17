# 🎯 Smart Attendance Frontend - Complete Guide

## Quick Navigation

| Document | Purpose |
|----------|---------|
| **FRONTEND_STRUCTURE.md** | 📁 Full folder structure & organization |
| **COMPONENTS_GUIDE.md** | 🧩 Component documentation & inventory |
| **src/api/API_SERVICES_GUIDE.md** | 🔌 API integration guide |
| **src/components/ui/INDEX.md** | 🎨 UI components reference |
| **README.md** | 📖 Project overview |

---

## 🚀 Getting Started

### 1. Project Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 2. Access Application
- **Development:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

### 3. User Roles
- **Admin** - Manage students, teachers, subjects, classes
- **Teacher** - Mark attendance, view reports

---

## 📂 Project Structure Overview

```
src/
├── api/                          # API Services (Centralized)
│   ├── index.js                 # ✨ Import from here!
│   ├── axiosConfig.js
│   ├── API_SERVICES_GUIDE.md    # 📖 Full API docs
│   ├── auth/
│   ├── admin/
│   ├── teacher/
│   └── shared/
│
├── components/
│   ├── Header.jsx
│   ├── LoginForm.jsx
│   ├── TeacherDashboard.jsx
│   ├── admin_controller/        # Admin pages
│   ├── teacher_components/      # Teacher pages
│   ├── ui/                       # UI Library (Shadcn)
│   │   └── INDEX.md            # 📖 UI components docs
│   └── guidelines/
│
└── App.jsx                       # Main routing hub
```

---

## 🔌 How to Use API Services

### Step 1: Import Service
```jsx
import { authService, studentService } from '@/api';
```

### Step 2: Use in Component
```jsx
const [students, setStudents] = useState([]);

useEffect(() => {
  const load = async () => {
    try {
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (error) {
      console.error(error);
    }
  };
  load();
}, []);
```

### Available Services
```javascript
// Authentication
authService.adminLogin(username, password)
authService.teacherLogin(username, password)
authService.logout()

// Admin - Students
studentService.getStudents(filters)
studentService.addStudent(formData)
studentService.updateStudent(id, data)
studentService.deleteStudent(id)

// Admin - Teachers
teacherService.getTeachers()
teacherService.addTeacher(username, password)

// Admin - Subjects
subjectService.getSubjects()
subjectService.addSubject(code, name)
subjectService.deleteSubject(id)

// Admin - Class-Subject
classSubjectService.getMappings(filters)
classSubjectService.assignSubject(data)

// Admin - Logs
logService.getLogs(filters)
logService.getRecentLogs(limit)

// Admin - Unrecognized Faces
unrecognizedService.getUnrecognized(filters)
unrecognizedService.resolveFace(faceId, studentId)

// Teacher - Attendance
attendanceService.markAttendance(formData)
attendanceService.markBatch(formData)
attendanceService.getReport(classSubjectId, dates)

// Teacher - Class
classService.getClassSubjects(filters)

// Teacher - Reports
reportService.getAttendanceStats(classSubjectId, period)

// Shared - Dropdowns
dropdownService.getBranches()
dropdownService.getYears()
dropdownService.getSections()
dropdownService.getSemesters()
```

---

## 🎨 Using UI Components

### Step 1: Check available components
See [src/components/ui/INDEX.md](./src/components/ui/INDEX.md)

### Step 2: Import Component
```jsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
```

### Step 3: Use in JSX
```jsx
<Card>
  <CardHeader>
    <CardTitle>My Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Click Me</Button>
  </CardContent>
</Card>
```

### Available UI Components
**Active (Ready to use):**
- button, card, badge, table, alert, dialog, input, label, select, calendar, popover, progress

**Commented (For future use):**
- 23 other components (see INDEX.md)

---

## 🛣️ Routing Structure

### Admin Routes
```
/admin /
  ├── /admin/dashboard           - Main dashboard
  ├── /admin/students             - Student management
  ├── /admin/teachers             - Teacher management
  ├── /admin/subjects             - Subject management
  └── /admin/class-subjects       - Class-subject assignments
```

### Teacher Routes
```
/teacher/
  ├── /teacher/dashboard          - Main dashboard
  ├── /teacher/attendance         - Mark attendance
  ├── /teacher/report             - View reports
  └── /teacher/results            - Report results
```

### Public Routes
```
/login                            - Login page
/logout                           - Logout action
```

---

## 💾 State Management

Currently using React Hooks:**

```jsx
const [state, setState] = useState(initialValue);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  // Side effects here
}, [dependencies]);
```

**Session Storage:**
```javascript
// User session stored in localStorage
localStorage.getItem('currentUser')
localStorage.setItem('currentUser', JSON.stringify(user))
localStorage.removeItem('currentUser')
```

---

## 🔐 Protected Routes with Role-Based Access

```jsx
<Protected currentUser={currentUser} allowedRoles={['admin']}>
  <Component />
</Protected>
```

Automatically:
- Checks authentication
- Validates role
- Redirects unauthorized users

---

## 📝 Component Structure Template

```jsx
// src/components/MyComponent.jsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { someService } from '@/api';

/**
 * Component description
 * @param {object} props - Component props
 * @param {function} props.onClose - Callback on close
 */
export default function MyComponent({ onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await someService.getData();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Component</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <div>
            {/* Display data */}
          </div>
        )}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 🔄 Adding a New Feature

### 1. Backend First (if needed)
- Ensure API endpoint exists
- Test with Postman/Thunder Client

### 2. Create Component
```bash
# Create file matching feature
mkdir -p src/components/feature
touch src/components/feature/FeatureName.jsx
```

### 3. Import Services & Components
```jsx
import { featureService } from '@/api';
import { Button, Card, Table } from '@/components/ui/';
```

### 4. Implement Component
- State management
- API calls
- UI with components
- Error handling

### 5. Add Route (in App.jsx)
```jsx
<Route path="feature" element={<FeatureName />} />
```

### 6. Test
```bash
npm run dev
# Test in browser
```

---

## 🐛 Troubleshooting

### Backend Connection Issues
```javascript
// Check backend is running
fetch('http://localhost:5000/api/health')
```

### Components Not Rendering
1. Check route is defined in App.jsx
2. Check component path is correct
3. Verify import statements

### API Calls Failing
1. Check backend is running
2. Verify API endpoint path
3. Check browser DevTools Network tab
4. Review error in console

### UI Components Not Displaying
1. Check import from `@/components/ui/`
2. Check component is in active list (not commented)
3. Review Tailwind CSS setup

### State Not Persisting
1. Use localStorage for session data
2. Check browser Privacy/Cookie settings
3. Verify localStorage API access

---

## 📊 File Statistics

| Category | Count |
|----------|-------|
| Total Components | 13+ |
| API Services | 8 |
| UI Components (Active) | 12 |
| UI Components (Unused) | 24 |
| Routes | 10+ |

---

## 🚀 Performance Tips

1. **Lazy Load Components** (Future enhancement)
```jsx
const AdminDashboard = lazy(() => import('./AdminDashboard'));
```

2. **Memoize Components** (When needed)
```jsx
export default memo(MyComponent);
```

3. **Optimize Re-renders**
```jsx
useEffect(() => { ... }, [specificDependency]);
```

4. **Cache API Responses** (Future enhancement)
```jsx
const [cache, setCache] = useState({});
```

---

## 📦 Deployment

### Build Production
```bash
npm run build
```

### Output
- Production-ready files in `dist/`
- Ready to serve on web server

### Environment Variables
```javascript
// Update API base URL for production
// In src/api/axiosConfig.js
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## 📚 Additional Resources

### Documentation Files
- [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md) - Detailed structure
- [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md) - Component reference
- [src/api/API_SERVICES_GUIDE.md](./src/api/API_SERVICES_GUIDE.md) - API reference
- [src/components/ui/INDEX.md](./src/components/ui/INDEX.md) - UI components
- [src/components/guidelines/Guidelines.md](./src/components/guidelines/Guidelines.md) - Coding standards

### External References
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [React Router v6](https://reactrouter.com)

---

## 🤝 Code Style & Conventions

### Naming
- Components: `PascalCase` (e.g., `MyComponent`)
- Functions: `camelCase` (e.g., `handleClick`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_SIZE`)
- Files: `PascalCase.jsx` for components, `camelCase.js` for utilities

### Component Organization
1. Imports
2. Constants
3. Component function
4. Hooks (useState, useEffect)
5. Handlers/Methods
6. useEffect hooks
7. Return JSX

### Best Practices
1. Use destructuring for props
2. Keep components focused (single responsibility)
3. Extract reusable logic to custom hooks
4. Handle errors gracefully
5. Use meaningful variable names
6. Add comments for complex logic

---

## 📞 Quick Help

**Lost?** Start here:
1. Go to [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md)
2. Find your topic
3. Click link to detailed docs
4. Review code examples

**Can't find API method?**
1. Check [src/api/API_SERVICES_GUIDE.md](./src/api/API_SERVICES_GUIDE.md)
2. Search for service name
3. Review usage example

**UI Component not working?**
1. Check [src/components/ui/INDEX.md](./src/components/ui/INDEX.md)
2. Verify it's in "ACTIVE" section
3. Check import path

---

## ✅ Project Cleanup Summary

### What Was Done
✅ Identified 24 unused UI components  
✅ Commented out unused components with warnings  
✅ Created UI components INDEX  
✅ Organized API services documentation  
✅ Created comprehensive structure documentation  
✅ Created components guide with inventory  
✅ Created this master guide

### Active Components
✅ 12 UI components ready to use  
✅ 8 API services configured  
✅ 13+ React components functional  
✅ 10+ routes defined

### Cleanup Impact
📉 Reduced confusion with unused code  
📚 Clear documentation for all systems  
🎯 Easy reference for developers  
🔍 Simple troubleshooting process

---

## 🎓 Next Steps

### Immediate
1. Read [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md)
2. Review [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)
3. Check [src/api/API_SERVICES_GUIDE.md](./src/api/API_SERVICES_GUIDE.md)

### Short Term
- Add TypeScript types
- Implement error boundaries
- Add loading skeletons
- Improve responsive design

### Medium Term
- Add unit tests
- Implement global state management
- Add E2E tests
- Optimize performance

### Long Term
- Authentication token refresh
- Advanced caching
- Analytics integration
- Progressive Web App

---

**Happy Coding!** 🚀

For questions or clarifications, refer to the appropriate documentation file or check the code comments.
