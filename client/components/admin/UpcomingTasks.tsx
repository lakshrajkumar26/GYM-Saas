'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

export default function UpcomingTasks() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingTasks.map((task) => (
            <div 
              key={task.id} 
              className="task-item p-3 rounded-lg border border-border hover:shadow-sm hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-foreground pr-2">{task.task}</p>
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' 
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
          View All Tasks
        </Button>
      </CardContent>
    </Card>
  );
}
