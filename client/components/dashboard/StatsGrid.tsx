'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Activity, Target, Award } from 'lucide-react';
import { dashboardAPI } from '@/lib/api';

export default function StatsGrid() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['memberStats'],
    queryFn: async () => {
      const response = await dashboardAPI.getMemberStats();
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const memberStats = [
    {
      title: 'Days Active',
      value: stats?.daysActive || '0',
      change: `Since ${new Date(stats?.member?.startDate).toLocaleDateString()}`,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Total Check-ins',
      value: stats?.totalAttendance || '0',
      change: `+${stats?.monthlyAttendance || 0} this month`,
      icon: Activity,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Current Streak',
      value: `${stats?.currentStreak || 0} days`,
      change: stats?.currentStreak > 0 ? 'Keep it up!' : 'Start your streak!',
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Plan Status',
      value: stats?.plan?.name || 'No Plan',
      change: stats?.plan?.daysUntilExpiry > 0 
        ? `Expires in ${stats.plan.daysUntilExpiry} days`
        : 'Expired',
      icon: Award,
      color: stats?.plan?.daysUntilExpiry > 0 ? 'text-primary' : 'text-red-500',
      bgColor: stats?.plan?.daysUntilExpiry > 0 ? 'bg-primary/10' : 'bg-red-100 dark:bg-red-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {memberStats.map((stat, index) => (
        <Card 
          key={index} 
          className="stat-card hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border-border hover:border-primary/50"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor} ring-2 ring-primary/20`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
