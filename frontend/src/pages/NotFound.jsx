/**
 * 404 Not Found Page
 */

import { Link } from "react-router-dom";
import { GraduationCap, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center animate-fade-in">
      <div className="text-center max-w-lg px-4">
        {/* Illustration */}
        <div className="relative mb-8 inline-flex">
          <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-primary-50">
            <GraduationCap className="h-16 w-16 text-primary-300" />
          </div>
          <div className="absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 border-4 border-white shadow-card">
            <span className="text-2xl font-black text-red-400">?</span>
          </div>
        </div>

        {/* Copy */}
        <h1 className="text-6xl font-black text-slate-900 mb-3 gradient-text">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Head
          back to the dashboard and continue managing students.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard" className="btn-primary btn-lg">
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary btn-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-8 flex items-center justify-center gap-4 text-sm text-slate-400">
          <Link to="/students" className="hover:text-primary-600 transition-colors">
            Students
          </Link>
          <span aria-hidden>·</span>
          <Link to="/students/add" className="hover:text-primary-600 transition-colors">
            Add Student
          </Link>
        </div>
      </div>
    </div>
  );
}
