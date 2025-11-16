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
      setSections(['A', 'B']);
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
                      {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Branch</th> */}
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
                          {/* <td className="px-4 py-3 text-sm text-gray-600">{getBranchName(student.branch_id)}</td> */}
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