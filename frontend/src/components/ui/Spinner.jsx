/**
 * Spinner / Loading indicator component
 */

export default function Spinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full border-slate-200 border-t-primary-600 animate-spin ${sizes[size]} ${className}`}
    />
  );
}

/**
 * Full-page loading overlay
 */
export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-slate-500">Loading…</p>
    </div>
  );
}
