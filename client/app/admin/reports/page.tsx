'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, DollarSign, Calendar, Download } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Analytics</h2>
          <p className="text-muted-foreground">Insights and performance metrics</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <Download className="w-4 h-4 mr-2" />
          Export All Reports
        </Button>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border hover:border-primary/20 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Revenue Report</span>
              <DollarSign className="w-5 h-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border border-primary/10">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Revenue chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/20 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Member Growth</span>
              <Users className="w-5 h-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border border-primary/10">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Member growth chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/20 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Attendance Trends</span>
              <Calendar className="w-5 h-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border border-primary/10">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Attendance trends will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/20 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Plan Popularity</span>
              <TrendingUp className="w-5 h-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border border-primary/10">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Plan distribution will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
