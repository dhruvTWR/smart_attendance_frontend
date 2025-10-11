// ============================================================================
// Subject Management Component
// Handles CRUD operations for subject records
// ============================================================================

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, BookOpen, Edit, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { subjectService } from '../../api/admin/subjectService';

export  function SubjectManagement({ onBack }) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Subject data state
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    subject_code: '',
    subject_name: ''
  });

  // ============================================================================
  // LIFECYCLE HOOKS
  // ============================================================================
  
  // Fetch subjects on mount
  useEffect(() => {
    fetchSubjects();
  }, []);
  
  // Debounced search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSubjects(subjects);
    } else {
      const timeoutId = setTimeout(() => {
        searchSubjects(searchTerm);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, subjects]);

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================
  
  /**
   * Fetch all subjects
   */
  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await subjectService.getSubjects();
      
      if (data.success) {
        setSubjects(data.subjects || []);
        setFilteredSubjects(data.subjects || []);
      } else {
        setError('Failed to fetch subjects');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching subjects');
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search subjects by code or name
   */
  const searchSubjects = async (query) => {
    if (!query.trim()) {
      setFilteredSubjects(subjects);
      return;
    }

    try {
      const data = await subjectService.searchSubjects(query);
      
      if (data.success) {
        setFilteredSubjects(data.subjects || []);
      }
    } catch (err) {
      console.error('Error searching subjects:', err);
      // Fallback to local search
      const filtered = subjects.filter(subject =>
        subject.subject_name.toLowerCase().includes(query.toLowerCase()) ||
        subject.subject_code.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSubjects(filtered);
    }
  };

  /**
   * Add new subject
   */
  const handleAddSubject = async () => {
    if (!formData.subject_code || !formData.subject_name) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await subjectService.addSubject(
        formData.subject_code,
        formData.subject_name
      );

      if (data.success) {
        setSuccess('Subject added successfully!');
        resetForm();
        fetchSubjects();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error adding subject';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete subject
   */
  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject? This will also delete related class assignments and attendance records.')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await subjectService.deleteSubject(subjectId);
      
      if (data.success) {
        setSuccess('Subject deleted successfully!');
        fetchSubjects();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error deleting subject';
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
      subject_code: '',
      subject_name: ''
    });
    setShowAddForm(false);
    setEditingSubject(null);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleAddSubject();
  };

  // Check if form is complete
  const isFormComplete = formData.subject_code && formData.subject_name;

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
            <h1 className="text-3xl font-bold text-green-600">Subject Management</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage subjects for your institution
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
        {/* LEFT COLUMN: Search + Subject List (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Subjects
                </span>
                <Button onClick={() => { resetForm(); setShowAddForm(!showAddForm); }}>
                  {showAddForm ? (
                    <><X className="w-4 h-4 mr-2" /> Cancel</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" /> Add Subject</>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search by subject code or name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Subject List Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Subject List
              </CardTitle>
              <CardDescription>
                Showing {filteredSubjects.length} of {subjects.length} subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Subject Code</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Subject Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="px-4 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <span>Loading subjects...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredSubjects.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-4 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <Search className="w-12 h-12 text-gray-300" />
                            <span>No subjects found</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredSubjects.map((subject) => (
                        <tr key={subject.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{subject.subject_code}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{subject.subject_name}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteSubject(subject.id)}
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

        {/* RIGHT COLUMN: Add Form (1/3 width) */}
        <div>
          {showAddForm ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Add New Subject
                </CardTitle>
                <CardDescription>
                  Add a new subject to the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Subject Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Subject Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., CS101"
                      value={formData.subject_code}
                      onChange={(e) => setFormData({ ...formData, subject_code: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  {/* Subject Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Subject Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Data Structures"
                      value={formData.subject_name}
                      onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1" disabled={loading || !isFormComplete}>
                      {loading ? 'Processing...' : 'Add Subject'}
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
                  Add Subject
                </CardTitle>
                <CardDescription>
                  Click the "Add Subject" button above to add a new subject
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No form active</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Alert */}
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Deleting a subject will cascade to remove all related class assignments and attendance records.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}