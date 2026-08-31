import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between min-w-0">
      <div className="space-y-1 min-w-0 pr-2">
        <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase truncate block">
          {title}
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-slate-800 font-bold truncate">
          {value}
        </h3>
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div className={`p-3 sm:p-3.5 rounded-2xl border shrink-0 ${colorMap[color] || colorMap.blue}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      )}
    </div>
  );
}
