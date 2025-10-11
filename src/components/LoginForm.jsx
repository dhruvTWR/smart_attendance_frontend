/* import { AlertCircle, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login validation
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!username || !password || !role) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Demo credentials
    const validCredentials = {
      teacher: { username: 'teacher', password: 'teacher123' },
      admin: { username: 'admin', password: 'admin123' }
    };

    const credentials = validCredentials[role];
    if (username === credentials.username && password === credentials.password) {
      onLogin({
        id: `${role}_001`,
        name: role === 'teacher' ? 'Ms. Johnson' : 'Admin User',
        role
      });
    } else {
      setError('Invalid credentials. Try teacher/teacher123 or admin/admin123');
    }
    
    setIsLoading(false);
  };

  return ( <>
<div className="min-h-screen bg-gray-100 flex flex-col">


  <header className=" text-black shadow-md p-2">
    <div className="container bg-green mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className=" text-2xl font-bold ">Attendease</h1>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
          className="bg-white text-black-700 hover:bg-black-100 border-black-200"
          >
            <Users className="w-4 h-4 mr-2" />
            Login to mark the attendance
          </Button>
        </div>
      </div>
    </div>
</header>



    <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
    <img 
      src="/ietdavv_logo.jpeg"   // place your uploaded image in public folder
      alt="DAVV Logo"
      className="w-16 h-16 object-contain rounded-full"
    />
  </div>
  <CardTitle>Smart Attendance System</CardTitle>
  <CardDescription>
    Please log in to access the attendance management system
  </CardDescription>
</CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={role || ''} onValueChange={(value) => setRole(value)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2">Demo Credentials:</p>
              <div className="space-y-1">
                <p>Teacher: teacher / teacher123</p>
                <p>Admin: admin / admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
} */
import { AlertCircle, Users } from 'lucide-react';
import { useState } from 'react';
import { authService } from '../api/auth/authService.js';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password || !role) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      let userData;
      if (role === 'admin') {
        userData = await authService.adminLogin(username, password);
      } else if (role === 'teacher') {
        userData = await authService.teacherLogin(username, password);
      }

      // ✅ Pass userData to parent on successful login
      onLogin({
        id: userData.id,
        name: userData.name,
        role: role,
        token: userData.token,   // assuming backend returns JWT/session token
      });

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Section */}
      <header className=" text-black shadow-md p-2">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className=" text-2xl font-bold ">Attendease</h1>
          <Button variant="outline" className="bg-white text-black hover:bg-gray-100 border">
            <Users className="w-4 h-4 mr-2" />
            Login to mark the attendance
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <img src="/ietdavv_logo.jpeg" alt="DAVV Logo" className="w-16 h-16 object-contain rounded-full" />
            </div>
            <CardTitle>Smart Attendance System</CardTitle>
            <CardDescription>
              Please log in to access the attendance management system
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={role || ''} onValueChange={(value) => setRole(value)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
