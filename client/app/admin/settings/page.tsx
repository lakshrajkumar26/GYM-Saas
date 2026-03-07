'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Loader2 } from 'lucide-react';
import { gymAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    phone2: '',
    email: '',
    description: '',
    aboutDescription: '',
    ownerName: '',
    ownerMessage: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
    admissionCharge: '600',
    monthlyCharge: '800',
    morningTiming: '6:00 AM - 11:00 AM',
    eveningTiming: '4:00 PM - 10:00 PM',
    facilities: '',
    trainers: ''
  });

  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['gym-settings'],
    queryFn: async () => {
      const response = await gymAPI.getSettings();
      return response.data;
    },
  });

  // Update form when settings are loaded
  useEffect(() => {
    if (settings) {
      // Parse facilities and trainers from JSON
      let facilitiesText = '';
      if (settings.facilities) {
        try {
          const facilitiesArray = JSON.parse(settings.facilities);
          facilitiesText = facilitiesArray.join('\n');
        } catch (e) {
          facilitiesText = settings.facilities;
        }
      }

      let trainersText = '';
      if (settings.trainers) {
        try {
          const trainersArray = JSON.parse(settings.trainers);
          trainersText = trainersArray.map((t: any) => 
            `${t.name} | ${t.specialization}${t.experience ? ' | ' + t.experience + ' years' : ''}`
          ).join('\n');
        } catch (e) {
          trainersText = settings.trainers;
        }
      }

      setFormData({
        name: settings.name || '',
        address: settings.address || '',
        phone: settings.phone || '',
        phone2: settings.phone2 || '',
        email: settings.email || '',
        description: settings.description || '',
        aboutDescription: settings.aboutDescription || '',
        ownerName: settings.ownerName || '',
        ownerMessage: settings.ownerMessage || '',
        website: settings.website || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        twitter: settings.twitter || '',
        admissionCharge: settings.admissionCharge?.toString() || '600',
        monthlyCharge: settings.monthlyCharge?.toString() || '800',
        morningTiming: settings.morningTiming || '6:00 AM - 11:00 AM',
        eveningTiming: settings.eveningTiming || '4:00 PM - 10:00 PM',
        facilities: facilitiesText,
        trainers: trainersText
      });
    }
  }, [settings]);

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      // Convert facilities and trainers to JSON
      const processedData: any = { ...data };
      
      // Process facilities
      if (data.facilities) {
        const facilitiesArray = data.facilities.split('\n').filter(f => f.trim());
        processedData.facilities = JSON.stringify(facilitiesArray);
      }
      
      // Process trainers
      if (data.trainers) {
        const trainersArray = data.trainers.split('\n').filter(t => t.trim()).map(line => {
          const parts = line.split('|').map(p => p.trim());
          return {
            name: parts[0] || '',
            specialization: parts[1] || '',
            experience: parts[2] ? parseInt(parts[2]) : undefined
          };
        });
        processedData.trainers = JSON.stringify(trainersArray);
      }
      
      return gymAPI.updateSettings(processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym-settings'] });
      toast.success('Settings saved successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Gym Settings</h2>
        <p className="text-muted-foreground">Configure your gym information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Gym Name *</Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone2">Secondary Phone</Label>
                <Input 
                  id="phone2" 
                  name="phone2"
                  value={formData.phone2}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Input 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief tagline for your gym"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aboutDescription">About Us (Detailed)</Label>
              <textarea
                id="aboutDescription"
                name="aboutDescription"
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                value={formData.aboutDescription}
                onChange={handleChange}
                placeholder="Detailed description for About page"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourgym.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input 
                id="facebook" 
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/yourgym"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input 
                id="instagram" 
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/yourgym"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input 
                id="twitter" 
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/yourgym"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Pricing & Timings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admissionCharge">Admission Charge (₹)</Label>
                <Input 
                  id="admissionCharge" 
                  name="admissionCharge"
                  type="number"
                  value={formData.admissionCharge}
                  onChange={handleChange}
                  placeholder="600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyCharge">Monthly Charge (₹)</Label>
                <Input 
                  id="monthlyCharge" 
                  name="monthlyCharge"
                  type="number"
                  value={formData.monthlyCharge}
                  onChange={handleChange}
                  placeholder="800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="morningTiming">Morning Timing</Label>
                <Input 
                  id="morningTiming" 
                  name="morningTiming"
                  value={formData.morningTiming}
                  onChange={handleChange}
                  placeholder="6:00 AM - 11:00 AM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eveningTiming">Evening Timing</Label>
                <Input 
                  id="eveningTiming" 
                  name="eveningTiming"
                  value={formData.eveningTiming}
                  onChange={handleChange}
                  placeholder="4:00 PM - 10:00 PM"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>About Page Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner/Founder Name</Label>
              <Input 
                id="ownerName" 
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerMessage">Owner Message</Label>
              <textarea
                id="ownerMessage"
                name="ownerMessage"
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                value={formData.ownerMessage}
                onChange={handleChange}
                placeholder="Message from the owner/founder"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Facilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facilities">Gym Facilities (one per line)</Label>
              <textarea
                id="facilities"
                name="facilities"
                rows={10}
                className="w-full px-3 py-2 border border-border rounded-md bg-background font-mono text-sm"
                value={formData.facilities}
                onChange={handleChange}
                placeholder="Modern Cardio Equipment&#10;Free Weights & Dumbbells&#10;Strength Training Machines&#10;Steam & Sauna&#10;Locker Rooms"
              />
              <p className="text-xs text-muted-foreground">Enter each facility on a new line</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Trainers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trainers">Trainer Information (one per line)</Label>
              <textarea
                id="trainers"
                name="trainers"
                rows={6}
                className="w-full px-3 py-2 border border-border rounded-md bg-background font-mono text-sm"
                value={formData.trainers}
                onChange={handleChange}
                placeholder="John Smith | Strength Training | 10&#10;Jane Doe | Yoga & Flexibility | 8&#10;Mike Johnson | Cardio Specialist | 5"
              />
              <p className="text-xs text-muted-foreground">
                Format: Name | Specialization | Years of Experience (optional)
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit"
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
