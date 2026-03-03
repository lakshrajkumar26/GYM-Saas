'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, DollarSign, UserCheck, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { dashboardAPI } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function AdminStatsGrid() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await dashboardAPI.getAdminStats();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total Members',
      value: stats?.totalMembers || 0,
      change: stats?.memberGrowth || '+0%',
      trend: 'up',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Active Members',
      value: stats?.activeMembers || 0,
      change: stats?.activeGrowth || '+0%',
      trend: 'up',
      icon: UserCheck,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${stats?.monthlyRevenue?.toLocaleString() || 0}`,
      change: stats?.revenueGrowth || '+0%',
      trend: stats?.revenueGrowth?.startsWith('+') ? 'up' : 'down',
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: "Today's Check-ins",
      value: stats?.todayCheckIns || 0,
      change: stats?.checkInChange || '0%',
      trend: stats?.checkInChange?.startsWith('+') ? 'up' : 'down',
      icon: Clock,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
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
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-primary mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-primary mr-1" />
                  )}
                  <span className="text-sm font-medium text-primary">
                    {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">vs last month</span>
                </div>
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
