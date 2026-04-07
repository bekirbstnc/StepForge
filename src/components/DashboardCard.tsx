import React from "react";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  color: string;
}

export function DashboardCard({ title, value, description, icon: Icon, trend, color }: DashboardCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:bg-slate-800/80">
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-2xl ${color}`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ring-1 ring-white/10 ${color.replace('bg-', 'text-')}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-500">{description}</p>
        {trend && (
          <span className={`text-xs font-medium ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
