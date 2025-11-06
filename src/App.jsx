import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm.jsx';
import Header from './components/Header.jsx';
import { TeacherDashboard } from './components/TeacherDashboard.jsx';
import { AdminDashboard } from './components/admin_controller/AdminDashboard.jsx';
import AdminStudentManagement from './components/admin_controller/StudentManagement.jsx';
import { ClassSubjectAssignment } from './components/admin_controller/ClassSubjectAssignment.jsx';
import { SubjectManagement } from './components/admin_controller/SubjectManagement.jsx';
import { TeacherManagement } from './components/admin_controller/TeacherManagement.jsx';
import { StudentManagement } from './components/StudentManagement.jsx';
import { AttendanceReport } from './components/AttendanceReport.jsx';
import { AttendanceResults } from './components/AttendanceResults.jsx';
import { SystemLogs } from './components/SystemLogs.jsx';

// Simple protected route wrapper
function Protected({ currentUser, allowedRoles, children }) {
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/" replace />;
  return children;
}

function AdminRoutes({ currentUser, onLogout }) {
  return (
    <>
      <Header user={currentUser} onLogout={onLogout} />
      <Routes>
        <Route path="dashboard" element={<AdminDashboard user={currentUser} onLogout={onLogout} />} />
        <Route path="students" element={<AdminStudentManagement />} />
        <Route path="teachers" element={<TeacherManagement />} />
        <Route path="subjects" element={<SubjectManagement />} />
        <Route path="class-subjects" element={<ClassSubjectAssignment />} />
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </>
  );
}

function TeacherRoutes({ currentUser, onLogout }) {
  return (
    <>
      <Header user={currentUser} onLogout={onLogout} />
      <Routes>
        <Route path="dashboard" element={<TeacherDashboard user={currentUser} onLogout={onLogout} />} />
        <Route path="attendance" element={<TeacherDashboard user={currentUser} onLogout={onLogout} />} />
        <Route path="report" element={<AttendanceReport />} />
        <Route path="results" element={<AttendanceResults />} />
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </>
  );
}

function Logout({ setCurrentUser }) {
  useEffect(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);
  return <Navigate to="/login" replace />;
}


export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    // Try to load user from localStorage
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Save user to localStorage on login/logout
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to={currentUser.role === 'teacher' ? '/teacher/dashboard' : '/admin/dashboard'} replace />
            ) : (
              <LoginForm onLogin={(user) => setCurrentUser(user)} />
            )
          }
        />
        <Route path="/logout" element={<Logout setCurrentUser={setCurrentUser} />} />

        {/* Admin area - protected */}
        <Route
          path="/admin/*"
          element={
            <Protected currentUser={currentUser} allowedRoles={[ 'admin' ]}>
              <AdminRoutes currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
            </Protected>
          }
        />

        {/* Teacher area - protected */}
        <Route
          path="/teacher/*"
          element={
            <Protected currentUser={currentUser} allowedRoles={[ 'teacher' ]}>
              <TeacherRoutes currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
            </Protected>
          }
        />

        {/* Shared pages */}
        <Route path="/reports" element={<Protected currentUser={currentUser} allowedRoles={[ 'admin', 'teacher' ]}><AttendanceReport /></Protected>} />
        <Route path="/students" element={<Protected currentUser={currentUser} allowedRoles={[ 'admin' ]}><StudentManagement /></Protected>} />
        <Route path="/logs" element={<Protected currentUser={currentUser} allowedRoles={[ 'admin' ]}><SystemLogs /></Protected>} />

        {/* Root route redirects depending on auth */}
        <Route
          path="/"
          element={
            currentUser ? (
              <Navigate to={currentUser.role === 'teacher' ? '/teacher/dashboard' : '/admin/dashboard'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

