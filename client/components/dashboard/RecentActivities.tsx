'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, CheckCircle, CreditCard, Target } from 'lucide-react';

const recentActivities = [
  {
    id: 1,
    type: 'workout',
    message: 'Completed Upper Body Workout',
    time: '2 hours ago',
    icon: Dumbbell,
    color: 'text-primary'
  },
  {
    id: 2,
    type: 'checkin',
    message: 'Checked in to gym',
    time: '2 hours ago',
    icon: CheckCircle,
    color: 'text-primary'
  },
  {
    id: 3,
    type: 'payment',
    message: 'Monthly payment processed',
    time: '2 days ago',
    icon: CreditCard,
    color: 'text-primary'
  },
  {
    id: 4,
    type: 'goal',
    message: 'Achieved weekly workout goal',
    time: '3 days ago',
    icon: Target,
    color: 'text-primary'
  }
];

export default function RecentActivities() {
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
          {recentActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="activity-item flex items-center space-x-4 p-3 rounded-lg hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all"
            >
              <div className={`p-2 rounded-full bg-primary/10 ${activity.color}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
