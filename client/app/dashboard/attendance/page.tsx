'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { attendanceAPI } from '@/lib/api';
import { Calendar, CheckCircle, TrendingUp } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export default function MemberAttendancePage() {
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));

  const { data: attendance, isLoading } = useQuery({
    queryKey: ['my-attendance', month],
    queryFn: async () => {
      const start = startOfMonth(new Date(month));
      const end = endOfMonth(new Date(month));
      const response = await attendanceAPI.getMyAttendance({
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd')
      });
      return response.data;
    },
  });

  const totalDays = attendance?.length || 0;
  const thisWeek = attendance?.filter((a: any) => {
    const checkInDate = new Date(a.checkIn);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return checkInDate >= weekAgo;
  }).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">My Attendance</h2>
        <p className="text-muted-foreground">Track your gym check-in history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-primary">{totalDays} days</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-primary">{thisWeek} days</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold text-primary">7 days</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Month Selector */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-foreground">Select Month:</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Check-in History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : attendance && attendance.length > 0 ? (
            <div className="space-y-4">
              {attendance.map((record: any) => (
                <div 
                  key={record.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ring-2 ring-primary/20">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {format(new Date(record.date), 'EEEE, MMMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Check-in: {format(new Date(record.checkIn), 'hh:mm a')}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    Attended
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No attendance records for this month</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
