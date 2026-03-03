'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  UserCheck,
  Clock
} from 'lucide-react';

// Mock data - replace with real API calls
const stats = [
  {
    title: 'Total Members',
    value: '1,234',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Active Members',
    value: '1,089',
    change: '+8%',
    trend: 'up',
    icon: UserCheck,
    color: 'text-green-600 dark:text-green-400'
  },
  {
    title: 'Monthly Revenue',
    value: '₹4,56,789',
    change: '+15%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-primary'
  },
  {
    title: 'Today\'s Check-ins',
    value: '89',
    change: '-5%',
    trend: 'down',
    icon: Clock,
    color: 'text-orange-600 dark:text-orange-400'
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'member_joined',
    message: 'John Doe joined Premium Plan',
    time: '2 minutes ago',
    icon: Users
  },
  {
    id: 2,
    type: 'payment_received',
    message: 'Payment received from Sarah Wilson',
    time: '15 minutes ago',
    icon: CreditCard
  },
  {
    id: 3,
    type: 'check_in',
    message: 'Mike Johnson checked in',
    time: '1 hour ago',
    icon: UserCheck
  },
  {
    id: 4,
    type: 'plan_expired',
    message: 'Emma Davis plan expires tomorrow',
    time: '2 hours ago',
    icon: Calendar
  }
];

const upcomingTasks = [
  {
    id: 1,
    task: 'Follow up with expired memberships',
    priority: 'high',
    dueDate: 'Today'
  },
  {
    id: 2,
    task: 'Equipment maintenance check',
    priority: 'medium',
    dueDate: 'Tomorrow'
  },
  {
    id: 3,
    task: 'Monthly report preparation',
    priority: 'low',
    dueDate: 'This week'
  }
];

export default function AdminDashboard() {
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

      // Animate task items
      const taskItems = document.querySelectorAll('.task-item');
      if (taskItems.length > 0) {
        gsap.fromTo(taskItems, 
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
        <h2 className="text-3xl font-bold text-foreground mb-2">Good morning! 👋</h2>
        <p className="text-muted-foreground">Here's what's happening at B Gym today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">vs last month</span>
                  </div>
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
                  <div className="p-2 rounded-full bg-primary/10">
                    <activity.icon className="w-4 h-4 text-primary" />
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

        {/* Upcoming Tasks */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="task-item p-3 rounded-lg border border-border hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-foreground pr-2">
                      {task.task}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Due: {task.dueDate}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
              View All Tasks
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
              <Users className="w-6 h-6" />
              <span className="text-sm">Add Member</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-primary text-primary hover:bg-primary/10">
              <CreditCard className="w-6 h-6" />
              <span className="text-sm">Record Payment</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-primary text-primary hover:bg-primary/10">
              <UserCheck className="w-6 h-6" />
              <span className="text-sm">Check-in Member</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-primary text-primary hover:bg-primary/10">
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}