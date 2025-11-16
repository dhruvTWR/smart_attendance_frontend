// src/components/teacher_components/AttendanceStats.jsx
import { AlertTriangle, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AttendanceStats({ attendanceData }) {
  if (!attendanceData) return null;

  const {
    recognized_count = 0,
    unrecognized_count = 0,
    total_processed = 0,
    total_faces = 0
  } = attendanceData;

  // Use total_processed if available, otherwise fall back to total_faces
  const totalCount = total_processed || total_faces || (recognized_count + unrecognized_count);

  // Calculate attendance rate
  const attendanceRate = totalCount > 0 
    ? ((recognized_count / totalCount) * 100).toFixed(1)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Present Students */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Present Students</span>
          </div>
          <Badge className="bg-green-600 hover:bg-green-700 text-white">
            {recognized_count}
          </Badge>
        </div>

        {/* Absent/Unrecognized */}
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">Absent</span>
          </div>
          <Badge className="bg-red-600 hover:bg-red-700 text-white">
            {unrecognized_count}
          </Badge>
        </div>

        {/* Total Processed */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Students</span>
          </div>
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
            {totalCount}
          </Badge>
        </div>

        {/* Attendance Rate */}
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Attendance Rate</span>
          </div>
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white">
            {attendanceRate}%
          </Badge>
        </div>

        {/* Success Message */}
        {attendanceData.message && (
          <div className="pt-2 border-t">
            <p className="text-sm text-green-700 font-medium">
              {attendanceData.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}