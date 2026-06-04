/**
 * Toast Notification System
 * Context + provider + hook for app-wide toast messages
 */

import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />,
  error:   <XCircle      className="h-5 w-5 text-red-500   flex-shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />,
  info:    <Info          className="h-5 w-5 text-blue-500  flex-shrink-0" />,
};

const COLORS = {
  success: "border-green-200 bg-green-50",
  error:   "border-red-200   bg-red-50",
  warning: "border-amber-200 bg-amber-50",
  info:    "border-blue-200  bg-blue-50",
};

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}

      {/* Toast container */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-modal
              animate-slide-up ${COLORS[toast.type]}`}
          >
            {ICONS[toast.type]}
            <p className="flex-1 text-sm font-medium text-slate-800">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto -mr-1 -mt-0.5 rounded p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Hook to trigger toast notifications from any component
 * @returns {function} toast(message, type, duration?)
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
};
