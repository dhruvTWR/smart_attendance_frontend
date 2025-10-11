// ============================================================================
// Class Subject Management Component
// Handles assignment of subjects to classes with semester and academic year
// ============================================================================

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle, 
  ArrowLeft, 
  BookOpen, 
  Building, 
  Calendar,
  Edit, 
  Filter,
  GraduationCap,
  Hash,
  Link,
  Plus, 
  Search, 
  Settings,
  Trash2,
  Upload,
  Users,
  X 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { classSubjectService } from '../../api/admin/classSubjectService';
import { dropdownService } from '../../api/shared/dropdownService';
import { subjectService } from '../../api/admin/subjectService';

export  function ClassSubjectAssignment({ onBack }) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Mapping data state
  const [mappings, setMappings] = useState([]);
  const [filteredMappings, setFilteredMappings] = useState([]);
  
  // Dropdown options state
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [sections, setSections] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMapping, setEditingMapping] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filter state
  const [filters, setFilters] = useState({
    academic_year: '',
    branch_id: '',
    year: '',
    section: ''
  });
  
  // Form state
  const [formData, setFormData] = useState({
    subject_id: '',
    branch_id: '',
    year: '',
    section: '',
    semester: '',
    academic_year: ''
  });

  // ============================================================================
  // LIFECYCLE HOOKS
  // ============================================================================
  
  // Fetch dropdown data on mount
  useEffect(() => {
    fetchDropdownData();
    fetchMappings();
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    let filtered = mappings;

    // Apply filters
    if (filters.academic_year) {
      filtered = filtered.filter(m => m.academic_year === filters.academic_year);
    }
    if (filters.branch_id) {
      filtered = filtered.filter(m => m.branch_id.toString() === filters.branch_id);
    }
    if (filters.year) {
      filtered = filtered.filter(m => m.year.toString() === filters.year);
    }
    if (filters.section) {
      filtered = filtered.filter(m => 
        m.section.toLowerCase().includes(filters.section.toLowerCase())
      );
    }

    // Apply search
    if (searchTerm.trim()) {
      filtered = filtered.filter(m =>
        m.subject_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.branch_code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMappings(filtered);
    setCurrentPage(1);
  }, [mappings, filters, searchTerm]);

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================
  
  /**
   * Fetch branches, years, sections, and subjects from API
   */
  const fetchDropdownData = async () => {
    try {
      const [branchesData, yearsData, sectionsData, subjectsData] = await Promise.all([
        dropdownService.getBranches(),
        dropdownService.getYears(),
        dropdownService.getSections(),
        subjectService.getSubjects()
      ]);

      if (branchesData.success) setBranches(branchesData.branches || []);
      if (yearsData.success) setYears(yearsData.years || []);
      if (sectionsData.success) setSections(sectionsData.sections || []);
      if (subjectsData.success) setSubjects(subjectsData.subjects || []);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      setYears([1, 2, 3, 4]);
      setSections(['A', 'B', 'C']);
    }
  };

  /**
   * Fetch all class-subject mappings
   */
  const fetchMappings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await classSubjectService.getMappings(filters);
      
      if (data.success) {
        setMappings(data.mappings || []);
        setFilteredMappings(data.mappings || []);
      } else {
        setError('Failed to fetch class subject assignments');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching assignments');
      console.error('Error fetching mappings:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Assign subject to class
   */
  const handleAssignSubject = async () => {
    const required = ['subject_id', 'branch_id', 'year', 'section', 'semester', 'academic_year'];
    const missing = required.filter(field => !formData[field]);
    
    if (missing.length > 0) {
      setError(`Please fill all required fields: ${missing.join(', ')}`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await classSubjectService.assignSubject(formData);

      if (data.success) {
        setSuccess('Subject assigned to class successfully!');
        resetForm();
        fetchMappings();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error assigning subject';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update existing mapping
   */
  const handleUpdateMapping = async () => {
    if (!editingMapping) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData = {
        semester: formData.semester,
        academic_year: formData.academic_year
      };

      const data = await classSubjectService.updateMapping(editingMapping.id, updateData);

      if (data.success) {
        setSuccess('Class subject mapping updated successfully!');
        resetForm();
        fetchMappings();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error updating mapping';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete mapping
   */
  const handleDeleteMapping = async (mappingId) => {
    if (!window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await classSubjectService.deleteMapping(mappingId);
      
      if (data.success) {
        setSuccess('Class subject mapping deleted successfully!');
        fetchMappings();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error deleting mapping';
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
      subject_id: '',
      branch_id: '',
      year: '',
      section: '',
      semester: '',
      academic_year: ''
    });
    setShowAddForm(false);
    setEditingMapping(null);
  };

  /**
   * Set form for editing existing mapping
   */
  const handleEdit = (mapping) => {
    setEditingMapping(mapping);
    setFormData({
      subject_id: mapping.subject_id,
      branch_id: mapping.branch_id,
      year: mapping.year,
      section: mapping.section,
      semester: mapping.semester,
      academic_year: mapping.academic_year
    });
    setShowAddForm(true);
    setError(null);
    setSuccess(null);
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilters({
      academic_year: '',
      branch_id: '',
      year: '',
      section: ''
    });
    setSearchTerm('');
  };

  /**
   * Handle form submission
   */
  const handleSubmit = () => {
    if (editingMapping) {
      handleUpdateMapping();
    } else {
      handleAssignSubject();
    }
  };

  // Check if form is complete
  const isFormComplete = formData.subject_id && formData.branch_id && formData.year && 
                         formData.section && formData.semester && formData.academic_year;

  // ============================================================================
  // PAGINATION HELPERS
  // ============================================================================
  
  const totalPages = Math.ceil(filteredMappings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMappings = filteredMappings.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-orange-600">Class Subject Assignment</h1>
              <p className="text-gray-600 text-sm mt-1">
                Assign subjects to classes and manage course schedules
              </p>
            </div>
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
        {/* LEFT COLUMN: Filters + Assignment List (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Search & Filter Assignments
                </span>
                <Button onClick={() => { resetForm(); setShowAddForm(!showAddForm); }}>
                  {showAddForm ? (
                    <><X className="w-4 h-4 mr-2" /> Cancel</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" /> Assign Subject</>
                  )}
                </Button>
              </CardTitle>
              <CardDescription>
                Find and manage class subject assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by subject name, code, or branch..."
                    className="w-full pl-9 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  <Input
                    type="text"
                    placeholder="Academic Year (2024-25)"
                    value={filters.academic_year}
                    onChange={(e) => setFilters({ ...filters, academic_year: e.target.value })}
                    className="border-gray-300"
                  />
                  
                  <Select value={filters.branch_id} onValueChange={(value) => setFilters({ ...filters, branch_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.branch_code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.year} onValueChange={(value) => setFilters({ ...filters, year: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          Year {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="text"
                    placeholder="Section"
                    value={filters.section}
                    onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                    className="border-gray-300"
                  />
                </div>

                {(filters.academic_year || filters.branch_id || filters.year || filters.section || searchTerm) && (
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Assignments Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Subject Assignments
              </CardTitle>
              <CardDescription>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredMappings.length)} of {filteredMappings.length} assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Subject</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Branch</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Class</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Semester</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Academic Year</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                            <span>Loading assignments...</span>
                          </div>
                        </td>
                      </tr>
                    ) : currentMappings.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <GraduationCap className="w-12 h-12 text-gray-300" />
                            <span>No assignments found</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentMappings.map((mapping) => (
                        <tr key={mapping.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{mapping.subject_name}</div>
                            <div className="text-sm text-orange-600">{mapping.subject_code}</div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="bg-orange-50 text-orange-700">
                              {mapping.branch_code}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">{mapping.year}-{mapping.section}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{mapping.semester}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{mapping.academic_year}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(mapping)}
                                disabled={loading}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteMapping(mapping.id)}
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

              {/* Pagination */}
              {filteredMappings.length > itemsPerPage && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Add/Edit Form (1/3 width) */}
        <div>
          {showAddForm ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {editingMapping ? (
                    <><Edit className="w-5 h-5" /> Edit Assignment</>
                  ) : (
                    <><Link className="w-5 h-5 text-black-800" /> Assign Subject</>
                  )}
                </CardTitle>
                <CardDescription>
                  {editingMapping 
                    ? 'Update semester or academic year' 
                    : 'Create a new subject assignment'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Subject */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-orange-600" />
                      Subject <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.subject_id} 
                      onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
                      disabled={editingMapping}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.subject_code} - {subject.subject_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Branch */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-orange-600" />
                      Branch <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.branch_id} 
                      onValueChange={(value) => setFormData({ ...formData, branch_id: value })}
                      disabled={editingMapping}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map(branch => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.branch_code} - {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-600" />
                      Year <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.year} 
                      onValueChange={(value) => setFormData({ ...formData, year: value })}
                      disabled={editingMapping}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Section */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-orange-600" />
                      Section <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="A"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
                      maxLength="1"
                      className="w-20"
                      disabled={editingMapping}
                    />
                  </div>

                  {/* Semester */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      Semester <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.semester} 
                      onValueChange={(value) => setFormData({ ...formData, semester: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Academic Year */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-orange-600" />
                      Academic Year <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="2024-25"
                      value={formData.academic_year}
                      onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSubmit}
                    variant="ghost"
                    className="flex-1 bg-black hover:bg-gray-900 text-dark-black" disabled={loading || !isFormComplete}>
                      {loading ? 'Processing...' : editingMapping ? 'Update Assignment' : 'Assign Subject'}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-500">
                  <Link className="w-5 h-5" />
                  Assign Subject
                </CardTitle>
                <CardDescription>
                  Click "Assign Subject" to create a new assignment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No form active</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Alert */}
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Assign subjects to specific classes for proper attendance tracking and course management.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}