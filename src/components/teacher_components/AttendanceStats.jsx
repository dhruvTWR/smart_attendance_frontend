// src/components/AttendanceStats.jsx
import { AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function AttendanceStats({ attendanceData }) {
  if (!attendanceData) return null;

  const {
    recognized_count = 0,
    unrecognized_count = 0,
    total_faces = 0
  } = attendanceData;

  // Calculate attendance rate
  const attendanceRate = total_faces > 0 
    ? ((recognized_count / total_faces) * 100).toFixed(1)
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
          <Badge className="bg-black-600 hover:bg-white-700 text-black-800">
            {recognized_count}
          </Badge>
        </div>

        {/* Unrecognized */}
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Unrecognized</span>
          </div>
          <Badge className="bg-yellow-600 hover:bg-yellow-700 text-black-800">
            {unrecognized_count}
          </Badge>
        </div>

        {/* Total Processed */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Processed</span>
          </div>
          <Badge className="bg-blue-600 hover:bg-blue-700 text-black-800">
            {total_faces}
          </Badge>
        </div>

        {/* Attendance Rate */}
        {/* <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Attendance Rate</span>
          </div>
          <Badge className="bg-purple-600 hover:bg-purple-700 text-black-800">
            {attendanceRate}%
          </Badge>
        </div> */}

        {/* Success Message */}
        <div className="pt-2 border-t">
          <p className="text-sm text-green-700 font-medium">
            {attendanceData.message || 'Attendance processed successfully'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}