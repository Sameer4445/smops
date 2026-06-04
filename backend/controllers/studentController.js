/**
 * Student Controller
 * Handles request/response logic for all student endpoints (async/await)
 */

const studentModel = require("../models/studentModel");
const logger = require("../middleware/logger");

// ─── GET /api/students ─────────────────────────────────────────────────────────

const getAllStudents = async (req, res, next) => {
  try {
    const {
      search, studentId, department, semester,
      sortBy, sortOrder, page = 1, limit = 10,
    } = req.query;

    const result = await studentModel.findAll({
      search, studentId, department, semester,
      sortBy, sortOrder, page, limit,
    });

    logger.info(`Fetched ${result.data.length} students (total: ${result.pagination.total})`);

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/students/stats ───────────────────────────────────────────────────

const getStats = async (req, res, next) => {
  try {
    const stats = await studentModel.getStats();
    res.status(200).json({
      success: true,
      message: "Statistics fetched successfully",
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/students/:id ─────────────────────────────────────────────────────

const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await studentModel.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID "${id}" not found`,
      });
    }

    logger.info(`Fetched student: ${student.fullName} (${id})`);
    res.status(200).json({ success: true, message: "Student fetched successfully", data: student });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/students ────────────────────────────────────────────────────────

const createStudent = async (req, res, next) => {
  try {
    const { studentId, fullName, email, phone, department, semester, address } = req.body;

    // Duplicate studentId check
    const existingByStudentId = await studentModel.findByStudentId(studentId);
    if (existingByStudentId) {
      return res.status(409).json({
        success: false,
        message: `Student ID "${studentId}" is already in use`,
        field: "studentId",
      });
    }

    // Duplicate email check
    const existingByEmail = await studentModel.findByEmail(email);
    if (existingByEmail) {
      return res.status(409).json({
        success: false,
        message: `Email "${email}" is already registered`,
        field: "email",
      });
    }

    const newStudent = await studentModel.create({
      studentId, fullName, email, phone, department,
      semester: parseInt(semester, 10), address,
    });

    logger.info(`Created new student: ${fullName} (${studentId})`);
    res.status(201).json({ success: true, message: "Student created successfully", data: newStudent });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/students/:id ─────────────────────────────────────────────────────

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, department, semester, address } = req.body;

    const existing = await studentModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: `Student with ID "${id}" not found` });
    }

    // Email uniqueness check (exclude self)
    const emailOwner = await studentModel.findByEmail(email);
    if (emailOwner && emailOwner.id !== id) {
      return res.status(409).json({
        success: false,
        message: `Email "${email}" is already registered by another student`,
        field: "email",
      });
    }

    const updated = await studentModel.update(id, {
      fullName, email, phone, department,
      semester: parseInt(semester, 10), address,
    });

    logger.info(`Updated student: ${updated.fullName} (${id})`);
    res.status(200).json({ success: true, message: "Student updated successfully", data: updated });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/students/:id ──────────────────────────────────────────────────

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await studentModel.remove(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: `Student with ID "${id}" not found` });
    }

    logger.info(`Deleted student: ${deleted.fullName} (${id})`);
    res.status(200).json({ success: true, message: "Student deleted successfully", data: deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllStudents, getStudentById, getStats, createStudent, updateStudent, deleteStudent };
