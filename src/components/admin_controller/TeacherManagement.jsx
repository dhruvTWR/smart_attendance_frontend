// src/components/admin/TeacherManagement.jsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertTriangle, ArrowLeft, Edit, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { teacherService } from '../../api/admin/teacherService';

export function TeacherManagement({ onBack }) {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '' });

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter(teacher =>
        teacher.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeachers(filtered);
    }
  }, [searchTerm, teachers]);

  // 1. GET ALL TEACHERS - Maps to: GET /api/admin/teachers
  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teacherService.getTeachers();
      if (data.success) {
        setTeachers(data.teachers || []);
        setFilteredTeachers(data.teachers || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching teachers');
    } finally {
      setLoading(false);
    }
  };

  // 2. ADD TEACHER - Maps to: POST /api/admin/teachers
  // Backend: add_teacher(username, password)
  const handleAddTeacher = async () => {
    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await teacherService.addTeacher({
        username: formData.username,
        password: formData.password
      });
      if (data.success) {
        setSuccess('Teacher added successfully!');
        resetForm();
        fetchTeachers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding teacher');
    } finally {
      setLoading(false);
    }
  };

  // 3. UPDATE TEACHER - Maps to: PUT /api/admin/teachers/:id
  // Backend: update_teacher(teacher_id, username?, password?)
  const handleUpdateTeacher = async () => {
    if (!editingTeacher || !formData.username) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const updateData = { username: formData.username };
      if (formData.password) updateData.password = formData.password;
      
      const data = await teacherService.updateTeacher(editingTeacher.id, updateData);
      if (data.success) {
        setSuccess('Teacher updated successfully!');
        resetForm();
        fetchTeachers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating teacher');
    } finally {
      setLoading(false);
    }
  };

  // 4. DELETE TEACHER - Maps to: DELETE /api/admin/teachers/:id (if exists in backend)
  const handleDeleteTeacher = async (teacherId) => {
    if (!confirm('Delete this teacher?')) return;
    setLoading(true);
    try {
      await teacherService.deleteTeacher(teacherId);
      setSuccess('Teacher deleted successfully!');
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting teacher');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ username: '', password: '' });
    setShowAddForm(false);
    setEditingTeacher(null);
    setError(null);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({ username: teacher.username, password: '' });
    setShowAddForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editingTeacher ? handleUpdateTeacher() : handleAddTeacher();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" onClick={onBack} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-green-600">Teacher Management</h1>
            <p className="text-gray-600 text-sm mt-1">Manage teacher accounts</p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}><X className="w-4 h-4" /></Button>
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 mb-4">
          <AlertDescription className="text-green-800 flex items-center justify-between">
            <span>{success}</span>
            <Button variant="ghost" size="sm" onClick={() => setSuccess(null)}><X className="w-4 h-4" /></Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Search className="w-5 h-5" />Search Teachers</span>
                <Button onClick={() => { resetForm(); setShowAddForm(!showAddForm); }}>
                  {showAddForm ? <><X className="w-4 h-4 mr-2" />Cancel</> : <><Plus className="w-4 h-4 mr-2" />Add Teacher</>}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Search by username..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teacher List</CardTitle>
              <CardDescription>Showing {filteredTeachers.length} of {teachers.length} teachers</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Username</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    <tr><td colSpan="2" className="px-4 py-12 text-center">Loading...</td></tr>
                  ) : filteredTeachers.length === 0 ? (
                    <tr><td colSpan="2" className="px-4 py-12 text-center text-gray-500">No teachers found</td></tr>
                  ) : (
                    filteredTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{teacher.username}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(teacher)} disabled={loading}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteTeacher(teacher.id)} disabled={loading} className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div>
          {showAddForm ? (
            <Card>
              <CardHeader>
                <CardTitle>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</CardTitle>
                <CardDescription>{editingTeacher ? 'Update credentials' : 'Create new account'}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username <span className="text-red-500">*</span></label>
                    <Input placeholder="Enter username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password {!editingTeacher && <span className="text-red-500">*</span>}</label>
                    <Input type="password" placeholder={editingTeacher ? "Leave blank to keep current" : "Enter password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editingTeacher} disabled={loading} />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1" disabled={loading || !formData.username || (!editingTeacher && !formData.password)}>
                      {loading ? 'Processing...' : editingTeacher ? 'Update' : 'Add'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-gray-500">Add Teacher</CardTitle>
                <CardDescription>Click "Add Teacher" to create account</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}