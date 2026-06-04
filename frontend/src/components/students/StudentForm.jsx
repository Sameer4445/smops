/**
 * Student Form Component
 * Reusable form used by both AddStudent and EditStudent pages
 */

import { useState } from "react";
import { AlertCircle } from "lucide-react";

const DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Data Science",
  "Information Technology",
];

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const EMPTY_FORM = {
  studentId: "",
  fullName: "",
  email: "",
  phone: "",
  department: "",
  semester: "",
  address: "",
};

/**
 * Client-side form validation
 * Returns an errors object; empty object means valid
 */
const validate = (data, isEdit = false) => {
  const errors = {};

  if (!isEdit && !data.studentId.trim()) {
    errors.studentId = "Student ID is required";
  } else if (!isEdit && !/^[A-Za-z0-9\-_]+$/.test(data.studentId.trim())) {
    errors.studentId = "Only letters, numbers, hyphens, and underscores allowed";
  }

  if (!data.fullName.trim()) errors.fullName = "Full name is required";
  else if (data.fullName.trim().length < 2) errors.fullName = "Minimum 2 characters";

  if (!data.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address";

  if (!data.phone.trim()) errors.phone = "Phone number is required";
  else if (!/^[+]?[\d\s\-()]{7,20}$/.test(data.phone))
    errors.phone = "Enter a valid phone number";

  if (!data.department) errors.department = "Department is required";

  if (!data.semester) errors.semester = "Semester is required";
  else if (parseInt(data.semester) < 1 || parseInt(data.semester) > 8)
    errors.semester = "Semester must be 1–8";

  return errors;
};

export default function StudentForm({
  initialValues = {},
  onSubmit,
  isLoading = false,
  isEdit = false,
  serverErrors = {},
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [touched, setTouched] = useState({});
  const [clientErrors, setClientErrors] = useState({});

  // Merge client + server errors; server errors take priority
  const errors = { ...clientErrors, ...serverErrors };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setClientErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    // Validate single field on blur
    const fieldErrors = validate(form, isEdit);
    setClientErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark all fields touched
    const allTouched = Object.keys(EMPTY_FORM).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {}
    );
    setTouched(allTouched);

    const validationErrors = validate(form, isEdit);
    setClientErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(form);
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Student ID (create only) */}
        {!isEdit && (
          <div>
            <label htmlFor="studentId" className="form-label">
              Student ID <span className="text-red-500">*</span>
            </label>
            <input
              id="studentId"
              name="studentId"
              type="text"
              placeholder="e.g. STU-2024-001"
              value={form.studentId}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              aria-describedby={showError("studentId") ? "studentId-error" : undefined}
              className={`form-input ${showError("studentId") ? "form-input-error" : ""}`}
            />
            {showError("studentId") && (
              <p id="studentId-error" className="form-error" role="alert">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.studentId}
              </p>
            )}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="form-label">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="e.g. Alice Johnson"
            value={form.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`form-input ${showError("fullName") ? "form-input-error" : ""}`}
          />
          {showError("fullName") && (
            <p className="form-error" role="alert">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="form-label">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="alice@university.edu"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`form-input ${showError("email") ? "form-input-error" : ""}`}
          />
          {showError("email") && (
            <p className="form-error" role="alert">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="form-label">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1-555-0100"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`form-input ${showError("phone") ? "form-input-error" : ""}`}
          />
          {showError("phone") && (
            <p className="form-error" role="alert">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.phone}
            </p>
          )}
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="form-label">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            id="department"
            name="department"
            value={form.department}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`form-input ${showError("department") ? "form-input-error" : ""}`}
          >
            <option value="">Select department…</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {showError("department") && (
            <p className="form-error" role="alert">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.department}
            </p>
          )}
        </div>

        {/* Semester */}
        <div>
          <label htmlFor="semester" className="form-label">
            Semester <span className="text-red-500">*</span>
          </label>
          <select
            id="semester"
            name="semester"
            value={form.semester}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`form-input ${showError("semester") ? "form-input-error" : ""}`}
          >
            <option value="">Select semester…</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
          {showError("semester") && (
            <p className="form-error" role="alert">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.semester}
            </p>
          )}
        </div>

        {/* Address – full width */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="form-label">
            Address <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            placeholder="123 Main Street, City, State ZIP"
            value={form.address}
            onChange={handleChange}
            disabled={isLoading}
            className="form-input resize-none"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary btn-lg min-w-[160px]"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              {isEdit ? "Saving…" : "Creating…"}
            </>
          ) : (
            isEdit ? "Save Changes" : "Create Student"
          )}
        </button>
      </div>
    </form>
  );
}
