/**
 * Add Student Page
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { createStudent } from "../services/api";
import { useToast } from "../components/ui/ToastProvider";
import StudentForm from "../components/students/StudentForm";

export default function AddStudent() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setServerErrors({});
    try {
      const result = await createStudent(formData);
      toast(`Student "${result.data.fullName}" created successfully!`, "success");
      navigate("/students");
    } catch (err) {
      // Map API field errors back to form
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
      toast(err.message || "Failed to create student", "error");
    } finally {
      setIsLoading(false);
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
            <UserPlus className="h-6 w-6 text-primary-600" />
            Add New Student
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Fill in the details below to register a new student
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-3xl">
        <div className="card">
          <div className="mb-5 pb-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-800">
              Student Information
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fields marked with <span className="text-red-500">*</span> are required
            </p>
          </div>
          <StudentForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isEdit={false}
            serverErrors={serverErrors}
          />
        </div>
      </div>
    </div>
  );
}
