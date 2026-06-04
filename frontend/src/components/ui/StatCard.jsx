/**
 * Statistics Card Component
 * Used on the Dashboard to display key metrics
 */

import Spinner from "./Spinner";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  loading = false,
  change,
}) {
  const colorMap = {
    blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   text: "text-blue-600" },
    green:  { bg: "bg-green-50",  icon: "text-green-600",  text: "text-green-600" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", text: "text-purple-600" },
    orange: { bg: "bg-orange-50", icon: "text-orange-600", text: "text-orange-600" },
    pink:   { bg: "bg-pink-50",   icon: "text-pink-600",   text: "text-pink-600" },
    teal:   { bg: "bg-teal-50",   icon: "text-teal-600",   text: "text-teal-600" },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="card group hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1.5">
            {title}
          </p>
          {loading ? (
            <Spinner size="sm" className="mt-1" />
          ) : (
            <p className="text-3xl font-bold text-slate-900">{value ?? "—"}</p>
          )}
          {change && !loading && (
            <p className={`mt-1 text-xs font-medium ${c.text}`}>{change}</p>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${c.icon}`} />
        </div>
      </div>
    </div>
  );
}
