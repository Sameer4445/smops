/**
 * Students List Page
 * Responsive data table with search, filters, sort, pagination, and CRUD actions
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Filter,
  UserPlus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  RefreshCw,
  X,
} from "lucide-react";

import { useStudents } from "../hooks/useStudents";
import { useToast } from "../components/ui/ToastProvider";
import Spinner from "../components/ui/Spinner";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import DepartmentBadge from "../components/students/DepartmentBadge";
import DeleteConfirmModal from "../components/students/DeleteConfirmModal";

const DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Data Science",
  "Information Technology",
];

function SortIcon({ field, currentSort, currentOrder }) {
  if (currentSort !== field)
    return <ChevronsUpDown className="h-3.5 w-3.5 text-slate-300" />;
  return currentOrder === "ASC" ? (
    <ChevronUp className="h-3.5 w-3.5 text-primary-500" />
  ) : (
    <ChevronDown className="h-3.5 w-3.5 text-primary-500" />
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Students() {
  const navigate = useNavigate();
  const toast = useToast();

  const {
    students,
    pagination,
    filters,
    loading,
    error,
    updateFilter,
    changePage,
    resetFilters,
    removeStudent,
    refresh,
  } = useStudents();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Local state for controlled inputs (debounced via hook)
  const [searchInput, setSearchInput] = useState("");
  const [idInput, setIdInput] = useState("");

  const handleSort = (field) => {
    if (filters.sortBy === field) {
      updateFilter("sortOrder", filters.sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      updateFilter("sortBy", field);
      updateFilter("sortOrder", "ASC");
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await removeStudent(id);
      toast("Student deleted successfully", "success");
      setDeleteTarget(null);
    } catch (err) {
      toast(err.message || "Failed to delete student", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setIdInput("");
    resetFilters();
  };

  const hasActiveFilters =
    filters.search ||
    filters.studentId ||
    filters.department ||
    filters.semester;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Students</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {pagination
              ? `${pagination.total} student${pagination.total !== 1 ? "s" : ""} total`
              : "Manage student records"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="btn-secondary btn-sm"
            aria-label="Refresh"
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link to="/students/add" className="btn-primary">
            <UserPlus className="h-4 w-4" />
            Add Student
          </Link>
        </div>
      </div>

      {/* ── Search & Filter Bar ────────────────────────────────── */}
      <div className="card !p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search by name / email */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                updateFilter("search", e.target.value);
              }}
              className="form-input pl-9"
              aria-label="Search students"
            />
          </div>

          {/* Search by student ID */}
          <div className="relative sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID…"
              value={idInput}
              onChange={(e) => {
                setIdInput(e.target.value);
                updateFilter("studentId", e.target.value);
              }}
              className="form-input pl-9"
              aria-label="Search by student ID"
            />
          </div>

          {/* Toggle filters */}
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`btn btn-sm flex-shrink-0 ${
              showFilters || hasActiveFilters ? "btn-primary" : "btn-secondary"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-primary-700 text-[10px] font-bold">
                {[filters.department, filters.semester].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Expandable filter row */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 pt-1 border-t border-slate-100 animate-fade-in">
            {/* Department filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500 whitespace-nowrap">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => updateFilter("department", e.target.value)}
                className="form-input py-1.5 text-sm"
              >
                <option value="">All departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500">Semester</label>
              <select
                value={filters.semester}
                onChange={(e) => updateFilter("semester", e.target.value)}
                className="form-input py-1.5 text-sm"
              >
                <option value="">All semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Results per page */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500 whitespace-nowrap">
                Per page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => updateFilter("limit", e.target.value)}
                className="form-input py-1.5 text-sm"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="btn-ghost btn-sm text-slate-500"
              >
                <X className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Error Banner ──────────────────────────────────────── */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={refresh} className="btn-ghost btn-sm text-red-600">
            Retry
          </button>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────── */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[750px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {[
                  { label: "Student", field: "fullName" },
                  { label: "Student ID", field: "studentId" },
                  { label: "Department", field: "department" },
                  { label: "Semester", field: "semester" },
                  { label: "Phone", field: null },
                  { label: "Added", field: "createdAt" },
                  { label: "Actions", field: null },
                ].map(({ label, field }) => (
                  <th
                    key={label}
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500
                      ${field ? "cursor-pointer hover:text-slate-800 select-none" : ""}`}
                    onClick={() => field && handleSort(field)}
                  >
                    <div className="flex items-center gap-1.5">
                      {label}
                      {field && (
                        <SortIcon
                          field={field}
                          currentSort={filters.sortBy}
                          currentOrder={filters.sortOrder}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Spinner />
                      <p className="text-sm text-slate-400">Loading students…</p>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      title={
                        hasActiveFilters
                          ? "No matching students"
                          : "No students yet"
                      }
                      description={
                        hasActiveFilters
                          ? "Try different search terms or filters."
                          : "Add your first student to get started."
                      }
                      action={
                        hasActiveFilters ? (
                          <button
                            onClick={handleResetFilters}
                            className="btn-secondary btn-sm"
                          >
                            Clear filters
                          </button>
                        ) : (
                          <Link to="/students/add" className="btn-primary btn-sm">
                            <UserPlus className="h-3.5 w-3.5" />
                            Add Student
                          </Link>
                        )
                      }
                    />
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Student name + email */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-semibold flex-shrink-0">
                          {student.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate max-w-[180px]">
                            {student.fullName}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-[180px]">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Student ID */}
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-500">
                      {student.studentId}
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3.5">
                      <DepartmentBadge department={student.department} />
                    </td>

                    {/* Semester */}
                    <td className="px-4 py-3.5 text-slate-600">
                      Semester {student.semester}
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                      {student.phone}
                    </td>

                    {/* Created at */}
                    <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                      {formatDate(student.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            navigate(`/students/${student.id}/edit`)
                          }
                          className="btn-ghost btn-sm text-slate-500 hover:text-primary-600 rounded-lg p-1.5"
                          aria-label={`Edit ${student.fullName}`}
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(student)}
                          className="btn-ghost btn-sm text-slate-500 hover:text-red-600 rounded-lg p-1.5"
                          aria-label={`Delete ${student.fullName}`}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="border-t border-slate-100 px-4 py-3">
            <Pagination pagination={pagination} onPageChange={changePage} />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        student={deleteTarget}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        isLoading={deleting}
      />
    </div>
  );
}
