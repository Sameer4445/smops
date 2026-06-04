/**
 * Dashboard Page
 * Shows key statistics, department distribution chart, and recent students
 */

import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useStats } from "../hooks/useStats";
import StatCard from "../components/ui/StatCard";
import { PageLoader } from "../components/ui/Spinner";
import DepartmentBadge from "../components/students/DepartmentBadge";

const PIE_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f97316",
  "#14b8a6", "#10b981", "#3b82f6",
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Dashboard() {
  const { stats, loading, error } = useStats();
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-500 font-medium">Failed to load dashboard: {error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Overview of student records and statistics
          </p>
        </div>
        <button
          onClick={() => navigate("/students/add")}
          className="btn-primary self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          Add Student
        </button>
      </div>

      {/* ── Stats Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents}
          icon={Users}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Departments"
          value={stats?.byDepartment?.length}
          icon={BookOpen}
          color="purple"
          loading={loading}
        />
        <StatCard
          title="Active Semesters"
          value={stats?.bySemester?.length}
          icon={GraduationCap}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Recently Added"
          value={stats?.recentStudents?.length}
          icon={TrendingUp}
          color="orange"
          loading={loading}
          change="Last 5 additions"
        />
      </div>

      {/* ── Charts Row ────────────────────────────────────────── */}
      {loading ? (
        <PageLoader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Bar chart – students per department */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-slate-800">
                Students by Department
              </h2>
              <span className="badge-blue">Bar Chart</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={stats?.byDepartment || []}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(v) => v.split(" ")[0]}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,.08)",
                  }}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar
                  dataKey="count"
                  name="Students"
                  radius={[6, 6, 0, 0]}
                  fill="#6366f1"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart – department share */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-slate-800">Distribution</h2>
              <span className="badge-purple">Pie Chart</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stats?.byDepartment || []}
                  dataKey="count"
                  nameKey="department"
                  cx="50%"
                  cy="45%"
                  outerRadius={80}
                  innerRadius={45}
                >
                  {(stats?.byDepartment || []).map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={PIE_COLORS[idx % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                  formatter={(v, name) => [v, name]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => (
                    <span style={{ fontSize: "10px", color: "#64748b" }}>
                      {v.split(" ")[0]}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Recent Students ───────────────────────────────────── */}
      {!loading && stats?.recentStudents?.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800">Recently Added</h2>
            <button
              onClick={() => navigate("/students")}
              className="btn-ghost btn-sm text-primary-600 hover:text-primary-700"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Student
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    ID
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Department
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Added
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.recentStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar initials */}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-semibold flex-shrink-0">
                          {s.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{s.fullName}</p>
                          <p className="text-xs text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-slate-500">
                      {s.studentId}
                    </td>
                    <td className="py-3 px-3">
                      <DepartmentBadge department={s.department} />
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-xs">
                      {formatDate(s.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
