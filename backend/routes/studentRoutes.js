/**
 * Student Routes
 * Defines all REST endpoints for the /api/students resource
 */

const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  getStats,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { validateStudent } = require("../middleware/validation");

// GET /api/students/stats – must be before /:id to avoid "stats" being treated as an id
router.get("/stats", getStats);

// GET    /api/students         – list all with filters/search/pagination
router.get("/", getAllStudents);

// GET    /api/students/:id     – get one student
router.get("/:id", getStudentById);

// POST   /api/students         – create a student
router.post("/", validateStudent, createStudent);

// PUT    /api/students/:id     – update a student
router.put("/:id", validateStudent, updateStudent);

// DELETE /api/students/:id     – delete a student
router.delete("/:id", deleteStudent);

module.exports = router;
