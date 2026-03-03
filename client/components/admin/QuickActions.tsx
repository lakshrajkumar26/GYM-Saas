'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CreditCard, UserCheck, TrendingUp } from 'lucide-react';

export default function QuickActions() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-20 flex-col space-y-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Users className="w-6 h-6" />
            <span className="text-sm">Add Member</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2 border-primary text-primary hover:bg-primary/10 hover:border-primary">
            <CreditCard className="w-6 h-6" />
            <span className="text-sm">Record Payment</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2 border-primary text-primary hover:bg-primary/10 hover:border-primary">
            <UserCheck className="w-6 h-6" />
            <span className="text-sm">Check-in Member</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2 border-primary text-primary hover:bg-primary/10 hover:border-primary">
            <TrendingUp className="w-6 h-6" />
            <span className="text-sm">View Reports</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
