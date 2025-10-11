// ============================================================================
// Student Management Component
// Handles CRUD operations for student records with face recognition photos
// ============================================================================

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, ArrowLeft, Edit, Plus, Search, Trash2, Upload, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { studentService } from '../../api/admin/studentService';
import { dropdownService } from '../../api/shared/dropdownService';

export default function StudentManagement({ onBack }) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Student data state
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  
  // Dropdown options state
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [sections, setSections] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    branch_id: 'all',
    year: 'all',
    section: 'all'
  });
  
  // Form state
  const [formData, setFormData] = useState({
    roll_number: '',
    name: '',
    email: '',
    branch_id: '',
    year: '',
    section: '',
    photo: null
  });
  
  // Photo preview state
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // ============================================================================
  // LIFECYCLE HOOKS
  // ============================================================================
  
  // Fetch dropdown data on mount
  useEffect(() => {
    fetchDropdownData();
  }, []);
  
  // Fetch students when filters change
  useEffect(() => {
  
  }, []);

 
  
  // Debounced search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const timeoutId = setTimeout(() => {
        searchStudents(searchTerm);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, students]);

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================
  
  /**
   * Fetch branches, years, and sections from API
   */
  const fetchDropdownData = async () => {
    try {
      const [branchesData, yearsData, sectionsData] = await Promise.all([
        dropdownService.getBranches(),
        dropdownService.getYears(),
        dropdownService.getSections()
      ]);

      if (branchesData.success) setBranches(branchesData.branches || []);
      if (yearsData.success) setYears(yearsData.years || []);
      if (sectionsData.success) setSections(sectionsData.sections || []);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      // Fallback data
      setYears([1, 2, 3, 4]);
      setSections(['A', 'B', 'C']);
    }
  };

  /**
   * Fetch students with optional filters
   */
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryFilters = {
      branch_id: filters.branch_id !== "all" ? filters.branch_id : "",
      year: filters.year !== "all" ? filters.year : "",
      section: filters.section !== "all" ? filters.section : ""
    };
      const data = await studentService.getStudents(queryFilters);
      
      if (data.success) {
        setStudents(data.students || []);
        setFilteredStudents(data.students || []);
      } else {
        setError('Failed to fetch students');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

   <button onClick={fetchStudents}>Submit</button>

  /**
   * Search students by name or roll number
   */
  const searchStudents = async (query) => {
    if (!query.trim()) {
      setFilteredStudents(students);
      return;
    }

    try {
      const data = await studentService.searchStudents(query);
      
      if (data.success) {
        setFilteredStudents(data.students || []);
      }
    } catch (err) {
      console.error('Error searching students:', err);
      // Fallback to local search
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.roll_number.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  };

  /**
   * Add new student
   */
  const handleAddStudent = async () => {
    if (!formData.roll_number || !formData.name || !formData.photo || 
        !formData.branch_id || !formData.year || !formData.section) {
      setError('Please fill all required fields including photo');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.photo);
      formDataToSend.append('roll_number', formData.roll_number);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('branch_id', formData.branch_id);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('section', formData.section);

      const data = await studentService.addStudent(formDataToSend);

      if (data.success) {
        setSuccess('Student added successfully!');
        resetForm();
        fetchStudents();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error adding student';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update existing student
   */
  const handleUpdateStudent = async () => {
    if (!editingStudent) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      if (formData.name) formDataToSend.append('name', formData.name);
      if (formData.email) formDataToSend.append('email', formData.email);
      if (formData.photo) formDataToSend.append('file', formData.photo);
         if (formData.section) formDataToSend.append("section", formData.section);
      const data = await studentService.updateStudent(editingStudent.id, formDataToSend);

      if (data.success) {
        setSuccess('Student updated successfully!');
        resetForm();
        fetchStudents();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error updating student';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete student
   */
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await studentService.deleteStudent(studentId);
      
      if (data.success) {
        setSuccess('Student deleted successfully!');
        fetchStudents();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error deleting student';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  
  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      roll_number: '',
      name: '',
      email: '',
      branch_id: '',
      year: '',
      section: '',
      photo: null
    });
    setPhotoPreview(null);
    setShowAddForm(false);
    setEditingStudent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Set form for editing existing student
   */
  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      roll_number: student.roll_number,
      name: student.name,
      email: student.email || '',
      branch_id: student.branch_id || '',
      year: student.year || '',
      section: student.section || '',
      photo: null
    });
    setPhotoPreview(null);
    setShowAddForm(true);
    setError(null);
    setSuccess(null);
  };

  /**
   * Handle file selection and preview
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      
      setFormData({ ...formData, photo: file });
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Remove selected photo
   */
  const handleRemovePhoto = () => {
    setFormData({ ...formData, photo: null });
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Form submitted', editingStudent, formData);
    if (editingStudent) {
     await handleUpdateStudent();
    } else {
     await handleAddStudent();
    }
  };

  /**
   * Get branch name by ID
   */
  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === parseInt(branchId));
    return branch ? branch.name || branch.branch_code : 'N/A';
  };

  // Check if form is complete
  const isFormComplete = formData.roll_number && formData.name && 
                       (editingStudent || (formData.branch_id && formData.year && formData.section)) &&
                       (formData.photo || editingStudent);


  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          {onBack && (
            <Button variant="outline" onClick={onBack} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-green-600">Student Management</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage student records with face recognition
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              <X className="w-4 h-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 mb-4">
          <AlertDescription className="text-green-800 flex items-center justify-between">
            <span>{success}</span>
            <Button variant="ghost" size="sm" onClick={() => setSuccess(null)}>
              <X className="w-4 h-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Filters + Student List (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters and Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search and Filter Students
                </span>
                <Button onClick={() => { resetForm(); setShowAddForm(!showAddForm); }}>
                  {showAddForm ? (
                    <><X className="w-4 h-4 mr-2" /> Cancel</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" /> Add Student</>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="lg:col-span-4">
                  <input
                    type="text"
                    placeholder="Search by name or roll number..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Branch Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Branch</label>
                  <Select value={filters.branch_id} onValueChange={(value) => setFilters({ ...filters, branch_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.name || branch.branch_code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Select value={filters.year} onValueChange={(value) => setFilters({ ...filters, year: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          Year {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Section Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Section</label>
                  <Select value={filters.section} onValueChange={(value) => setFilters({ ...filters, section: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {sections.map((section) => (
                        <SelectItem key={section} value={section}>
                          Section {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

          

                <div className="space-y-2">
                  {/* <label className="text-sm font-medium text-transparent">Action</label> */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={fetchStudents}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Submit
                  </Button>

                </div>
              </div>
            </CardContent>
          </Card>

          

          {/* Student List Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Student List
              </CardTitle>
              <CardDescription>
                Showing {filteredStudents.length} of {students.length} students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Roll No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Year</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Section</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Branch</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <span>Loading students...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <Search className="w-12 h-12 text-gray-300" />
                            <span>No students found</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.roll_number}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{student.email || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{student.year}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{student.section}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{getBranchName(student.branch_id)}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(student)}
                                disabled={loading}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteStudent(student.id)}
                                disabled={loading}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Add/Edit Form (1/3 width) */}
        <div>
          {showAddForm ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {editingStudent ? (
                    <><Edit className="w-5 h-5" /> Edit Student</>
                  ) : (
                    <><Plus className="w-5 h-5" /> Add New Student</>
                  )}
                </CardTitle>
                <CardDescription>
                  {editingStudent ? 'Update student information' : 'Add a new student with face photo'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Roll Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Roll Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter roll number"
                      value={formData.roll_number}
                      onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      disabled={editingStudent}
                    />
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter student name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Branch */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <Select 
                      value={formData.branch_id} 
                      onValueChange={(value) => setFormData({ ...formData, branch_id: value })}
                      disabled={editingStudent}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name || branch.branch_code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <Select 
                      value={formData.year} 
                      onValueChange={(value) => setFormData({ ...formData, year: value })}
                      disabled={editingStudent}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            Year {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Section */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Section <span className="text-red-500">*</span>
                    </label>
                    <Select 
                      value={formData.section} 
                      onValueChange={(value) => setFormData({ ...formData, section: value })}
                      disabled={editingStudent}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section} value={section}>
                            Section {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Student Photo {!editingStudent && <span className="text-red-500">*</span>}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="student-photo"
                        required={!editingStudent}
                      />
                      
                      {photoPreview ? (
                        <div className="space-y-2">
                          <div className="relative inline-block">
                            <img 
                              src={photoPreview} 
                              alt="Preview" 
                              className="max-h-40 rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          {formData.photo && (
                            <p className="text-xs text-gray-600">{formData.photo.name}</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Face should be clearly visible</p>
                          <Button type="button" variant="outline" size="sm" asChild>
                            <label htmlFor="student-photo" className="cursor-pointer">
                              Choose Photo
                            </label>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1" disabled={loading || !isFormComplete}>
                      {loading ? 'Processing...' : editingStudent ? 'Update Student' : 'Add Student'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-500">
                  <Plus className="w-5 h-5" />
                  Add Student
                </CardTitle>
                <CardDescription>
                  Click the "Add Student" button above to add a new student
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No form active</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Alert */}
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Ensure the student's face is clearly visible in the photo for accurate face recognition.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import { 
//   ArrowLeft, 
//   Plus, 
//   Search, 
//   Edit, 
//   Trash2, 
//   Upload,
//   Users,
//   Filter,
//   Download,
//   UserPlus,
//   GraduationCap,
//   Mail,
//   Hash,
//   Calendar,
//   Building,
//   AlertCircle,
//   CheckCircle,
//   X
// } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import { Label } from '../ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { Alert, AlertDescription } from '../ui/alert';
// import { Badge } from '../ui/badge';

// const StudentManagement = ({ onBack }) => {
//   // ============================================================================
//   // STATE VARIABLES
//   // ============================================================================

//   // All student data fetched from the backend
//   const [students, setStudents] = useState([]);

//   // Filtered students list (based on search & filters)
//   const [filteredStudents, setFilteredStudents] = useState([]);

//   // Branch list (not used dynamically yet but placeholder for future API)
//   const [branches, setBranches] = useState([]);

//   // Loading and error handling states
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // Search input
//   const [searchTerm, setSearchTerm] = useState('');

//   // Control visibility of Add/Edit form
//   const [showAddForm, setShowAddForm] = useState(false);

//   // Holds the student being edited (null when adding a new student)
//   const [editingStudent, setEditingStudent] = useState(null);

//   // Filters for branch, year, section
//   const [filters, setFilters] = useState({
//     branch_id: '',
//     year: '',
//     section: ''
//   });

//   // Form data for adding/updating students
//   const [formData, setFormData] = useState({
//     roll_number: '',
//     name: '',
//     email: '',
//     branch_id: '',
//     year: '',
//     section: '',
//     photo: null
//   });

//   // ============================================================================
//   // LIFECYCLE EFFECTS
//   // ============================================================================

//   // Initialize with mock data
//   useEffect(() => {
//     // Simulate API call with mock data
//     const mockStudents = [
//       {
//         id: 1,
//         roll_number: 'CSE001',
//         name: 'John Doe',
//         email: 'john.doe@example.com',
//         branch_id: '1',
//         branch_name: 'CSE',
//         branch_code: 'CSE',
//         year: '3',
//         section: 'A'
//       },
//       {
//         id: 2,
//         roll_number: 'IT002',
//         name: 'Jane Smith',
//         email: 'jane.smith@example.com',
//         branch_id: '2',
//         branch_name: 'IT',
//         branch_code: 'IT',
//         year: '2',
//         section: 'B'
//       },
//       {
//         id: 3,
//         roll_number: 'ECE003',
//         name: 'Alice Johnson',
//         email: 'alice.johnson@example.com',
//         branch_id: '3',
//         branch_name: 'ECE',
//         branch_code: 'ECE',
//         year: '4',
//         section: 'A'
//       }
//     ];
//     setStudents(mockStudents);
//     setFilteredStudents(mockStudents);
//   }, []);

//   // Apply filters whenever filters change
//   useEffect(() => {
//     let filtered = students;

//     if (filters.branch_id) {
//       filtered = filtered.filter(student => student.branch_id === filters.branch_id);
//     }
//     if (filters.year) {
//       filtered = filtered.filter(student => student.year === filters.year);
//     }
//     if (filters.section) {
//       filtered = filtered.filter(student => 
//         student.section.toLowerCase().includes(filters.section.toLowerCase())
//       );
//     }

//     setFilteredStudents(filtered);
//   }, [filters, students]);

//   // Debounced search effect
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredStudents(students);
//     } else {
//       const timeoutId = setTimeout(() => {
//         searchStudents(searchTerm);
//       }, 500);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [searchTerm, students]);

//   // Auto-clear messages
//   useEffect(() => {
//     if (success) {
//       const timer = setTimeout(() => setSuccess(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [success]);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => setError(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   // ============================================================================
//   // API FUNCTIONS (Mock Implementation)
//   // ============================================================================

//   // Search students by query
//   const searchStudents = (query) => {
//     if (!query.trim()) {
//       setFilteredStudents(students);
//       return;
//     }

//     const filtered = students.filter(student =>
//       student.name.toLowerCase().includes(query.toLowerCase()) ||
//       student.roll_number.toLowerCase().includes(query.toLowerCase()) ||
//       student.email.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredStudents(filtered);
//   };

//   // Add new student
//   const handleAddStudent = async (e) => {
//     e.preventDefault();
//     setError(null);
    
//     if (!formData.roll_number || !formData.name || !formData.branch_id || !formData.year || !formData.section) {
//       setError('Please fill all required fields');
//       return;
//     }

//     if (!formData.photo) {
//       setError('Please upload a student photo');
//       return;
//     }

//     setLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       const newStudent = {
//         id: Date.now(),
//         ...formData,
//         branch_name: getBranchName(formData.branch_id),
//         branch_code: getBranchCode(formData.branch_id)
//       };
      
//       setStudents([...students, newStudent]);
//       setSuccess('Student added successfully!');
//       resetForm();
//       setLoading(false);
//     }, 1500);
//   };

//   // Update existing student
//   const handleUpdateStudent = async (e) => {
//     e.preventDefault();
    
//     if (!editingStudent) return;
//     setError(null);

//     setLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       const updatedStudents = students.map(student =>
//         student.id === editingStudent.id 
//           ? { 
//               ...student, 
//               name: formData.name || student.name,
//               email: formData.email || student.email,
//               photo: formData.photo || student.photo
//             }
//           : student
//       );
      
//       setStudents(updatedStudents);
//       setSuccess('Student updated successfully!');
//       resetForm();
//       setLoading(false);
//     }, 1500);
//   };

//   // Delete student
//   const handleDeleteStudent = async (studentId) => {
//     if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     // Simulate API call
//     setTimeout(() => {
//       const updatedStudents = students.filter(student => student.id !== studentId);
//       setStudents(updatedStudents);
//       setSuccess('Student deleted successfully!');
//       setLoading(false);
//     }, 1000);
//   };

//   // ============================================================================
//   // HELPER FUNCTIONS
//   // ============================================================================

//   const resetForm = () => {
//     setFormData({
//       roll_number: '',
//       name: '',
//       email: '',
//       branch_id: '',
//       year: '',
//       section: '',
//       photo: null
//     });
//     setShowAddForm(false);
//     setEditingStudent(null);
//     setError(null);
//   };

//   const handleEdit = (student) => {
//     setEditingStudent(student);
//     setFormData({
//       roll_number: student.roll_number,
//       name: student.name,
//       email: student.email || '',
//       branch_id: student.branch_id || '',
//       year: student.year || '',
//       section: student.section || '',
//       photo: null
//     });
//     setShowAddForm(true);
//     setError(null);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         setError('Please select an image file');
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError('File size should be less than 5MB');
//         return;
//       }
//       setFormData({ ...formData, photo: file });
//       setError(null);
//     }
//   };

//   const getBranchName = (branchId) => {
//     const branches = {
//       '1': 'Computer Science Engineering',
//       '2': 'Information Technology',
//       '3': 'Electronics & Communication',
//       '4': 'Electrical & Electronics',
//       '5': 'Mechanical Engineering'
//     };
//     return branches[branchId] || 'Unknown';
//   };

//   const getBranchCode = (branchId) => {
//     const codes = {
//       '1': 'CSE',
//       '2': 'IT',
//       '3': 'ECE',
//       '4': 'EEE',
//       '5': 'ME'
//     };
//     return codes[branchId] || 'UNK';
//   };

//   const clearFilters = () => {
//     setFilters({
//       branch_id: '',
//       year: '',
//       section: ''
//     });
//     setSearchTerm('');
//   };

//   // ============================================================================
//   // RENDER
//   // ============================================================================

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
//       {/* Header */}
//       <header className="border-b bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
//         <div className="container mx-auto px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               {onBack && (
//                 <Button
//                   variant="outline"
//                   onClick={onBack}
//                   className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-colors"
//                 >
//                   <ArrowLeft className="w-4 h-4" />
//                   Back to Dashboard
//                 </Button>
//               )}
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
//                   <Users className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
//                     Student Management
//                   </h1>
//                   <p className="text-muted-foreground text-sm">
//                     Manage student records with face recognition
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
//                 <Users className="w-3 h-3 mr-1" />
//                 {filteredStudents.length} Students
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="container mx-auto px-6 py-8">
//         {/* Success Message */}
//         {success && (
//           <Alert className="mb-6 border-green-200 bg-green-50">
//             <CheckCircle className="h-4 w-4 text-green-600" />
//             <AlertDescription className="text-green-800">{success}</AlertDescription>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setSuccess(null)}
//               className="ml-auto text-green-600 hover:text-green-700"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </Alert>
//         )}

//         {/* Error Message */}
//         {error && (
//           <Alert variant="destructive" className="mb-6">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setError(null)}
//               className="ml-auto text-destructive-foreground hover:bg-destructive/10"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </Alert>
//         )}

//         {/* Search & Filter Card */}
//         <Card className="mb-6 bg-gradient-to-r from-white to-blue-50/30 border-blue-100">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-blue-700">
//               <Filter className="w-5 h-5" />
//               Search & Filter Students
//             </CardTitle>
//             <CardDescription>
//               Find and filter students by name, roll number, branch, year, or section
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col lg:flex-row gap-4">
//               {/* Search Input */}
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//                 <Input
//                   type="text"
//                   placeholder="Search by name, roll number, or email..."
//                   className="pl-9 bg-white/80 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
              
//               {/* Filters */}
//               <div className="flex gap-2">
//                 <Select value={filters.branch_id} onValueChange={(value) => setFilters({ ...filters, branch_id: value })}>
//                   <SelectTrigger className="w-40 bg-white/80 border-blue-200">
//                     <SelectValue placeholder="Branch" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Branches</SelectItem>
//                     <SelectItem value="1">CSE</SelectItem>
//                     <SelectItem value="2">IT</SelectItem>
//                     <SelectItem value="3">ECE</SelectItem>
//                     <SelectItem value="4">EEE</SelectItem>
//                     <SelectItem value="5">ME</SelectItem>
//                   </SelectContent>
//                 </Select>
                
//                 <Select value={filters.year} onValueChange={(value) => setFilters({ ...filters, year: value })}>
//                   <SelectTrigger className="w-32 bg-white/80 border-blue-200">
//                     <SelectValue placeholder="Year" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Years</SelectItem>
//                     <SelectItem value="1">1st Year</SelectItem>
//                     <SelectItem value="2">2nd Year</SelectItem>
//                     <SelectItem value="3">3rd Year</SelectItem>
//                     <SelectItem value="4">4th Year</SelectItem>
//                   </SelectContent>
//                 </Select>
                
//                 <Input
//                   type="text"
//                   placeholder="Section"
//                   value={filters.section}
//                   onChange={(e) => setFilters({ ...filters, section: e.target.value })}
//                   className="w-24 bg-white/80 border-blue-200"
//                 />
                
//                 {(filters.branch_id || filters.year || filters.section || searchTerm) && (
//                   <Button
//                     variant="outline"
//                     onClick={clearFilters}
//                     className="text-blue-600 border-blue-200 hover:bg-blue-50"
//                   >
//                     Clear
//                   </Button>
//                 )}
//               </div>
              
//               {/* Action Buttons */}
//               <div className="flex gap-2">
//                 <Button
//                   onClick={() => {
//                     resetForm();
//                     setShowAddForm(!showAddForm);
//                   }}
//                   className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
//                   disabled={loading}
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   {showAddForm ? 'Cancel' : 'Add Student'}
//                 </Button>
//                 <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
//                   <Upload className="w-4 h-4 mr-2" />
//                   Bulk Upload
//                 </Button>
//                 <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
//                   <Download className="w-4 h-4 mr-2" />
//                   Export
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Add/Edit Form */}
//         {showAddForm && (
//           <Card className="mb-6 bg-gradient-to-r from-white to-blue-50/20 border-blue-200 shadow-lg">
//             <CardHeader>
//               <CardTitle className="text-blue-700 flex items-center gap-2">
//                 <UserPlus className="w-5 h-5" />
//                 {editingStudent ? 'Edit Student Information' : 'Add New Student'}
//               </CardTitle>
//               <CardDescription>
//                 {editingStudent 
//                   ? 'Update student information. Only modified fields will be updated.' 
//                   : 'Enter student details with a clear face photo for recognition system'
//                 }
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Roll Number */}
//                   <div className="space-y-2">
//                     <Label htmlFor="roll_number" className="flex items-center gap-2">
//                       <Hash className="w-4 h-4 text-blue-600" />
//                       Roll Number *
//                     </Label>
//                     <Input
//                       id="roll_number"
//                       type="text"
//                       placeholder="e.g., CSE001"
//                       value={formData.roll_number}
//                       onChange={(e) => setFormData({ ...formData, roll_number: e.target.value.toUpperCase() })}
//                       required
//                       disabled={editingStudent}
//                       className="bg-white/80 border-blue-200 focus:border-blue-400"
//                     />
//                   </div>
                  
//                   {/* Full Name */}
//                   <div className="space-y-2">
//                     <Label htmlFor="name" className="flex items-center gap-2">
//                       <Users className="w-4 h-4 text-blue-600" />
//                       Full Name *
//                     </Label>
//                     <Input
//                       id="name"
//                       type="text"
//                       placeholder="Enter student's full name"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       required
//                       className="bg-white/80 border-blue-200 focus:border-blue-400"
//                     />
//                   </div>
                  
//                   {/* Email */}
//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="flex items-center gap-2">
//                       <Mail className="w-4 h-4 text-blue-600" />
//                       Email Address
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="student@example.com"
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                       className="bg-white/80 border-blue-200 focus:border-blue-400"
//                     />
//                   </div>
                  
//                   {/* Branch */}
//                   <div className="space-y-2">
//                     <Label className="flex items-center gap-2">
//                       <Building className="w-4 h-4 text-blue-600" />
//                       Branch *
//                     </Label>
//                     <Select 
//                       value={formData.branch_id} 
//                       onValueChange={(value) => setFormData({ ...formData, branch_id: value })}
//                       disabled={editingStudent}
//                     >
//                       <SelectTrigger className="bg-white/80 border-blue-200">
//                         <SelectValue placeholder="Select Branch" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="1">Computer Science Engineering (CSE)</SelectItem>
//                         <SelectItem value="2">Information Technology (IT)</SelectItem>
//                         <SelectItem value="3">Electronics & Communication (ECE)</SelectItem>
//                         <SelectItem value="4">Electrical & Electronics (EEE)</SelectItem>
//                         <SelectItem value="5">Mechanical Engineering (ME)</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
                  
//                   {/* Year */}
//                   <div className="space-y-2">
//                     <Label className="flex items-center gap-2">
//                       <Calendar className="w-4 h-4 text-blue-600" />
//                       Academic Year *
//                     </Label>
//                     <Select 
//                       value={formData.year} 
//                       onValueChange={(value) => setFormData({ ...formData, year: value })}
//                       disabled={editingStudent}
//                     >
//                       <SelectTrigger className="bg-white/80 border-blue-200">
//                         <SelectValue placeholder="Select Year" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="1">1st Year</SelectItem>
//                         <SelectItem value="2">2nd Year</SelectItem>
//                         <SelectItem value="3">3rd Year</SelectItem>
//                         <SelectItem value="4">4th Year</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
                  
//                   {/* Section */}
//                   <div className="space-y-2">
//                     <Label htmlFor="section" className="flex items-center gap-2">
//                       <GraduationCap className="w-4 h-4 text-blue-600" />
//                       Section *
//                     </Label>
//                     <Input
//                       id="section"
//                       type="text"
//                       placeholder="A"
//                       value={formData.section}
//                       onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
//                       required
//                       disabled={editingStudent}
//                       maxLength="1"
//                       className="w-20 bg-white/80 border-blue-200 focus:border-blue-400"
//                     />
//                   </div>
//                 </div>
                
//                 {/* Photo Upload */}
//                 <div className="space-y-2">
//                   <Label htmlFor="photo" className="flex items-center gap-2">
//                     <Upload className="w-4 h-4 text-blue-600" />
//                     Student Photo {!editingStudent && '*'}
//                   </Label>
//                   <Input
//                     id="photo"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     required={!editingStudent}
//                     className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 bg-white/80 border-blue-200"
//                   />
//                   <p className="text-sm text-muted-foreground">
//                     Upload a clear photo where the student's face is clearly visible. Max size: 5MB
//                   </p>
//                   {formData.photo && (
//                     <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
//                       <CheckCircle className="w-4 h-4" />
//                       Selected: {formData.photo.name}
//                     </div>
//                   )}
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex gap-4 pt-4 border-t">
//                   <Button 
//                     type="submit" 
//                     className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Processing...
//                       </>
//                     ) : editingStudent ? 'Update Student' : 'Add Student'}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={resetForm}
//                     className="border-blue-200 text-blue-600 hover:bg-blue-50"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         )}

//         {/* Students Table */}
//         <Card className="bg-white shadow-lg border-blue-100">
//           <CardHeader>
//             <CardTitle className="flex items-center justify-between text-blue-700">
//               <span className="flex items-center gap-2">
//                 <Users className="w-5 h-5" />
//                 Student Records
//               </span>
//               <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
//                 {filteredStudents.length} of {students.length} students
//               </Badge>
//             </CardTitle>
//             <CardDescription>
//               Complete list of registered students with their academic information
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-blue-100">
//                     <th className="text-left p-4 font-medium text-blue-700">Roll Number</th>
//                     <th className="text-left p-4 font-medium text-blue-700">Name</th>
//                     <th className="text-left p-4 font-medium text-blue-700">Email</th>
//                     <th className="text-left p-4 font-medium text-blue-700">Branch</th>
//                     <th className="text-left p-4 font-medium text-blue-700">Year</th>
//                     <th className="text-left p-4 font-medium text-blue-700">Section</th>
//                     <th className="text-left p-4 font-medium text-blue-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading && !showAddForm ? (
//                     <tr>
//                       <td colSpan="7" className="text-center py-12 text-muted-foreground">
//                         <div className="flex flex-col items-center gap-3">
//                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                           <span>Loading students...</span>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : filteredStudents.length === 0 ? (
//                     <tr>
//                       <td colSpan="7" className="text-center py-12 text-muted-foreground">
//                         <div className="flex flex-col items-center gap-3">
//                           <Users className="w-12 h-12 text-gray-300" />
//                           <div>
//                             <p className="font-medium">No students found</p>
//                             {searchTerm && <p className="text-sm">Try adjusting your search or filters</p>}
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredStudents.map((student, index) => (
//                       <tr 
//                         key={student.id} 
//                         className="border-b hover:bg-blue-50/50 transition-colors group"
//                         style={{ animationDelay: `${index * 50}ms` }}
//                       >
//                         <td className="p-4 font-mono text-blue-600 font-medium">{student.roll_number}</td>
//                         <td className="p-4 font-medium text-gray-900">{student.name}</td>
//                         <td className="p-4 text-muted-foreground">{student.email || 'N/A'}</td>
//                         <td className="p-4">
//                           <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
//                             {student.branch_code}
//                           </Badge>
//                         </td>
//                         <td className="p-4 text-gray-600">{student.year}</td>
//                         <td className="p-4 text-gray-600">{student.section}</td>
//                         <td className="p-4">
//                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleEdit(student)}
//                               disabled={loading}
//                               className="text-blue-600 border-blue-200 hover:bg-blue-50"
//                             >
//                               <Edit className="w-4 h-4" />
//                             </Button>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleDeleteStudent(student.id)}
//                               disabled={loading}
//                               className="text-red-600 border-red-200 hover:bg-red-50"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Quick Stats */}
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
//           <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
//             <CardContent className="p-6">
//               <div className="text-center">
//                 <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
//                   <Users className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="text-3xl font-bold text-blue-700 mb-1">{students.length}</div>
//                 <div className="text-sm text-blue-600 font-medium">Total Students</div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
//             <CardContent className="p-6">
//               <div className="text-center">
//                 <div className="bg-gradient-to-br from-green-600 to-green-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
//                   <Building className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="text-3xl font-bold text-green-700 mb-1">
//                   {new Set(students.map(s => s.branch_code)).size}
//                 </div>
//                 <div className="text-sm text-green-600 font-medium">Branches</div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
//             <CardContent className="p-6">
//               <div className="text-center">
//                 <div className="bg-gradient-to-br from-purple-600 to-purple-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
//                   <Calendar className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="text-3xl font-bold text-purple-700 mb-1">
//                   {new Set(students.map(s => s.year)).size}
//                 </div>
//                 <div className="text-sm text-purple-600 font-medium">Year Groups</div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
//             <CardContent className="p-6">
//               <div className="text-center">
//                 <div className="bg-gradient-to-br from-orange-600 to-orange-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
//                   <Filter className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="text-3xl font-bold text-orange-700 mb-1">{filteredStudents.length}</div>
//                 <div className="text-sm text-orange-600 font-medium">Filtered Results</div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentManagement;