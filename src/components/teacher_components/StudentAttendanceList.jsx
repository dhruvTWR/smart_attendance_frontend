// src/components/teacher_components/StudentAttendanceList.jsx
import { Award, CheckCircle, UserCheck, UserX, XCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

export function StudentAttendanceList({ 
  students, 
  attendanceDate, 
  onManualUpdate, 
  updatingStudents = new Set() 
}) {
  if (!students || students.length === 0) {
    return null;
  }

  // Sort students by roll number
  const sortedStudents = [...students].sort((a, b) =>
    a.roll_number.localeCompare(b.roll_number)
  );

  // Calculate present and absent counts
  const presentCount = sortedStudents.filter(s => s.status === 'present').length;
  const absentCount = sortedStudents.filter(s => s.status === 'absent').length;

  const getConfidenceBadgeClass = (confidence) => {
    if (confidence >= 0.9)
      return "bg-green-100 text-green-800 border-green-300";
    if (confidence >= 0.8) return "bg-blue-100 text-blue-800 border-blue-300";
    if (confidence >= 0.7)
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-orange-100 text-orange-800 border-orange-300";
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.9) return "Excellent";
    if (confidence >= 0.8) return "Very Good";
    if (confidence >= 0.7) return "Good";
    return "Fair";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Attendance Results
            </CardTitle>
            <CardDescription>
              {students.length} student{students.length !== 1 ? "s" : ""}{" "}
              processed
              {attendanceDate &&
                ` on ${new Date(attendanceDate).toLocaleDateString()}`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-lg px-4 py-2 bg-green-50">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              {presentCount} Present
            </Badge>
            {absentCount > 0 && (
              <Badge variant="outline" className="text-lg px-4 py-2 bg-red-50">
                <XCircle className="w-4 h-4 mr-2 text-red-600" />
                {absentCount} Absent
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student, index) => (
                <TableRow
                  key={student.student_id}
                  className="hover:bg-muted/30"
                >
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {student.roll_number}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-medium">{student.name}</span>
                        {student.manually_modified && (
                          <Badge variant="outline" className="ml-2 text-xs bg-amber-50 text-amber-700 border-amber-300">
                            Modified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getConfidenceBadgeClass(
                              student.confidence
                            )}
                          >
                            {(student.confidence * 100).toFixed(0)}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {getConfidenceLabel(student.confidence)}
                          </span>
                        </div>
                        {/* Confidence Progress Bar */}
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              student.confidence >= 0.9
                                ? "bg-green-600"
                                : student.confidence >= 0.8
                                ? "bg-blue-600"
                                : student.confidence >= 0.7
                                ? "bg-yellow-600"
                                : "bg-orange-600"
                            }`}
                            style={{ width: `${student.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {student.status === 'present' ? (
                      <Badge className="bg-green-600 hover:bg-green-700 text-black-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Present
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Absent
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant={student.status === "present" ? "default" : "outline"}
                        onClick={() => onManualUpdate(student.student_id, "present")}
                        disabled={updatingStudents.has(student.student_id) || student.status === "present"}
                        className="h-8 w-8 p-0"
                        title="Mark Present"
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={student.status === "absent" ? "destructive" : "outline"}
                        onClick={() => onManualUpdate(student.student_id, "absent")}
                        disabled={updatingStudents.has(student.student_id) || student.status === "absent"}
                        className="h-8 w-8 p-0"
                        title="Mark Absent"
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary Footer */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <Award className="w-5 h-5" />
            <span className="font-medium">
              Attendance Summary
            </span>
          </div>
          <div className="text-sm text-blue-700 mt-2 space-y-1">
            <p>✓ {presentCount} student{presentCount !== 1 ? 's' : ''} marked present</p>
            {absentCount > 0 && (
              <p>✗ {absentCount} student{absentCount !== 1 ? 's' : ''} marked absent</p>
            )}
            <p className="text-xs mt-2 text-blue-600">
              Click the action buttons to manually modify attendance if needed.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}