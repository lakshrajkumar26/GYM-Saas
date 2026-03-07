'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Activity, User, CreditCard } from 'lucide-react';
import { attendanceAPI, dashboardAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Get member stats to get memberId
  const { data: stats } = useQuery({
    queryKey: ['memberStats'],
    queryFn: async () => {
      const response = await dashboardAPI.getMemberStats();
      return response.data;
    }
  });

  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: async () => {
      return attendanceAPI.checkIn();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberStats'] });
      queryClient.invalidateQueries({ queryKey: ['my-attendance'] });
      queryClient.invalidateQueries({ queryKey: ['member-recent-activities'] });
      toast.success('Checked in successfully!');
      setIsCheckingIn(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to check in');
      setIsCheckingIn(false);
    },
  });

  const handleCheckIn = () => {
    setIsCheckingIn(true);
    checkInMutation.mutate();
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={handleCheckIn}
            disabled={isCheckingIn || checkInMutation.isPending}
            className="h-20 flex-col space-y-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="text-sm">
              {isCheckingIn || checkInMutation.isPending ? 'Checking...' : 'Check In'}
            </span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 border-primary text-primary hover:bg-primary/10 hover:border-primary"
            onClick={() => router.push('/dashboard/attendance')}
          >
            <Activity className="w-6 h-6" />
            <span className="text-sm">My Attendance</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 border-primary text-primary hover:bg-primary/10 hover:border-primary"
            onClick={() => router.push('/dashboard/profile')}
          >
            <User className="w-6 h-6" />
            <span className="text-sm">Update Profile</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 border-primary text-primary hover:bg-primary/10 hover:border-primary"
            onClick={() => router.push('/dashboard/payments')}
          >
            <CreditCard className="w-6 h-6" />
            <span className="text-sm">View Payments</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
