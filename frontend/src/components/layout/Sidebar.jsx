/**
 * Sidebar Navigation Component
 */

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  GraduationCap,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    to: "/students",
    icon: Users,
  },
  {
    label: "Add Student",
    to: "/students/add",
    icon: UserPlus,
  },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-slate-100 lg:bg-white">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col border-r border-slate-100 bg-white
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Navigation"
      >
        {/* Close button */}
        <div className="flex items-center justify-end px-4 pt-4">
          <button
            onClick={onClose}
            className="btn-ghost rounded-lg p-1.5"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}

function SidebarContent() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 py-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight">Student</p>
          <p className="text-xs text-slate-500 leading-tight">Management System</p>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-0.5 px-3" role="navigation">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Menu
        </p>
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150
              ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`h-4.5 w-4.5 flex-shrink-0 ${
                    isActive ? "text-primary-600" : "text-slate-400"
                  }`}
                  size={18}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-[11px] text-slate-400">
          v1.0.0 &bull; Production Ready
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Azure DevOps CI/CD Demo
        </p>
      </div>
    </div>
  );
}
