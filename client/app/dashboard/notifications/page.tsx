'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
        <p className="text-muted-foreground">Stay updated with important alerts</p>
      </div>

      <Card className="border-border">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
              <Bell className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No New Notifications</h3>
            <p className="text-muted-foreground">
              You're all caught up! Check back later for updates
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
