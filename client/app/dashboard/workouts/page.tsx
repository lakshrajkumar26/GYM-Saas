'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Plus, TrendingUp } from 'lucide-react';

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Workouts</h2>
          <p className="text-muted-foreground">Track your fitness progress</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          Log Workout
        </Button>
      </div>

      <Card className="border-border">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
              <Activity className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Workout Tracking Coming Soon</h3>
            <p className="text-muted-foreground">
              Log your workouts, track progress, and achieve your fitness goals
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
