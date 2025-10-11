import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  CalendarIcon, 
  Download, 
  TrendingUp, 
  Users, 
  Clock,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';

export function AttendanceReport() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedDate, setSelectedDate] = useState();

  const attendanceData = [
    { date: '2024-01-15', class: '10A', present: 23, absent: 2, total: 25, percentage: 92 },
    { date: '2024-01-15', class: '10B', present: 18, absent: 4, total: 22, percentage: 82 },
    { date: '2024-01-15', class: '10C', present: 20, absent: 1, total: 21, percentage: 95 },
    { date: '2024-01-14', class: '10A', present: 24, absent: 1, total: 25, percentage: 96 },
    { date: '2024-01-14', class: '10B', present: 19, absent: 3, total: 22, percentage: 86 },
    { date: '2024-01-14', class: '10C', present: 21, absent: 0, total: 21, percentage: 100 },
    { date: '2024-01-13', class: '10A', present: 22, absent: 3, total: 25, percentage: 88 },
    { date: '2024-01-13', class: '10B', present: 17, absent: 5, total: 22, percentage: 77 },
    { date: '2024-01-13', class: '10C', present: 19, absent: 2, total: 21, percentage: 90 },
  ];

  const chartData = [
    { name: '10A', present: 69, absent: 6 },
    { name: '10B', present: 54, absent: 12 },
    { name: '10C', present: 60, absent: 3 },
  ];

  const pieData = [
    { name: 'Present', value: 183, color: '#22c55e' },
    { name: 'Absent', value: 21, color: '#ef4444' },
  ];

  const filteredData = attendanceData.filter(item => {
    const classMatch = selectedClass === 'all' || item.class === selectedClass;
    const dateMatch = !selectedDate || item.date === format(selectedDate, 'yyyy-MM-dd');
    return classMatch && dateMatch;
  });

  const totalPresent = filteredData.reduce((sum, item) => sum + item.present, 0);
  const totalAbsent = filteredData.reduce((sum, item) => sum + item.absent, 0);
  const overallPercentage = totalPresent + totalAbsent > 0 ? 
    Math.round((totalPresent / (totalPresent + totalAbsent)) * 100) : 0;

  const handleExportReport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const classFilter = selectedClass === 'all' ? 'all_classes' : selectedClass;
    alert(`Attendance report exported: attendance_report_${classFilter}_${timestamp}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Present</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{totalPresent}</div>
            <p className="text-xs text-muted-foreground">Students attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Absent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">{totalAbsent}</div>
            <p className="text-xs text-muted-foreground">Students absent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{overallPercentage}%</div>
            <p className="text-xs text-muted-foreground">Overall percentage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Classes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">3</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance by Class</CardTitle>
            <CardDescription>Present vs Absent students</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#22c55e" name="Present" />
                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Distribution</CardTitle>
            <CardDescription>Total attendance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Present ({pieData[0].value})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Absent ({pieData[1].value})</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Detailed Attendance Report</CardTitle>
              <CardDescription>Filter and export attendance data</CardDescription>
            </div>
            <Button onClick={handleExportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="10A">Class 10A</SelectItem>
                  <SelectItem value="10B">Class 10B</SelectItem>
                  <SelectItem value="10C">Class 10C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button variant="outline" onClick={() => { setSelectedClass('all'); setSelectedDate(undefined); }}>
              Clear Filters
            </Button>
          </div>

          {/* Data Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.class}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600">{item.present}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-red-600">{item.absent}</span>
                    </TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.percentage >= 90 ? 'default' : item.percentage >= 80 ? 'secondary' : 'destructive'}
                        className={
                          item.percentage >= 90 ? 'bg-green-100 text-green-800' :
                          item.percentage >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {item.percentage}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No attendance data found for the selected filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}