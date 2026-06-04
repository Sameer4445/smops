/**
 * Request Validation Middleware
 * Validates student data before it reaches the controller
 */

const DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Data Science",
  "Information Technology",
];

/**
 * Validates a student create/update request body
 */
const validateStudent = (req, res, next) => {
  const errors = [];
  const { studentId, fullName, email, phone, department, semester } = req.body;

  // studentId is required on create (POST), optional on update (PUT)
  if (req.method === "POST") {
    if (!studentId || typeof studentId !== "string" || !studentId.trim()) {
      errors.push({ field: "studentId", message: "Student ID is required" });
    } else if (!/^[A-Za-z0-9\-_]+$/.test(studentId.trim())) {
      errors.push({
        field: "studentId",
        message: "Student ID can only contain letters, numbers, hyphens, and underscores",
      });
    }
  }

  // fullName
  if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
    errors.push({ field: "fullName", message: "Full name is required" });
  } else if (fullName.trim().length < 2) {
    errors.push({
      field: "fullName",
      message: "Full name must be at least 2 characters",
    });
  } else if (fullName.trim().length > 100) {
    errors.push({
      field: "fullName",
      message: "Full name must not exceed 100 characters",
    });
  }

  // email
  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push({ field: "email", message: "Please enter a valid email address" });
  }

  // phone
  if (!phone || typeof phone !== "string" || !phone.trim()) {
    errors.push({ field: "phone", message: "Phone number is required" });
  } else if (!/^[+]?[\d\s\-()]{7,20}$/.test(phone.trim())) {
    errors.push({ field: "phone", message: "Please enter a valid phone number" });
  }

  // department
  if (!department || typeof department !== "string" || !department.trim()) {
    errors.push({ field: "department", message: "Department is required" });
  } else if (!DEPARTMENTS.includes(department.trim())) {
    errors.push({
      field: "department",
      message: `Department must be one of: ${DEPARTMENTS.join(", ")}`,
    });
  }

  // semester
  const sem = parseInt(semester, 10);
  if (!semester && semester !== 0) {
    errors.push({ field: "semester", message: "Semester is required" });
  } else if (isNaN(sem) || sem < 1 || sem > 8) {
    errors.push({ field: "semester", message: "Semester must be between 1 and 8" });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Sanitize inputs
  if (req.body.studentId) req.body.studentId = req.body.studentId.trim();
  req.body.fullName = fullName.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone.trim();
  req.body.department = department.trim();
  req.body.semester = sem;
  if (req.body.address) req.body.address = req.body.address.trim();

  next();
};

module.exports = { validateStudent };
