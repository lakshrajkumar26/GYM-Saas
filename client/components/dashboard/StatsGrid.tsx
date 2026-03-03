'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Activity, Target, Award } from 'lucide-react';

const memberStats = [
  {
    title: 'Days Active',
    value: '45',
    change: '+5 this month',
    trend: 'up',
    icon: Calendar,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    title: 'Workouts Completed',
    value: '28',
    change: '+8 this week',
    trend: 'up',
    icon: Activity,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    title: 'Current Streak',
    value: '7 days',
    change: 'Keep it up!',
    trend: 'up',
    icon: Target,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    title: 'Plan Status',
    value: 'Premium',
    change: 'Expires in 15 days',
    trend: 'neutral',
    icon: Award,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  }
];

export default function StatsGrid() {
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
