'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Edit,
  Save,
  X,
  Camera,
  Award,
  Target,
  Activity,
  Trophy,
  Lock
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { userAPI, dashboardAPI } from '@/lib/api';
import { format } from 'date-fns';

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  height: string;
  weight: string;
  bodyFat: string;
}

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>();

  // Fetch member stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['memberStats'],
    queryFn: async () => {
      const response = await dashboardAPI.getMemberStats();
      return response.data;
    }
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (data: ProfileForm) => userAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberStats'] });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => userAPI.uploadProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberStats'] });
      toast.success('Profile image updated successfully!');
      setSelectedImage(null);
      setImagePreview(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (selectedImage) {
      uploadImageMutation.mutate(selectedImage);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Set form values when data loads
  useEffect(() => {
    if (stats?.member) {
      reset({
        name: stats.member.name || '',
        email: stats.member.email || '',
        phone: stats.member.phone || '',
        address: stats.member.address || '',
        height: stats.member.height?.toString() || '',
        weight: stats.member.weight?.toString() || '',
        bodyFat: stats.member.bodyFat?.toString() || '',
      });
    }
  }, [stats, reset]);

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
  }, [isLoading]);

  const onSubmit = async (data: ProfileForm) => {
    updateMutation.mutate(data);
  };

  const handleCancel = () => {
    if (stats?.member) {
      reset({
        name: stats.member.name || '',
        email: stats.member.email || '',
        phone: stats.member.phone || '',
        address: stats.member.address || '',
        height: stats.member.height?.toString() || '',
        weight: stats.member.weight?.toString() || '',
        bodyFat: stats.member.bodyFat?.toString() || '',
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-border animate-pulse">
          <CardContent className="p-6">
            <div className="h-32 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const memberData = stats?.member || {};
  const planData = stats?.plan || {};
  const allAchievements = stats?.achievements || [];
  
  // Show unlocked first, then locked, limit to 3 unless "See All" is clicked
  const sortedAchievements = [...allAchievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return 0;
  });
  
  const displayedAchievements = showAllAchievements 
    ? sortedAchievements 
    : sortedAchievements.slice(0, 3);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Target': return Target;
      case 'Award': return Award;
      case 'Activity': return Activity;
      case 'Trophy': return Trophy;
      default: return Award;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200';
      case 'RARE': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200';
      case 'EPIC': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200';
      case 'LEGENDARY': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return { text: 'Common', color: 'bg-gray-500' };
      case 'RARE': return { text: 'Rare', color: 'bg-blue-500' };
      case 'EPIC': return { text: 'Epic', color: 'bg-purple-500' };
      case 'LEGENDARY': return { text: 'Legendary', color: 'bg-primary' };
      default: return { text: 'Common', color: 'bg-gray-500' };
    }
  };

  return (
    <div ref={profileRef} className="space-y-6">
      {/* Profile Header */}
      <Card className="profile-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center ring-4 ring-primary/20 overflow-hidden">
                {imagePreview || memberData.profileImage ? (
                  <img 
                    src={imagePreview || `http://localhost:5000${memberData.profileImage}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {memberData.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                size="icon"
                onClick={handleCameraClick}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{memberData.name}</h2>
              <p className="text-muted-foreground">{memberData.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  planData.status === 'ACTIVE' 
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200'
                }`}>
                  {planData.status || 'INACTIVE'}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-white shadow-sm shadow-primary/20">
                  {planData.name || 'No Plan'}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              {selectedImage && (
                <Button
                  onClick={handleImageUpload}
                  disabled={uploadImageMutation.isPending}
                  className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {uploadImageMutation.isPending ? 'Uploading...' : 'Upload Image'}
                </Button>
              )}
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
                    disabled={updateMutation.isPending}
                    className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updateMutation.isPending}
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
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
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
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      disabled={!isEditing}
                      className="pl-10"
                      {...register('phone')}
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
                      {...register('address')}
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

                {/* Current Measurements Display */}
                {(memberData.height || memberData.weight || memberData.bmi) && !isEditing && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h5 className="text-sm font-semibold text-foreground mb-3">Current Stats</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {memberData.height && (
                        <div>
                          <p className="text-xs text-muted-foreground">Height</p>
                          <p className="text-lg font-bold text-primary">{memberData.height} cm</p>
                        </div>
                      )}
                      {memberData.weight && (
                        <div>
                          <p className="text-xs text-muted-foreground">Weight</p>
                          <p className="text-lg font-bold text-primary">{memberData.weight} kg</p>
                        </div>
                      )}
                      {memberData.bmi && (
                        <div>
                          <p className="text-xs text-muted-foreground">BMI</p>
                          <p className="text-lg font-bold text-primary">{memberData.bmi}</p>
                        </div>
                      )}
                      {memberData.bodyFat && (
                        <div>
                          <p className="text-xs text-muted-foreground">Body Fat</p>
                          <p className="text-lg font-bold text-primary">{memberData.bodyFat}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                <span className="font-medium text-foreground">{planData.name || 'No Plan'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className={`font-medium ${planData.status === 'ACTIVE' ? 'text-primary' : 'text-gray-500'}`}>
                  {planData.status || 'INACTIVE'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Join Date</span>
                <span className="font-medium text-foreground">
                  {memberData.startDate ? format(new Date(memberData.startDate), 'dd/MM/yyyy') : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expires</span>
                <span className="font-medium text-foreground">
                  {planData.expiryDate ? format(new Date(planData.expiryDate), 'dd/MM/yyyy') : 'N/A'}
                </span>
              </div>
              {planData.daysUntilExpiry !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Days Left</span>
                  <span className={`font-medium ${planData.daysUntilExpiry > 7 ? 'text-primary' : 'text-red-500'}`}>
                    {planData.daysUntilExpiry} days
                  </span>
                </div>
              )}
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                Renew Membership
              </Button>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="profile-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Achievements</span>
                <span className="text-sm text-muted-foreground font-normal">
                  {allAchievements.filter((a: any) => a.unlocked).length} / {allAchievements.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allAchievements.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {displayedAchievements.map((achievement: any) => {
                      const Icon = getIconComponent(achievement.icon);
                      const rarityBadge = getRarityBadge(achievement.rarity);
                      
                      return (
                        <div 
                          key={achievement.id} 
                          className={`achievement-item p-3 rounded-lg border transition-all ${
                            achievement.unlocked 
                              ? `${getRarityColor(achievement.rarity)} hover:shadow-md` 
                              : 'bg-muted/30 border-border opacity-60'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full ${
                              achievement.unlocked 
                                ? getRarityColor(achievement.rarity)
                                : 'bg-muted'
                            }`}>
                              {achievement.unlocked ? (
                                <Icon className="w-4 h-4" />
                              ) : (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-sm font-medium ${
                                  achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {achievement.title}
                                </p>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${rarityBadge.color}`}>
                                  {rarityBadge.text}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {achievement.description}
                              </p>
                              
                              {/* Progress Bar */}
                              {!achievement.unlocked && achievement.progress > 0 && (
                                <div className="mb-2">
                                  <div className="w-full bg-muted rounded-full h-1.5">
                                    <div 
                                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                      style={{ width: `${achievement.progress}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {achievement.progress}% complete
                                  </p>
                                </div>
                              )}
                              
                              {/* Unlocked By Percentage */}
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Trophy className="w-3 h-3 mr-1" />
                                <span>
                                  {achievement.unlocked 
                                    ? `Unlocked by ${achievement.unlockedBy}% of members`
                                    : `${achievement.unlockedBy}% of members have this`
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* See All / Show Less Button */}
                  {allAchievements.length > 3 && (
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-primary text-primary hover:bg-primary/10"
                      onClick={() => setShowAllAchievements(!showAllAchievements)}
                    >
                      {showAllAchievements ? 'Show Less' : `See All (${allAchievements.length})`}
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Start working out to unlock achievements!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
