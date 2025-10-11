import { useState } from 'react';
import { AdminDashboard } from './components/admin_controller/AdminDashboard.jsx';
import { LoginForm } from './components/LoginForm.jsx';
import { TeacherDashboard } from './components/TeacherDashboard.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {currentUser.role === 'teacher' ? (
        <TeacherDashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
} 

