/**
 * Edit Student Page
 * Loads existing student data and pre-fills the form
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit2, AlertCircle } from "lucide-react";
import { fetchStudentById, updateStudent } from "../services/api";
import { useToast } from "../components/ui/ToastProvider";
import StudentForm from "../components/students/StudentForm";
import { PageLoader } from "../components/ui/Spinner";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [student, setStudent] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  // Load the student on mount
  useEffect(() => {
    const load = async () => {
      setLoadingStudent(true);
      setLoadError(null);
      try {
        const result = await fetchStudentById(id);
        setStudent(result.data);
      } catch (err) {
        setLoadError(err.message || "Student not found");
      } finally {
        setLoadingStudent(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerErrors({});
    try {
      const result = await updateStudent(id, formData);
      toast(`Student "${result.data.fullName}" updated successfully!`, "success");
      navigate("/students");
    } catch (err) {
      if (err.response?.data?.field) {
        setServerErrors({
          [err.response.data.field]: err.response.data.message,
        });
      } else if (err.response?.data?.errors) {
        const mapped = {};
        err.response.data.errors.forEach(({ field, message }) => {
          mapped[field] = message;
        });
        setServerErrors(mapped);
      }
      toast(err.message || "Failed to update student", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/students" className="btn-ghost rounded-lg p-2" aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Edit2 className="h-6 w-6 text-primary-600" />
            Edit Student
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {student ? `Editing: ${student.fullName}` : "Update student information"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl">
        {loadingStudent ? (
          <div className="card">
            <PageLoader />
          </div>
        ) : loadError ? (
          <div className="card">
            <div className="flex flex-col items-center py-10 gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                <AlertCircle className="h-7 w-7 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Failed to load student</p>
                <p className="text-sm text-slate-500 mt-1">{loadError}</p>
              </div>
              <Link to="/students" className="btn-secondary btn-sm">
                Back to Students
              </Link>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="mb-5 pb-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                Update Student Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Student ID <span className="font-mono font-medium">{student.studentId}</span> is
                fixed and cannot be changed
              </p>
            </div>
            <StudentForm
              initialValues={{
                fullName:   student.fullName,
                email:      student.email,
                phone:      student.phone,
                department: student.department,
                semester:   student.semester,
                address:    student.address || "",
              }}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              isEdit={true}
              serverErrors={serverErrors}
            />
          </div>
        )}
      </div>
    </div>
  );
}
