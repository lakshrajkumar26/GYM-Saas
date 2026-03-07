'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { eventAPI } from '@/lib/api';
import { 
  Plus, 
  Edit, 
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  CalendarDays
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  type: z.string().min(1, 'Type is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.string().optional(),
  location: z.string().optional(),
  maxParticipants: z.string().optional(),
  instructor: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EventsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  // Fetch events
  const { data: events, isLoading } = useQuery({
    queryKey: ['events', filter],
    queryFn: async () => {
      const params = filter === 'upcoming' ? { upcoming: true } : filter === 'past' ? { past: true } : {};
      const response = await eventAPI.getAll(params);
      return response.data;
    },
  });

  // Create event mutation
  const createMutation = useMutation({
    mutationFn: (data: EventFormData) => eventAPI.create({
      ...data,
      duration: data.duration ? parseInt(data.duration) : undefined,
      maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully!');
      setIsCreateOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create event');
    },
  });

  // Update event mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EventFormData }) => 
      eventAPI.update(id, {
        ...data,
        duration: data.duration ? parseInt(data.duration) : undefined,
        maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated successfully!');
      setIsEditOpen(false);
      setSelectedEvent(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update event');
    },
  });

  // Delete event mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully!');
      setIsDeleteOpen(false);
      setSelectedEvent(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    },
  });

  const onCreateSubmit = (data: EventFormData) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: EventFormData) => {
    if (selectedEvent) {
      updateMutation.mutate({ id: selectedEvent.id, data });
    }
  };

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    reset({
      title: event.title,
      description: event.description || '',
      type: event.type,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time,
      duration: event.duration?.toString() || '',
      location: event.location || '',
      maxParticipants: event.maxParticipants?.toString() || '',
      instructor: event.instructor || '',
    });
    setIsEditOpen(true);
  };

  const handleDelete = (event: any) => {
    setSelectedEvent(event);
    setIsDeleteOpen(true);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'CLASS':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'TRAINING':
        return 'bg-primary/10 text-primary';
      case 'WORKSHOP':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'MEETING':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Events Management</h2>
          <p className="text-muted-foreground">Manage gym events, classes, and workshops</p>
        </div>
        <Button 
          onClick={() => {
            reset();
            setIsCreateOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-primary hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10'}
            >
              All Events
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              onClick={() => setFilter('upcoming')}
              className={filter === 'upcoming' ? 'bg-primary hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10'}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === 'past' ? 'default' : 'outline'}
              onClick={() => setFilter('past')}
              className={filter === 'past' ? 'bg-primary hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10'}
            >
              Past
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <Card key={event.id} className="border-border hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    {event.time} {event.duration && `(${event.duration} min)`}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      {event.location}
                    </div>
                  )}
                  {event.instructor && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2 text-primary" />
                      {event.instructor}
                    </div>
                  )}
                  {event.maxParticipants && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2 text-primary" />
                      {event._count?.participants || 0} / {event.maxParticipants} registered
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-end space-x-1 pt-3 border-t border-border">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    onClick={() => handleDelete(event)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'upcoming' ? 'No upcoming events scheduled.' : filter === 'past' ? 'No past events.' : 'Get started by creating your first event.'}
            </p>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Event
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Event Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Add a new event, class, or workshop</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...register('title')} />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register('description')} />
              </div>

              <div>
                <Label htmlFor="type">Type *</Label>
                <select id="type" {...register('type')} className="w-full px-3 py-2 border border-border rounded-md bg-background">
                  <option value="">Select type</option>
                  <option value="CLASS">Class</option>
                  <option value="TRAINING">Training</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="MEETING">Meeting</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
              </div>

              <div>
                <Label htmlFor="instructor">Instructor</Label>
                <Input id="instructor" {...register('instructor')} />
              </div>

              <div>
                <Label htmlFor="date">Date *</Label>
                <Input id="date" type="date" {...register('date')} />
                {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
              </div>

              <div>
                <Label htmlFor="time">Time *</Label>
                <Input id="time" type="time" {...register('time')} />
                {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>}
              </div>

              <div className="col-span-2">
                <Label>Duration</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="durationHours" className="text-xs text-muted-foreground">Hours</Label>
                    <select 
                      id="durationHours" 
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      onChange={(e) => {
                        const hours = parseInt(e.target.value) || 0;
                        const minutes = parseInt((document.getElementById('durationMinutes') as HTMLSelectElement)?.value) || 0;
                        const totalMinutes = (hours * 60) + minutes;
                        (document.getElementById('duration') as HTMLInputElement).value = totalMinutes.toString();
                      }}
                    >
                      <option value="0">0 hours</option>
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                      <option value="4">4 hours</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="durationMinutes" className="text-xs text-muted-foreground">Minutes</Label>
                    <select 
                      id="durationMinutes" 
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      onChange={(e) => {
                        const hours = parseInt((document.getElementById('durationHours') as HTMLSelectElement)?.value) || 0;
                        const minutes = parseInt(e.target.value) || 0;
                        const totalMinutes = (hours * 60) + minutes;
                        (document.getElementById('duration') as HTMLInputElement).value = totalMinutes.toString();
                      }}
                    >
                      <option value="0">0 min</option>
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                    </select>
                  </div>
                </div>
                <Input id="duration" type="hidden" {...register('duration')} />
              </div>

              <div>
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input id="maxParticipants" type="number" {...register('maxParticipants')} />
              </div>

              <div className="col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location')} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update event details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input id="edit-title" {...register('title')} />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
              </div>

              <div className="col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input id="edit-description" {...register('description')} />
              </div>

              <div>
                <Label htmlFor="edit-type">Type *</Label>
                <select id="edit-type" {...register('type')} className="w-full px-3 py-2 border border-border rounded-md bg-background">
                  <option value="CLASS">Class</option>
                  <option value="TRAINING">Training</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="MEETING">Meeting</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
              </div>

              <div>
                <Label htmlFor="edit-instructor">Instructor</Label>
                <Input id="edit-instructor" {...register('instructor')} />
              </div>

              <div>
                <Label htmlFor="edit-date">Date *</Label>
                <Input id="edit-date" type="date" {...register('date')} />
                {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
              </div>

              <div>
                <Label htmlFor="edit-time">Time *</Label>
                <Input id="edit-time" type="time" {...register('time')} />
                {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>}
              </div>

              <div className="col-span-2">
                <Label>Duration</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="edit-durationHours" className="text-xs text-muted-foreground">Hours</Label>
                    <select 
                      id="edit-durationHours" 
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      onChange={(e) => {
                        const hours = parseInt(e.target.value) || 0;
                        const minutes = parseInt((document.getElementById('edit-durationMinutes') as HTMLSelectElement)?.value) || 0;
                        const totalMinutes = (hours * 60) + minutes;
                        (document.getElementById('edit-duration') as HTMLInputElement).value = totalMinutes.toString();
                      }}
                    >
                      <option value="0">0 hours</option>
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                      <option value="4">4 hours</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="edit-durationMinutes" className="text-xs text-muted-foreground">Minutes</Label>
                    <select 
                      id="edit-durationMinutes" 
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      onChange={(e) => {
                        const hours = parseInt((document.getElementById('edit-durationHours') as HTMLSelectElement)?.value) || 0;
                        const minutes = parseInt(e.target.value) || 0;
                        const totalMinutes = (hours * 60) + minutes;
                        (document.getElementById('edit-duration') as HTMLInputElement).value = totalMinutes.toString();
                      }}
                    >
                      <option value="0">0 min</option>
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                    </select>
                  </div>
                </div>
                <Input id="edit-duration" type="hidden" {...register('duration')} />
              </div>

              <div>
                <Label htmlFor="edit-maxParticipants">Max Participants</Label>
                <Input id="edit-maxParticipants" type="number" {...register('maxParticipants')} />
              </div>

              <div className="col-span-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input id="edit-location" {...register('location')} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update Event'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedEvent && deleteMutation.mutate(selectedEvent.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
