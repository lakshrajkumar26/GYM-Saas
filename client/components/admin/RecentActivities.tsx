'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CreditCard, UserCheck, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

export default function RecentActivities() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const response = await axios.get('/dashboard/activities');
      return response.data;
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'member_joined': return Users;
      case 'payment_received': return CreditCard;
      case 'check_in': return UserCheck;
      case 'plan_expired': return Calendar;
      default: return Users;
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
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities && activities.length > 0 ? (
            activities.slice(0, 5).map((activity: any) => {
              const Icon = getIcon(activity.type);
              return (
                <div 
                  key={activity.id} 
                  className="activity-item flex items-center space-x-4 p-3 rounded-lg hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
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
