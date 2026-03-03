'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Award,
  Target,
  Activity
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  height: string;
  weight: string;
  bodyFat: string;
}

// Mock data - replace with real API calls
const memberData = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91-9876543210',
  address: '123 Main Street, City, State',
  joinDate: '2024-01-15',
  plan: 'Premium',
  status: 'ACTIVE',
  expiryDate: '2024-04-15',
  height: '175',
  weight: '70',
  bodyFat: '15'
};

const achievements = [
  {
    id: 1,
    title: '30-Day Streak',
    description: 'Worked out for 30 consecutive days',
    icon: Target,
    color: 'text-primary',
    bgColor: 'bg-primary/10 border border-primary/20'
  },
  {
    id: 2,
    title: 'Weight Loss Champion',
    description: 'Lost 5kg in 2 months',
    icon: Award,
    color: 'text-primary',
    bgColor: 'bg-primary/10 border border-primary/20'
  },
  {
    id: 3,
    title: 'Consistency King',
    description: 'Never missed a scheduled workout',
    icon: Activity,
    color: 'text-primary',
    bgColor: 'bg-primary/10 border border-primary/20'
  }
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: memberData
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const profileCards = document.querySelectorAll('.profile-card');
      if (profileCards.length > 0) {
        gsap.fromTo(profileCards, 
          { opacity: 0, y: 30, scale: 0.9 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power3.out'
          }
        );
      }

      const achievementItems = document.querySelectorAll('.achievement-item');
      if (achievementItems.length > 0) {
        gsap.fromTo(achievementItems, 
          { opacity: 0, x: -20 },
          { 
            opacity: 1, 
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.4,
            ease: 'power2.out'
          }
        );
      }
    }, profileRef);

    return () => ctx.revert();
  }, []);

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset(memberData);
    setIsEditing(false);
  };

  return (
    <div ref={profileRef} className="space-y-6">
      {/* Profile Header */}
      <Card className="profile-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center ring-4 ring-primary/20">
                <span className="text-3xl font-bold text-primary">
                  {memberData.name.charAt(0)}
                </span>
              </div>
              <Button
                size="icon"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{memberData.name}</h2>
              <p className="text-muted-foreground">{memberData.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  {memberData.status}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-white shadow-sm shadow-primary/20">
                  {memberData.plan} Plan
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="profile-card lg:col-span-2 border-border">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      disabled={!isEditing}
                      className="pl-10"
                      {...register('name', { required: 'Name is required' })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      disabled={!isEditing}
                      className="pl-10"
                      {...register('email', { required: 'Email is required' })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      disabled={!isEditing}
                      className="pl-10"
                      {...register('phone', { required: 'Phone is required' })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="address"
                      disabled={!isEditing}
                      className="pl-10"
                      {...register('address', { required: 'Address is required' })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="text-lg font-semibold text-foreground mb-4">Body Measurements</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      disabled={!isEditing}
                      {...register('height')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      disabled={!isEditing}
                      {...register('weight')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyFat">Body Fat (%)</Label>
                    <Input
                      id="bodyFat"
                      type="number"
                      disabled={!isEditing}
                      {...register('bodyFat')}
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Membership Info & Achievements */}
        <div className="space-y-6">
          {/* Membership Info */}
          <Card className="profile-card border-border">
            <CardHeader>
              <CardTitle>Membership Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="font-medium text-foreground">{memberData.plan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="font-medium text-primary">{memberData.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Join Date</span>
                <span className="font-medium text-foreground">
                  {new Date(memberData.joinDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expires</span>
                <span className="font-medium text-foreground">
                  {new Date(memberData.expiryDate).toLocaleDateString()}
                </span>
              </div>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                Renew Membership
              </Button>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="profile-card border-border">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="achievement-item flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all">
                    <div className={`p-2 rounded-full ${achievement.bgColor}`}>
                      <achievement.icon className={`w-4 h-4 ${achievement.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {achievement.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}