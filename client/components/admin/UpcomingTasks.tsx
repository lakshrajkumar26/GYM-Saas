'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { eventAPI } from '@/lib/api';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UpcomingTasks() {
  const router = useRouter();

  const { data: events, isLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const response = await eventAPI.getUpcoming(5);
      return response.data;
    },
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'CLASS':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
      case 'TRAINING':
        return 'bg-primary/10 text-primary border border-primary/20';
      case 'WORKSHOP':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-200 dark:border-purple-800';
      case 'MEETING':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg bg-muted animate-pulse h-20" />
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event: any) => (
              <div 
                key={event.id} 
                className="task-item p-3 rounded-lg border border-border hover:shadow-sm hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-foreground pr-2">{event.title}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {event.time}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {event.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-3">No upcoming events</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/admin/events')}
              className="border-primary text-primary hover:bg-primary/10"
            >
              Create Event
            </Button>
          </div>
        )}
        <Button 
          variant="outline" 
          className="w-full mt-4 border-primary text-primary hover:bg-primary/10"
          onClick={() => router.push('/admin/events')}
        >
          View All Events
        </Button>
      </CardContent>
    </Card>
  );
}
