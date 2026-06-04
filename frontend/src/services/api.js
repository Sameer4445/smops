/**
 * API Service Layer
 * Centralised Axios instance with interceptors for request/response handling
 */

import axios from "axios";

// Base URL: in production, the frontend is served from the same origin as the API
// In development, Vite proxies /api/* to localhost:3000
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Could inject auth tokens here in future
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject({ ...error, message });
  }
);

// ─── Student API functions ─────────────────────────────────────────────────────

/**
 * Fetch paginated, filtered students list
 * @param {object} params - Query parameters (search, department, semester, page, limit, sortBy, sortOrder)
 */
export const fetchStudents = (params = {}) =>
  api.get("/students", { params }).then((r) => r.data);

/**
 * Fetch a single student by UUID
 * @param {string} id
 */
export const fetchStudentById = (id) =>
  api.get(`/students/${id}`).then((r) => r.data);

/**
 * Fetch dashboard statistics
 */
export const fetchStats = () =>
  api.get("/students/stats").then((r) => r.data);

/**
 * Create a new student
 * @param {object} data - Student payload
 */
export const createStudent = (data) =>
  api.post("/students", data).then((r) => r.data);

/**
 * Update an existing student
 * @param {string} id
 * @param {object} data
 */
export const updateStudent = (id, data) =>
  api.put(`/students/${id}`, data).then((r) => r.data);

/**
 * Delete a student by UUID
 * @param {string} id
 */
export const deleteStudent = (id) =>
  api.delete(`/students/${id}`).then((r) => r.data);

/**
 * Health check
 */
export const healthCheck = () =>
  axios.get("/health").then((r) => r.data);

export default api;
