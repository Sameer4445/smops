/**
 * useStudents Hook
 * Manages student list state, filters, pagination and CRUD operations
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchStudents, deleteStudent } from "../services/api";

const DEFAULT_FILTERS = {
  search: "",
  studentId: "",
  department: "",
  semester: "",
  sortBy: "createdAt",
  sortOrder: "DESC",
  page: 1,
  limit: 10,
};

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce search to avoid hammering the API on every keystroke
  const searchTimer = useRef(null);

  const loadStudents = useCallback(async (queryFilters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchStudents(queryFilters);
      setStudents(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload when filters change
  useEffect(() => {
    loadStudents(filters);
  }, [filters, loadStudents]);

  /**
   * Update a filter value and reset page to 1
   * Debounces text searches to reduce API calls
   */
  const updateFilter = useCallback((key, value) => {
    const isTextSearch = key === "search" || key === "studentId";

    if (isTextSearch) {
      clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
      }, 400);
    } else {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    }
  }, []);

  /**
   * Change current page
   */
  const changePage = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  /**
   * Reset all filters to defaults
   */
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  /**
   * Delete a student and refresh the list
   */
  const removeStudent = useCallback(
    async (id) => {
      await deleteStudent(id);
      // If deleting the last item on a page > 1, go back one page
      if (students.length === 1 && filters.page > 1) {
        setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
      } else {
        loadStudents(filters);
      }
    },
    [students.length, filters, loadStudents]
  );

  /**
   * Manually refresh without changing filters
   */
  const refresh = useCallback(() => {
    loadStudents(filters);
  }, [filters, loadStudents]);

  return {
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
  };
};
