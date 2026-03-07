'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { eventAPI } from '@/lib/api';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function UpcomingEvents() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['upcoming-events-member'],
    queryFn: async () => {
      const response = await eventAPI.getUpcoming(5);
      return response.data;
    },
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'CLASS': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200';
      case 'TRAINING': return 'bg-primary/10 text-primary border-primary/20';
      case 'WORKSHOP': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200';
      case 'MEETING': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-3 rounded-lg border border-border">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events && events.length > 0 ? (
            events.map((event: any) => (
              <div 
                key={event.id} 
                className="event-item p-3 rounded-lg border border-border hover:shadow-sm hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-foreground pr-2">{event.title}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {event.time}
                    {event.duration && ` (${Math.floor(event.duration / 60)}h ${event.duration % 60}m)`}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {event.location}
                    </div>
                  )}
                  {event._count?.participants !== undefined && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="w-3 h-3 mr-1" />
                      {event._count.participants} registered
                      {event.maxParticipants && ` / ${event.maxParticipants}`}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No upcoming events</p>
            </div>
          )}
        </div>
        {events && events.length > 0 && (
          <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
            View All Events
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
