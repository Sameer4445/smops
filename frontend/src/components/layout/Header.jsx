/**
 * Top Header / Topbar Component
 */

import { Menu, Bell, GraduationCap } from "lucide-react";
import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/students": "Students",
  "/students/add": "Add Student",
};

function resolveTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.includes("/edit")) return "Edit Student";
  return "Student Management";
}

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = resolveTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b border-slate-100 bg-white/95 px-4 backdrop-blur-sm sm:px-6">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="btn-ghost -ml-1 rounded-lg p-2 lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile brand (visible only when sidebar is closed) */}
      <div className="flex items-center gap-2 ml-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-slate-800">SMS</span>
      </div>

      {/* Page title */}
      <h1 className="hidden lg:block text-lg font-semibold text-slate-800">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-2">
        {/* Notification bell (decorative for demo) */}
        <button className="btn-ghost relative rounded-full p-2" aria-label="Notifications">
          <Bell className="h-5 w-5 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white" />
        </button>

        {/* Avatar */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-semibold"
          aria-label="Profile"
        >
          AD
        </button>
      </div>
    </header>
  );
}
