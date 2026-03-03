'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Notifications</Label>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="email" className="w-4 h-4" defaultChecked />
              <label htmlFor="email" className="text-sm text-muted-foreground">
                Receive email notifications for important updates
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sms">SMS Notifications</Label>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="sms" className="w-4 h-4" />
              <label htmlFor="sms" className="text-sm text-muted-foreground">
                Receive SMS notifications for membership expiry
              </label>
            </div>
          </div>

          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
