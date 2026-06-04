/**
 * Department Badge
 * Color-coded badge for each department
 */

const DEPARTMENT_COLORS = {
  "Computer Science":        "badge-blue",
  "Electrical Engineering":  "badge-orange",
  "Mechanical Engineering":  "badge-teal",
  "Civil Engineering":       "badge-green",
  "Business Administration": "badge-purple",
  "Data Science":            "badge-pink",
  "Information Technology":  "badge-gray",
};

export default function DepartmentBadge({ department }) {
  const colorClass = DEPARTMENT_COLORS[department] || "badge-gray";
  return (
    <span className={colorClass}>
      {department}
    </span>
  );
}
