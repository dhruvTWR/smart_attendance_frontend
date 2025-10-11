import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  LogOut,
  UserCheck,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ClassSubjectAssignment } from './ClassSubjectAssignment.jsx';
import StudentManagement from './StudentManagement.jsx';
import { SubjectManagement } from './SubjectManagement.jsx';
import { TeacherManagement } from './TeacherManagement.jsx';

export function AdminDashboard({ user, onLogout }) {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      id: 'students',
      title: 'Student Management',
      description: 'Add, edit, delete and manage student records',
      icon: Users,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'teachers',
      title: 'Teacher Management',
      description: 'Manage teacher accounts and permissions',
      icon: UserCheck,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: 'subjects',
      title: 'Subject Management',
      description: 'Add and manage subjects in the system',
      icon: BookOpen,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'class-subjects',
      title: 'Class Subject Assignment',
      description: 'Assign subjects to classes and sections',
      icon: GraduationCap,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600'
    }
  ];

  const handleFeatureClick = (featureId) => {
    setActiveFeature(featureId);
  };

  const handleBack = () => {
    setActiveFeature(null);
  };

  // Render specific feature component
  if (activeFeature === 'students') {
    return <StudentManagement onBack={handleBack} />;
  }
  if (activeFeature === 'teachers') {
    return <TeacherManagement onBack={handleBack} />;
  }
  if (activeFeature === 'subjects') {
    return <SubjectManagement onBack={handleBack} />;
  }
  if (activeFeature === 'class-subjects') {
    return <ClassSubjectAssignment onBack={handleBack} />;
  }

  // Default dashboard view
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-green-600">AttendEase</h1>
              <p className="text-muted-foreground mt-1">Admin Dashboard</p>
            </div>
            <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-green-700 mb-2">
              Welcome, Admin User
            </h2>
            <p className="text-green-600 text-lg">
              Manage your attendance system with ease and efficiency
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Administrative Features
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access all administrative functions through these feature modules. 
              Each module provides comprehensive management capabilities.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={feature.id}
                  className={`${feature.color} transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:-translate-y-1`}
                  onClick={() => handleFeatureClick(feature.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full bg-white ${feature.iconColor}`}>
                          <IconComponent className="w-8 h-8" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-semibold text-foreground">
                            {feature.title}
                          </CardTitle>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Stats Section */}
          <div className="mt-16 bg-white rounded-lg border p-8">
            <h4 className="text-xl font-semibold text-foreground mb-6 text-center">
              System Overview
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                <div className="text-sm text-muted-foreground">Active Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                <div className="text-sm text-muted-foreground">Total Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
                <div className="text-sm text-muted-foreground">Class Assignments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}