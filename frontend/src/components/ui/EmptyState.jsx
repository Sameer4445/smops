/**
 * Empty State Component
 * Shown when a list has no results
 */

import { Users } from "lucide-react";

export default function EmptyState({
  icon: Icon = Users,
  title = "No results found",
  description = "Try adjusting your search or filters.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
