'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  Clock,
  Target,
  Award,
  Activity,
  CheckCircle,
  AlertTriangle,
  User,
  Dumbbell
} from 'lucide-react';

// Mock data - replace with real API calls
const memberStats = [
  {
    title: 'Days Active',
    value: '45',
    change: '+5 this month',
    trend: 'up',
    icon: Calendar,
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Workouts Completed',
    value: '28',
    change: '+8 this week',
    trend: 'up',
    icon: Activity,
    color: 'text-green-600 dark:text-green-400'
  },
  {
    title: 'Current Streak',
    value: '7 days',
    change: 'Keep it up!',
    trend: 'up',
    icon: Target,
    color: 'text-primary'
  },
  {
    title: 'Plan Status',
    value: 'Premium',
    change: 'Expires in 15 days',
    trend: 'neutral',
    icon: Award,
    color: 'text-orange-600 dark:text-orange-400'
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'workout',
    message: 'Completed Upper Body Workout',
    time: '2 hours ago',
    icon: Dumbbell,
    color: 'text-green-600'
  },
  {
    id: 2,
    type: 'checkin',
    message: 'Checked in to gym',
    time: '2 hours ago',
    icon: CheckCircle,
    color: 'text-blue-600'
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
    color: 'text-green-600'
  }
];

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

export default function MemberDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate stats cards
      const statCards = document.querySelectorAll('.stat-card');
      if (statCards.length > 0) {
        gsap.fromTo(statCards, 
          { opacity: 0, y: 30, scale: 0.9 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
          }
        );
      }

      // Animate activity items
      const activityItems = document.querySelectorAll('.activity-item');
      if (activityItems.length > 0) {
        gsap.fromTo(activityItems, 
          { opacity: 0, x: -20 },
          { 
            opacity: 1, 
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.3,
            ease: 'power2.out'
          }
        );
      }

      // Animate event items
      const eventItems = document.querySelectorAll('.event-item');
      if (eventItems.length > 0) {
        gsap.fromTo(eventItems, 
          { opacity: 0, x: 20 },
          { 
            opacity: 1, 
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.5,
            ease: 'power2.out'
          }
        );
      }
    }, dashboardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={dashboardRef} className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Good morning! 💪</h2>
        <p className="text-muted-foreground">Ready for another great workout? Here's your fitness overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {memberStats.map((stat, index) => (
          <Card key={index} className="stat-card hover:shadow-lg transition-all duration-300 border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activities</span>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-item p-3 rounded-lg border border-border hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-foreground pr-2">
                      {event.title}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.priority === 'high' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        : event.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {event.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {event.date}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2 bg-primary hover:bg-primary/90">
              <CheckCircle className="w-6 h-6" />
              <span className="text-sm">Check In</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-primary text-primary hover:bg-primary/10">
              <Activity className="w-6 h-6" />
              <span className="text-sm">Log Workout</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-primary text-primary hover:bg-primary/10">
              <User className="w-6 h-6" />
              <span className="text-sm">Update Profile</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-primary text-primary hover:bg-primary/10">
              <CreditCard className="w-6 h-6" />
              <span className="text-sm">View Payments</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Chart Placeholder */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Progress chart will be displayed here</p>
              <p className="text-sm text-muted-foreground mt-2">Track your workout consistency and improvements</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}