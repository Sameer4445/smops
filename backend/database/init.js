/**
 * Database Initialization
 * Creates SQLite database, tables, and seeds demo data
 * Uses the 'sqlite' promise wrapper around 'sqlite3'
 */

const sqlite3 = require("sqlite3");
const { open }  = require("sqlite");
const path = require("path");
const fs   = require("fs");
const logger = require("../middleware/logger");

const DB_DIR  = path.join(__dirname, "data");
const DB_PATH = path.join(DB_DIR, "students.db");

let dbInstance = null;

/**
 * Returns a singleton database connection (opens on first call)
 */
const getDb = async () => {
  if (dbInstance) return dbInstance;

  // Ensure data directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  dbInstance = await open({
    filename: DB_PATH,
    driver:   sqlite3.Database,
  });

  // Enable WAL mode and foreign keys
  await dbInstance.exec("PRAGMA journal_mode = WAL;");
  await dbInstance.exec("PRAGMA foreign_keys = ON;");

  return dbInstance;
};

/**
 * Creates the students table if it does not exist
 */
const createTables = async (db) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id          TEXT PRIMARY KEY,
      studentId   TEXT UNIQUE NOT NULL,
      fullName    TEXT NOT NULL,
      email       TEXT UNIQUE NOT NULL,
      phone       TEXT NOT NULL,
      department  TEXT NOT NULL,
      semester    INTEGER NOT NULL CHECK(semester BETWEEN 1 AND 8),
      address     TEXT DEFAULT '',
      createdAt   TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_students_studentId   ON students(studentId);
    CREATE INDEX IF NOT EXISTS idx_students_department  ON students(department);
    CREATE INDEX IF NOT EXISTS idx_students_semester    ON students(semester);
    CREATE INDEX IF NOT EXISTS idx_students_fullName    ON students(fullName);
  `);
  logger.info("📋 Tables created / verified");
};

/**
 * Seeds the database with demo students if the table is empty
 */
const seedData = async (db) => {
  const row = await db.get("SELECT COUNT(*) as cnt FROM students");

  if (row.cnt > 0) {
    logger.info(`📦 Database already has ${row.cnt} students – skipping seed`);
    return;
  }

  const demoStudents = [
    {
      id: "uuid-001", studentId: "STU-2024-001", fullName: "Alice Johnson",
      email: "alice.johnson@university.edu", phone: "+1-555-0101",
      department: "Computer Science", semester: 6,
      address: "123 Maple Street, Boston, MA 02101",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "uuid-002", studentId: "STU-2024-002", fullName: "Bob Martinez",
      email: "bob.martinez@university.edu", phone: "+1-555-0102",
      department: "Electrical Engineering", semester: 4,
      address: "456 Oak Avenue, Cambridge, MA 02139",
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
      id: "uuid-003", studentId: "STU-2024-003", fullName: "Carol White",
      email: "carol.white@university.edu", phone: "+1-555-0103",
      department: "Data Science", semester: 7,
      address: "789 Pine Road, Somerville, MA 02143",
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    },
    {
      id: "uuid-004", studentId: "STU-2024-004", fullName: "David Lee",
      email: "david.lee@university.edu", phone: "+1-555-0104",
      department: "Mechanical Engineering", semester: 3,
      address: "321 Elm Court, Medford, MA 02155",
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    },
    {
      id: "uuid-005", studentId: "STU-2024-005", fullName: "Emma Davis",
      email: "emma.davis@university.edu", phone: "+1-555-0105",
      department: "Business Administration", semester: 5,
      address: "654 Birch Lane, Waltham, MA 02451",
      createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    },
    {
      id: "uuid-006", studentId: "STU-2024-006", fullName: "Frank Wilson",
      email: "frank.wilson@university.edu", phone: "+1-555-0106",
      department: "Information Technology", semester: 2,
      address: "987 Cedar Blvd, Newton, MA 02458",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "uuid-007", studentId: "STU-2024-007", fullName: "Grace Kim",
      email: "grace.kim@university.edu", phone: "+1-555-0107",
      department: "Computer Science", semester: 8,
      address: "147 Willow Way, Brookline, MA 02445",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: "uuid-008", studentId: "STU-2024-008", fullName: "Henry Brown",
      email: "henry.brown@university.edu", phone: "+1-555-0108",
      department: "Civil Engineering", semester: 6,
      address: "258 Spruce Ave, Quincy, MA 02169",
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: "uuid-009", studentId: "STU-2024-009", fullName: "Isla Thompson",
      email: "isla.thompson@university.edu", phone: "+1-555-0109",
      department: "Data Science", semester: 4,
      address: "369 Poplar Street, Malden, MA 02148",
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    },
    {
      id: "uuid-010", studentId: "STU-2024-010", fullName: "James Garcia",
      email: "james.garcia@university.edu", phone: "+1-555-0110",
      department: "Computer Science", semester: 1,
      address: "741 Ash Drive, Everett, MA 02149",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "uuid-011", studentId: "STU-2024-011", fullName: "Karen Anderson",
      email: "karen.anderson@university.edu", phone: "+1-555-0111",
      department: "Electrical Engineering", semester: 5,
      address: "852 Magnolia Ct, Chelsea, MA 02150",
      createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    },
    {
      id: "uuid-012", studentId: "STU-2024-012", fullName: "Liam Jackson",
      email: "liam.jackson@university.edu", phone: "+1-555-0112",
      department: "Business Administration", semester: 3,
      address: "963 Chestnut St, Revere, MA 02151",
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
  ];

  const stmt = `
    INSERT INTO students
      (id, studentId, fullName, email, phone, department, semester, address, createdAt, updatedAt)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const s of demoStudents) {
    await db.run(stmt, [
      s.id, s.studentId, s.fullName, s.email,
      s.phone, s.department, s.semester, s.address,
      s.createdAt, s.createdAt,
    ]);
  }

  logger.info(`🌱 Seeded ${demoStudents.length} demo students`);
};

/**
 * Main init function – called once at startup
 */
const initDatabase = async () => {
  const db = await getDb();
  await createTables(db);
  await seedData(db);
};

module.exports = { initDatabase, getDb };
