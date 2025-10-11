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
  const recognizedCount = results.filter(r => r.status === 'recognized').length;
  const unrecognizedCount = results.filter(r => r.status === 'unrecognized').length;

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
              Processing completed - {results.length} faces detected
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
            <div className="text-2xl text-green-700">{recognizedCount}</div>
            <div className="text-sm text-green-600">Recognized</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl text-yellow-700">{unrecognizedCount}</div>
            <div className="text-sm text-yellow-600">Unrecognized</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl text-blue-700">{results.length}</div>
            <div className="text-sm text-blue-600">Total Faces</div>
          </div>
        </div>

        {/* Results Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {record.status === 'recognized' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                      {record.studentName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={record.status === 'recognized' ? 'default' : 'secondary'}>
                      {record.studentId}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={record.status === 'recognized' ? 'default' : 'secondary'}
                      className={
                        record.status === 'recognized' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {record.status === 'recognized' ? 'Present' : 'Unknown'}
                    </Badge>
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
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {record.timestamp.toLocaleTimeString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {unrecognizedCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-800">Unrecognized Faces Detected</span>
            </div>
            <p className="text-sm text-yellow-700">
              {unrecognizedCount} face(s) could not be matched to registered students. 
              These may be visitors, new students, or faces with poor image quality.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}