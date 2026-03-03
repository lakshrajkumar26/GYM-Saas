'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function WeeklyProgress() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border border-primary/10">
          <div className="text-center">
            <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
              <TrendingUp className="w-12 h-12 text-primary" />
            </div>
            <p className="text-muted-foreground font-medium">Progress chart will be displayed here</p>
            <p className="text-sm text-muted-foreground mt-2">Track your workout consistency and improvements</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
