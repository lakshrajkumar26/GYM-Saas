'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, UserCheck, Calendar, Dumbbell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

export default function RecentActivities() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['member-recent-activities'],
    queryFn: async () => {
      const response = await axios.get('/dashboard/member/activities');
      return response.data;
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment_received': return CreditCard;
      case 'check_in': return UserCheck;
      case 'plan_expired': return Calendar;
      case 'workout': return Dumbbell;
      default: return UserCheck;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'payment_received': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'check_in': return 'text-primary bg-primary/10';
      case 'plan_expired': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'workout': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-primary bg-primary/10';
    }
  };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2 border-border">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4 p-3">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Activities</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities && activities.length > 0 ? (
            activities.map((activity: any) => {
              const Icon = getIcon(activity.type);
              const colorClass = getColor(activity.type);
              return (
                <div 
                  key={activity.id} 
                  className="activity-item flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activities</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
