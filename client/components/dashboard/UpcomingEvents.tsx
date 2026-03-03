'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const upcomingEvents = [
  {
    id: 1,
    title: 'Personal Training Session',
    date: 'Today, 6:00 PM',
    type: 'training',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Group Yoga Class',
    date: 'Tomorrow, 7:00 AM',
    type: 'class',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Membership Renewal',
    date: 'In 15 days',
    type: 'payment',
    priority: 'high'
  }
];

export default function UpcomingEvents() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div 
              key={event.id} 
              className="event-item p-3 rounded-lg border border-border hover:shadow-sm hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-foreground pr-2">{event.title}</p>
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.priority === 'high' 
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : event.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800'
                  }`}
                >
                  {event.priority}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{event.date}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
          View Calendar
        </Button>
      </CardContent>
    </Card>
  );
}
