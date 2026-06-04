/**
 * Student Model
 * All database operations for the students table (async/await, sqlite wrapper)
 */

const { v4: uuidv4 } = require("uuid");
const { getDb } = require("../database/init");

// Whitelist to prevent SQL injection on sort column
const ALLOWED_SORT_COLUMNS = [
  "fullName", "studentId", "department", "semester", "createdAt", "email",
];

/**
 * Fetch students with optional filtering, searching, sorting, and pagination
 */
const findAll = async ({
  search = "",
  studentId = "",
  department = "",
  semester = "",
  sortBy = "createdAt",
  sortOrder = "DESC",
  page = 1,
  limit = 10,
} = {}) => {
  const db = await getDb();

  const safeSortBy    = ALLOWED_SORT_COLUMNS.includes(sortBy) ? sortBy : "createdAt";
  const safeSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const conditions = [];
  const params     = [];

  if (search) {
    conditions.push("(fullName LIKE ? OR email LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (studentId) {
    conditions.push("studentId LIKE ?");
    params.push(`%${studentId}%`);
  }
  if (department) {
    conditions.push("department = ?");
    params.push(department);
  }
  if (semester) {
    conditions.push("semester = ?");
    params.push(parseInt(semester, 10));
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const { total } = await db.get(
    `SELECT COUNT(*) as total FROM students ${whereClause}`,
    params
  );

  const pageNum  = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset   = (pageNum - 1) * limitNum;

  const students = await db.all(
    `SELECT * FROM students ${whereClause}
     ORDER BY ${safeSortBy} ${safeSortOrder}
     LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );

  return {
    data: students,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

/** Find a single student by UUID */
const findById = async (id) => {
  const db = await getDb();
  return db.get("SELECT * FROM students WHERE id = ?", [id]);
};

/** Find by student ID string (e.g. STU-2024-001) */
const findByStudentId = async (studentId) => {
  const db = await getDb();
  return db.get("SELECT * FROM students WHERE studentId = ?", [studentId]);
};

/** Find by email */
const findByEmail = async (email) => {
  const db = await getDb();
  return db.get("SELECT * FROM students WHERE email = ?", [email]);
};

/** Create a new student */
const create = async (data) => {
  const db  = await getDb();
  const id  = uuidv4();
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO students
       (id, studentId, fullName, email, phone, department, semester, address, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.studentId, data.fullName, data.email,
     data.phone, data.department, data.semester,
     data.address || "", now, now]
  );

  return findById(id);
};

/** Update an existing student */
const update = async (id, data) => {
  const db  = await getDb();
  const now = new Date().toISOString();

  const result = await db.run(
    `UPDATE students
     SET fullName=?, email=?, phone=?, department=?, semester=?, address=?, updatedAt=?
     WHERE id=?`,
    [data.fullName, data.email, data.phone,
     data.department, data.semester, data.address || "", now, id]
  );

  if (result.changes === 0) return null;
  return findById(id);
};

/** Delete a student by UUID */
const remove = async (id) => {
  const db      = await getDb();
  const student = await findById(id);
  if (!student) return null;

  await db.run("DELETE FROM students WHERE id = ?", [id]);
  return student;
};

/** Get aggregated statistics for the dashboard */
const getStats = async () => {
  const db = await getDb();

  const { count: totalStudents } = await db.get(
    "SELECT COUNT(*) as count FROM students"
  );

  const byDepartment = await db.all(
    `SELECT department, COUNT(*) as count FROM students
     GROUP BY department ORDER BY count DESC`
  );

  const bySemester = await db.all(
    `SELECT semester, COUNT(*) as count FROM students
     GROUP BY semester ORDER BY semester ASC`
  );

  const recentStudents = await db.all(
    "SELECT * FROM students ORDER BY createdAt DESC LIMIT 5"
  );

  return { totalStudents, byDepartment, bySemester, recentStudents };
};

module.exports = { findAll, findById, findByStudentId, findByEmail, create, update, remove, getStats };
