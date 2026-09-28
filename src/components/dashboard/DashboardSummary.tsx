// src/components/DashboardSummary.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, TrendingUp, UserLock } from 'lucide-react';

interface SummaryData {
  totalWorkforce: number;
  activeStaff: number;
  onboardingCount: number;
}

export const DashboardSummary: React.FC<SummaryData> = ({
  totalWorkforce,
  activeStaff,
  onboardingCount,
}) => {
  const stats = [
    {
      title: 'Total Workforce',
      value: totalWorkforce,
      subtitle: 'Live System Count',
      badge: '+12% from last month',
      icon: Users,
      iconBg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    },
    {
      title: 'Active Staff',
      value: activeStaff,
      subtitle: 'Currently Working',
      badge: '98% operational rate',
      icon: UserCheck,
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      title: 'Onboarding / Leave',
      value: onboardingCount,
      subtitle: 'Pending / Away',
      badge: '3 reviews required',
      icon: UserLock,
      iconBg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={idx} className="border-slate-200/80 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.title}
                </span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                  {stat.value}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{stat.subtitle}</span>
                <span>• {stat.badge}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardSummary;