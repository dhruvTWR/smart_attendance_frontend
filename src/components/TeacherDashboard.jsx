import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Calendar,
  Camera,
  Download,
  Eye,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AttendanceStats } from "../components/teacher_components/AttendanceStats.jsx";
import { StudentAttendanceList } from "../components/teacher_components/StudentAttendanceList.jsx";

// Import axios services
import { dropdownService } from "../api/shared/dropdownService.js";
import { classService } from "../api/teacher/classService.js";
import { attendanceService } from "../api/teacher/attendanceService.js";
import { reportService } from "../api/teacher/reportService.js";

export function TeacherDashboard() {
  // Class selection state
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Photo upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // NEW: Multiple file upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [enableMultipleUpload, setEnableMultipleUpload] = useState(false);

  // NEW: Quality check state
  const [qualityChecks, setQualityChecks] = useState([]);
  const [isCheckingQuality, setIsCheckingQuality] = useState(false);
  const [showQualityWarning, setShowQualityWarning] = useState(false);
  const [poorQualityFiles, setPoorQualityFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Photo upload state
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);
  // const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Results state for showing stats and list
  const [attendanceResults, setAttendanceResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Manual attendance modification state
  const [updatingStudents, setUpdatingStudents] = useState(new Set());
  const [manualUpdateError, setManualUpdateError] = useState(null);

  // Report viewing state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");

  // Date-specific attendance state
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateAttendance, setDateAttendance] = useState(null);
  const [loadingDateAttendance, setLoadingDateAttendance] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch branches on mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch subjects when class details change
  useEffect(() => {
    if (selectedBranch && selectedYear && selectedSection) {
      fetchSubjects();
    } else {
      setSubjects([]);
      setSelectedSubject(null);
    }
  }, [selectedBranch, selectedYear, selectedSection, selectedAcademicYear]);

  const fetchBranches = async () => {
    try {
      const data = await dropdownService.getBranches();
      if (data.success) {
        setBranches(data.branches);
      }
    } catch (err) {
      console.error("Failed to fetch branches:", err);
      setError("Failed to load branches");
    }
  };

  const fetchSubjects = async () => {
    setLoadingSubjects(true);
    setError(null);

    try {
      const data = await classService.getSubjectsForClass(
        selectedBranch,
        selectedYear,
        selectedSection,
        selectedAcademicYear
      );

      if (data.success) {
        setSubjects(data.subjects || []);
        if (!data.subjects || data.subjects.length === 0) {
          setError(
            "No subjects found for this class. Please add subjects in the database."
          );
        }
      } else {
        setError(data.message || "Failed to load subjects");
        setSubjects([]);
      }
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      setError("Failed to load subjects");
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  // const handleFileSelect = (event) => {
  //   const file = event.target.files?.[0];
  //   if (file && file.type.startsWith('image/')) {
  //     if (file.size > 10 * 1024 * 1024) {
  //       setError('File size must be less than 10MB');
  //       return;
  //     }

  //     setSelectedFile(file);
  //     setError(null);
  //     setSuccess(null);

  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setError('Please select a valid image file');
  //   }
  // };

  const handleFileSelect = (event) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    // Check if multiple files selected
    if (files.length > 1) {
      setEnableMultipleUpload(true);

      // Handle multiple files
      const fileArray = Array.from(files);
      const validFiles = [];
      const previews = [];

      fileArray.forEach((file) => {
        if (file.type.startsWith("image/")) {
          if (file.size <= 10 * 1024 * 1024) {
            validFiles.push(file);

            const reader = new FileReader();
            reader.onloadend = () => {
              previews.push({
                file: file.name,
                url: reader.result,
              });

              if (previews.length === validFiles.length) {
                setImagePreviews(previews);
              }
            };
            reader.readAsDataURL(file);
          } else {
            setError(`File ${file.name} is too large (max 10MB)`);
          }
        }
      });

      if (validFiles.length > 0) {
        setSelectedFiles(validFiles);
        setError(null);
        setSuccess(null);
        setQualityChecks([]);
      }
    } else {
      // Handle single file (existing behavior)
      const file = files[0];

      if (file && file.type.startsWith("image/")) {
        if (file.size > 10 * 1024 * 1024) {
          setError("File size must be less than 10MB");
          return;
        }

        setEnableMultipleUpload(false);
        setSelectedFile(file);
        setSelectedFiles([file]);
        setError(null);
        setSuccess(null);
        setQualityChecks([]);

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setImagePreviews([{ file: file.name, url: reader.result }]);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Please select a valid image file");
      }
    }
  };

  const handleCheckQuality = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select files first");
      return;
    }

    setIsCheckingQuality(true);
    setError(null);
    const checks = [];
    const poorFiles = [];

    for (const file of selectedFiles) {
      try {
        const data = await attendanceService.checkImageQuality(file);

        if (data.success && data.quality_check) {
          checks.push({
            fileName: file.name,
            ...data.quality_check,
          });

          if (!data.quality_check.acceptable) {
            poorFiles.push(file.name);
          }
        }
      } catch (err) {
        console.error(`Quality check failed for ${file.name}:`, err);
        checks.push({
          fileName: file.name,
          acceptable: false,
          error: err.message,
        });
        poorFiles.push(file.name);
      }
    }

    setQualityChecks(checks);
    setPoorQualityFiles(poorFiles);
    setShowQualityWarning(poorFiles.length > 0);
    setIsCheckingQuality(false);

    if (poorFiles.length > 0) {
      setError(
        `${poorFiles.length} image(s) have quality issues. Review and re-upload or proceed anyway.`
      );
    } else {
      setSuccess("All images passed quality check!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // const handleRemoveFile = () => {
  //   setSelectedFile(null);
  //   setImagePreview(null);
  //   setError(null);
  //   setSuccess(null);
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = '';
  //   }
  // };

  const handleRemoveFile = (indexToRemove = null) => {
    if (indexToRemove !== null && enableMultipleUpload) {
      // Remove specific file from multiple selection
      setSelectedFiles((files) => files.filter((_, i) => i !== indexToRemove));
      setImagePreviews((previews) =>
        previews.filter((_, i) => i !== indexToRemove)
      );
      setQualityChecks((checks) =>
        checks.filter((_, i) => i !== indexToRemove)
      );
    } else {
      // Clear all files
      setSelectedFile(null);
      setSelectedFiles([]);
      setImagePreview(null);
      setImagePreviews([]);
      setQualityChecks([]);
      setPoorQualityFiles([]);
      setShowQualityWarning(false);
      setEnableMultipleUpload(false);
      setError(null);
      setSuccess(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // const handleUpload = async () => {
  //   if (!selectedFile) {
  //     setError('Please select a file first');
  //     return;
  //   }

  //   if (!selectedSubject) {
  //     setError('Please select all class details (Year, Branch, Section, and Subject)');
  //     return;
  //   }

  //   setIsUploading(true);
  //   setUploadProgress(0);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     const formData = new FormData();
  //     formData.append('file', selectedFile);
  //     formData.append('class_subject_id', selectedSubject);
  //     formData.append('attendance_date', new Date().toISOString().split('T')[0]);

  //     const progressInterval = setInterval(() => {
  //       setUploadProgress(prev => Math.min(prev + 10, 90));
  //     }, 200);

  //     const data = await attendanceService.markAttendance(formData);

  //     clearInterval(progressInterval);
  //     setUploadProgress(100);

  //     if (data.success) {
  //       setSuccess(`Attendance marked successfully! ${data.recognized_count} students recognized, ${data.unrecognized_count} unrecognized.`);

  //       // Ensure all students have a proper status
  //       const processedData = {
  //         ...data,
  //         students: data.students?.map(student => ({
  //           ...student,
  //           status: student.status || (student.confidence > 0.5 ? 'present' : 'absent')
  //         })) || []
  //       };

  //       setAttendanceResults(processedData);
  //       setShowResults(true);

  //       setTimeout(() => {
  //         handleRemoveFile();
  //       }, 2000);
  //     } else {
  //       setError(data.message || 'Failed to process attendance');
  //     }
  //   } catch (err) {
  //     console.error('Upload error:', err);
  //     setError(err.response?.data?.message || 'Failed to upload photo. Please try again.');
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  const handleUpload = async (forceUpload = false) => {
    if (selectedFiles.length === 0) {
      setError("Please select file(s) first");
      return;
    }

    if (!selectedSubject) {
      setError(
        "Please select all class details (Year, Branch, Section, and Subject)"
      );
      return;
    }

    // Check quality first if not already checked
    if (qualityChecks.length === 0 && !forceUpload) {
      setError("Please check image quality first");
      return;
    }

    // Warn about poor quality if not forcing
    if (!forceUpload && poorQualityFiles.length > 0) {
      setShowQualityWarning(true);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccess(null);

    try {
      // For multiple images, process them one by one
      if (enableMultipleUpload && selectedFiles.length > 1) {
        const allResults = {
          recognized: [],
          unrecognized: [],
          total_faces: 0,
          images_processed: 0,
        };

        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("class_subject_id", selectedSubject);
          formData.append(
            "attendance_date",
            new Date().toISOString().split("T")[0]
          );
          formData.append("force_process", forceUpload.toString());

          setUploadProgress(((i + 1) / selectedFiles.length) * 90);

          try {
            const data = await attendanceService.markAttendance(formData);

            if (data.success) {
              // Merge results, avoid duplicates
              data.students?.forEach((student) => {
                if (
                  !allResults.recognized.find(
                    (s) => s.student_id === student.student_id
                  )
                ) {
                  allResults.recognized.push(student);
                }
              });

              allResults.unrecognized.push(...(data.unrecognized || []));
              allResults.total_faces += data.total_faces || 0;
              allResults.images_processed++;
            }
          } catch (err) {
            console.error(`Error processing image ${i + 1}:`, err);
          }

          // Small delay between images
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        setUploadProgress(100);

        const recognizedCount = allResults.recognized.length;
        const unrecognizedCount = allResults.unrecognized.length;

        setSuccess(
          `Attendance marked! ${recognizedCount} students recognized from ${allResults.images_processed} images, ${unrecognizedCount} unrecognized.`
        );

        setAttendanceResults({
          ...allResults,
          recognized_count: recognizedCount,
          unrecognized_count: unrecognizedCount,
          students: allResults.recognized.map((s) => ({
            ...s,
            status: s.status || "present",
          })),
        });

        setShowResults(true);
        setTimeout(() => handleRemoveFile(), 2000);
      } else {
        // Single image - original code
        const formData = new FormData();
        formData.append("file", selectedFiles[0]);
        // ... rest of original single upload code
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to upload photo. Please try again."
      );
    } finally {
      setIsUploading(false);
      setShowQualityWarning(false);
    }
  };
  //   setIsUploading(true);
  //   setUploadProgress(0);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     const formData = new FormData();

  //     // Add files
  //     if (enableMultipleUpload) {
  //       selectedFiles.forEach((file) => {
  //         formData.append("files", file);
  //       });
  //     } else {
  //       formData.append("file", selectedFiles[0]);
  //     }

  //     formData.append("class_subject_id", selectedSubject);
  //     formData.append(
  //       "attendance_date",
  //       new Date().toISOString().split("T")[0]
  //     );
  //     formData.append("skip_quality_check", forceUpload.toString());

  //     const progressInterval = setInterval(() => {
  //       setUploadProgress((prev) => Math.min(prev + 10, 90));
  //     }, 200);

  //     // Use appropriate endpoint
  //     const data = enableMultipleUpload
  //       ? await attendanceService.markAttendanceBatch(formData)
  //       : await attendanceService.markAttendance(formData);

  //     clearInterval(progressInterval);
  //     setUploadProgress(100);

  //     if (data.success) {
  //       const recognizedCount = data.recognized_count || 0;
  //       const unrecognizedCount = data.unrecognized_count || 0;
  //       const imagesProcessed = data.images_processed || selectedFiles.length;

  //       setSuccess(
  //         `Attendance marked successfully! ${recognizedCount} students recognized` +
  //           (enableMultipleUpload ? ` from ${imagesProcessed} images` : "") +
  //           `, ${unrecognizedCount} unrecognized.`
  //       );

  //       // Ensure all students have proper status
  //       const processedData = {
  //         ...data,
  //         students:
  //           data.students?.map((student) => ({
  //             ...student,
  //             status:
  //               student.status ||
  //               (student.confidence > 0.5 ? "present" : "absent"),
  //           })) || [],
  //       };

  //       setAttendanceResults(processedData);
  //       setShowResults(true);

  //       setTimeout(() => {
  //         handleRemoveFile();
  //       }, 2000);
  //     } else {
  //       setError(data.message || "Failed to process attendance");
  //     }
  //   } catch (err) {
  //     console.error("Upload error:", err);
  //     setError(
  //       err.response?.data?.message ||
  //         "Failed to upload photo. Please try again."
  //     );
  //   } finally {
  //     setIsUploading(false);
  //     setShowQualityWarning(false);
  //   }
  // };

  const handleManualAttendance = async (studentId, newStatus) => {
    setManualUpdateError(null);
    setUpdatingStudents((prev) => new Set(prev).add(studentId));

    try {
      const data = await attendanceService.markManual({
        student_id: studentId,
        status: newStatus,
        class_subject_id: selectedSubject,
        attendance_date: new Date().toISOString().split("T")[0],
      });

      if (data.success) {
        setAttendanceResults((prevResults) => {
          if (!prevResults || !prevResults.students) return prevResults;

          const updatedStudents = prevResults.students.map((student) => {
            if (student.student_id === studentId) {
              return {
                ...student,
                status: newStatus,
                manually_modified: true,
              };
            }
            return student;
          });

          const presentCount = updatedStudents.filter(
            (s) => s.status === "present"
          ).length;
          const absentCount = updatedStudents.filter(
            (s) => s.status === "absent"
          ).length;
          const totalProcessed = updatedStudents.length;

          return {
            ...prevResults,
            students: updatedStudents,
            recognized_count: presentCount,
            unrecognized_count: absentCount,
            total_processed: totalProcessed,
          };
        });

        setSuccess(`Attendance updated successfully`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setManualUpdateError(data.message || "Failed to update attendance");
      }
    } catch (err) {
      console.error("Manual attendance update error:", err);
      setManualUpdateError(
        err.response?.data?.message ||
          "Failed to update attendance. Please try again."
      );
    } finally {
      setUpdatingStudents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
    }
  };

  // Fetch attendance report
  const handleFetchReport = async () => {
    if (!selectedSubject) {
      setError("Please select a subject first");
      return;
    }

    setLoadingReport(true);
    setError(null);

    try {
      const data = await reportService.getReport(
        selectedSubject,
        reportStartDate,
        reportEndDate
      );

      if (data.success) {
        setReportData(data.report);
        setShowReportModal(true);
      } else {
        setError(data.message || "Failed to fetch report");
      }
    } catch (err) {
      console.error("Report fetch error:", err);
      setError(
        err.response?.data?.message || "Failed to fetch attendance report"
      );
    } finally {
      setLoadingReport(false);
    }
  };

  // Fetch attendance by date
  const handleFetchByDate = async () => {
    if (!selectedSubject) {
      setError("Please select a subject first");
      return;
    }

    setLoadingDateAttendance(true);
    setError(null);

    try {
      const data = await reportService.getByDate(selectedSubject, selectedDate);

      if (data.success) {
        setDateAttendance(data.records);
        setShowResults(true);

        // Format data similar to automatic attendance for consistent display
        const formattedData = {
          students: data.records || [],
          recognized_count:
            data.records?.filter((r) => r.status === "present").length || 0,
          unrecognized_count:
            data.records?.filter((r) => r.status === "absent").length || 0,
          total_processed: data.records?.length || 0,
        };

        setAttendanceResults(formattedData);
        setSuccess(`Loaded attendance for ${selectedDate}`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || "No attendance records found for this date");
      }
    } catch (err) {
      console.error("Date attendance fetch error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch attendance for selected date"
      );
    } finally {
      setLoadingDateAttendance(false);
    }
  };

  // Download report as CSV
  const downloadReportCSV = () => {
    if (!reportData) return;

    const csvRows = [];
    csvRows.push(
      [
        "Student Name",
        "Roll Number",
        "Total Classes",
        "Present",
        "Absent",
        "Attendance %",
      ].join(",")
    );

    reportData.forEach((student) => {
      csvRows.push(
        [
          student.name,
          student.roll_number,
          student.total_classes || 0,
          student.present_count || 0,
          student.absent_count || 0,
          student.attendance_percentage
            ? student.attendance_percentage.toFixed(2) + "%"
            : "0%",
        ].join(",")
      );
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${selectedSubject}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSelectedBranchName = () => {
    const branch = branches.find((b) => b.id === parseInt(selectedBranch));
    return branch ? branch.branch_name : "";
  };

  const getSelectedSubjectName = () => {
    const subject = subjects.find(
      (s) => String(s.class_subject_id) === String(selectedSubject)
    );
    return subject ? `${subject.subject_code} - ${subject.subject_name}` : "";
  };

  const isFormComplete =
    selectedBranch &&
    selectedYear &&
    selectedSection &&
    selectedAcademicYear &&
    selectedSubject;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Class Selection + Photo Upload (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle>Select Class Details</CardTitle>
              <CardDescription>
                Choose the year, branch, section, and subject for attendance
                tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Academic Year Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Academic Year</label>
                  <Select
                    value={selectedAcademicYear || ""}
                    onValueChange={setSelectedAcademicYear}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Academic Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                      <SelectItem value="2025-26">2025-26</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Select
                    value={selectedYear || ""}
                    onValueChange={setSelectedYear}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">I Year</SelectItem>
                      <SelectItem value="2">II Year</SelectItem>
                      <SelectItem value="3">III Year</SelectItem>
                      <SelectItem value="4">IV Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Branch Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Branch/Department
                  </label>
                  <Select
                    value={selectedBranch || ""}
                    onValueChange={setSelectedBranch}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) =>
                        branch && branch.id ? (
                          <SelectItem
                            key={branch.id}
                            value={branch.id.toString()}
                          >
                            {branch.branch_name} ({branch.branch_code})
                          </SelectItem>
                        ) : null
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Section Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Section</label>
                  <Select
                    value={selectedSection || ""}
                    onValueChange={setSelectedSection}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Section A</SelectItem>
                      <SelectItem value="B">Section B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select
                    value={selectedSubject || ""}
                    onValueChange={setSelectedSubject}
                    disabled={
                      !selectedBranch ||
                      !selectedYear ||
                      !selectedSection ||
                      loadingSubjects
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingSubjects
                            ? "Loading subjects..."
                            : !selectedBranch ||
                              !selectedYear ||
                              !selectedSection
                            ? "Select Year, Branch & Section first"
                            : subjects.length === 0
                            ? "No subjects available"
                            : "Select Subject"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem
                          key={subject.class_subject_id}
                          value={subject.class_subject_id}
                        >
                          {subject.subject_code} - {subject.subject_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Selection Summary */}
              {isFormComplete && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Academic Year:</span>{" "}
                    {selectedAcademicYear}
                    <br />
                    <span className="font-medium">Selected Class:</span>{" "}
                    {selectedYear === "1"
                      ? "I"
                      : selectedYear === "2"
                      ? "II"
                      : selectedYear === "3"
                      ? "III"
                      : "IV"}{" "}
                    Year {getSelectedBranchName()} - Section {selectedSection}
                    <br />
                    <span className="font-medium">Subject:</span>{" "}
                    {getSelectedSubjectName()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photo Upload Card */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Upload Class Photo
              </CardTitle>
              <CardDescription>
                Upload a photo of your class to automatically mark attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 gap-2 text-center bg-gray-50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-upload"
                  disabled={!isFormComplete}
                />
                
                {selectedFile ? (
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-64 rounded-lg border-2 border-gray-200"
                        />
                        <button
                          onClick={handleRemoveFile}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          disabled={isUploading}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    
                    <div className="flex gap-2 justify-center">
                      <Button onClick={handleUpload} disabled={isUploading || !isFormComplete}>
                        {isUploading ? 'Processing...' : 'Process Photo'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleRemoveFile}
                        disabled={isUploading}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-700">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG or GIF (max 10MB)
                      </p>
                    </div>
                    <Button asChild disabled={!isFormComplete}>
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                    {!isFormComplete && (
                      <p className="text-xs text-gray-500 mt-2">
                        Please select class details first
                      </p>
                    )}
                  </div>
                )}
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Processing image...</span>
                    <span className="font-medium text-gray-900">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {manualUpdateError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{manualUpdateError}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>   */}
          {/* Photo Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Upload Class Photo{enableMultipleUpload && "s"}
              </CardTitle>
              <CardDescription>
                Upload {enableMultipleUpload ? "multiple photos" : "a photo"} of
                your class to automatically mark attendance
                {enableMultipleUpload &&
                  " (from different angles/rows for better coverage)"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 gap-2 text-center bg-gray-50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-upload"
                  disabled={!isFormComplete}
                />

                {selectedFiles.length > 0 ? (
                  <div className="space-y-4">
                    {/* Image Previews Grid */}
                    <div
                      className={`grid gap-4 ${
                        selectedFiles.length > 1
                          ? "grid-cols-2 md:grid-cols-3"
                          : "grid-cols-1"
                      }`}
                    >
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview.url}
                            alt={`Preview ${index + 1}`}
                            className="max-h-40 w-full object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            disabled={isUploading}
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* Quality indicator */}
                          {qualityChecks[index] && (
                            <div
                              className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                                qualityChecks[index].acceptable
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {qualityChecks[index].acceptable
                                ? "✓ Good"
                                : "⚠ Poor Quality"}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedFiles.length} file
                        {selectedFiles.length > 1 ? "s" : ""} selected
                      </p>
                      <p className="text-sm text-gray-500">
                        Total size:{" "}
                        {(
                          selectedFiles.reduce((sum, f) => sum + f.size, 0) /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>

                    {/* Quality Check Results */}
                    {qualityChecks.length > 0 && (
                      <div className="space-y-2 text-left">
                        {qualityChecks.map((check, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded border ${
                              check.acceptable
                                ? "border-green-200 bg-green-50"
                                : "border-red-200 bg-red-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">
                                {check.fileName}
                              </span>
                              <span
                                className={`text-xs font-bold ${
                                  check.acceptable
                                    ? "text-green-700"
                                    : "text-red-700"
                                }`}
                              >
                                Score: {check.quality_score}/100
                              </span>
                            </div>
                            {!check.acceptable && check.issues && (
                              <div className="text-xs text-red-600 space-y-1 mt-2">
                                {check.issues.map((issue, i) => (
                                  <div key={i}>
                                    ⚠ {issue.message}
                                    <br />
                                    <span className="text-red-500">
                                      → {issue.recommendation}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 justify-center flex-wrap">
                      {qualityChecks.length === 0 && (
                        <Button
                          onClick={handleCheckQuality}
                          disabled={
                            isCheckingQuality || isUploading || !isFormComplete
                          }
                          variant="outline"
                        >
                          {isCheckingQuality
                            ? "Checking Quality..."
                            : "Check Quality"}
                        </Button>
                      )}

                      {qualityChecks.length > 0 && (
                        <Button
                          onClick={() => handleUpload(false)}
                          disabled={
                            isUploading ||
                            !isFormComplete ||
                            poorQualityFiles.length === selectedFiles.length
                          }
                        >
                          {isUploading
                            ? "Processing..."
                            : "Process Photo" +
                              (selectedFiles.length > 1 ? "s" : "")}
                        </Button>
                      )}

                      {poorQualityFiles.length > 0 &&
                        qualityChecks.length > 0 && (
                          <Button
                            onClick={() => handleUpload(true)}
                            disabled={isUploading || !isFormComplete}
                            variant="destructive"
                          >
                            Upload Anyway
                          </Button>
                        )}

                      <Button
                        variant="outline"
                        onClick={() => handleRemoveFile()}
                        disabled={isUploading}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG or GIF (max 10MB per file)
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        💡 Tip: Select multiple images for better coverage
                      </p>
                    </div>
                    <Button asChild disabled={!isFormComplete}>
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        Choose File(s)
                      </label>
                    </Button>
                    {!isFormComplete && (
                      <p className="text-xs text-gray-500 mt-2">
                        Please select class details first
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Quality Warning Dialog */}
              {showQualityWarning && poorQualityFiles.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>
                      {poorQualityFiles.length} image(s) have quality issues:
                    </strong>
                    <ul className="list-disc ml-4 mt-2 text-sm">
                      {poorQualityFiles.map((fileName, i) => (
                        <li key={i}>{fileName}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-sm">
                      Consider re-uploading better quality images or click
                      "Upload Anyway" to proceed.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      Processing image{selectedFiles.length > 1 ? "s" : ""}...
                    </span>
                    <span className="font-medium text-gray-900">
                      {uploadProgress}%
                    </span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {manualUpdateError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{manualUpdateError}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          <Alert>
            <AlertTriangle className="h-4 w-4 gap-2" />
            <AlertDescription>
              Make sure students are clearly visible in the photo for best
              recognition results. You can manually modify attendance after
              processing.
            </AlertDescription>
          </Alert>
        </div>

        {/* RIGHT COLUMN: Quick Stats (1/3 width) */}
        <div>
          {showResults && attendanceResults ? (
            <AttendanceStats attendanceData={attendanceResults} />
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-500">
                  <Camera className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
                <CardDescription>
                  Upload a class photo or view attendance to see statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Statistics will appear here after processing
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* View Attendance Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            View Attendance
          </CardTitle>
          <CardDescription>
            View attendance records by date or generate reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* View by Date Section */}
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              View Attendance by Date
            </h3>
            <div className="flex gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                disabled={!isFormComplete}
              />
              <Button
                onClick={handleFetchByDate}
                disabled={!isFormComplete || loadingDateAttendance}
                size="sm"
              >
                {loadingDateAttendance ? "Loading..." : "View"}
              </Button>
            </div>
          </div>

          {/* Generate Report Section */}
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Generate Attendance Report
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-gray-600">
                  Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={reportStartDate}
                  onChange={(e) => setReportStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled={!isFormComplete}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={(e) => setReportEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled={!isFormComplete}
                />
              </div>
            </div>
            <Button
              onClick={handleFetchReport}
              disabled={!isFormComplete || loadingReport}
              className="w-full"
              size="sm"
            >
              {loadingReport ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* BOTTOM SECTION: Student List (Full Width) */}
      {showResults && attendanceResults && attendanceResults.students && (
        <div className="mt-6">
          <StudentAttendanceList
            students={attendanceResults.students}
            attendanceDate={selectedDate}
            onManualUpdate={handleManualAttendance}
            updatingStudents={updatingStudents}
          />
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && reportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Attendance Report
                  </CardTitle>
                  <CardDescription>
                    {getSelectedSubjectName()}
                    {reportStartDate && ` from ${reportStartDate}`}
                    {reportEndDate && ` to ${reportEndDate}`}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadReportCSV}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowReportModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1 p-6">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Roll No
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Name
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                        Total Classes
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                        Present
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                        Absent
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                        Attendance %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {reportData.map((student, index) => (
                      <tr
                        key={student.student_id || index}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm font-medium">
                            {student.roll_number}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {student.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <span className="font-medium text-sm">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-medium">
                          {student.total_classes || 0}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {student.present_count || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {student.absent_count || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="flex-1 max-w-[100px]">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    (student.attendance_percentage || 0) >= 75
                                      ? "bg-green-600"
                                      : (student.attendance_percentage || 0) >=
                                        60
                                      ? "bg-yellow-600"
                                      : "bg-red-600"
                                  }`}
                                  style={{
                                    width: `${
                                      student.attendance_percentage || 0
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <span
                              className={`text-sm font-semibold ${
                                (student.attendance_percentage || 0) >= 75
                                  ? "text-green-700"
                                  : (student.attendance_percentage || 0) >= 60
                                  ? "text-yellow-700"
                                  : "text-red-700"
                              }`}
                            >
                              {student.attendance_percentage?.toFixed(1) || 0}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {reportData.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No attendance records found for the selected period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
