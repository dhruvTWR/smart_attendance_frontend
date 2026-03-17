import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Clock
} from 'lucide-react';

export function AttendanceResults({ results, onExportExcel }) {
  const presentCount = results.filter(r => r.status === 'present').length;
  const absentCount = results.filter(r => r.status === 'absent').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Attendance Results
            </CardTitle>
            <CardDescription>
              Attendance marked - {results.length} students
            </CardDescription>
          </div>
          <Button onClick={onExportExcel}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl text-green-700">{presentCount}</div>
            <div className="text-sm text-green-600">Present</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl text-red-700">{absentCount}</div>
            <div className="text-sm text-red-600">Absent</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl text-blue-700">{results.length}</div>
            <div className="text-sm text-blue-600">Total Students</div>
          </div>
        </div>

        {/* Results Table */}
        <div className="border rounded-md overflow-y-auto max-h-[500px]">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-50 z-10">
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((record, index) => (
                <TableRow key={`${record.student_id}-${record.roll_number}-${index}`}>
                  <TableCell>
                    <Badge variant="outline">{record.roll_number}</Badge>
                  </TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {record.status === 'present' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <Badge 
                        className={
                          record.status === 'present' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {record.status === 'present' ? 'Present' : 'Absent'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.confidence ? (
                      <span className="text-sm">
                        {(record.confidence * 100).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{record.remarks || '-'}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {absentCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-red-800">Absent Students</span>
            </div>
            <p className="text-sm text-red-700">
              {absentCount} student(s) marked as absent - not recognized in the images.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}