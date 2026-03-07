'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { planAPI } from '@/lib/api';
import { 
  Plus, 
  Edit, 
  Trash2,
  Users,
  DollarSign,
  Calendar,
  Package
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const planSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  price: z.string().min(1, 'Price is required'),
  discountPrice: z.string().optional(),
  duration: z.string().min(1, 'Duration is required'),
  planType: z.string().min(1, 'Plan type is required'),
  features: z.string().optional(),
});

type PlanFormData = z.infer<typeof planSchema>;

export default function PlansPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
  });

  // Fetch plans
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await planAPI.getAll();
      return response.data;
    },
  });

  // Create plan mutation
  const createMutation = useMutation({
    mutationFn: (data: PlanFormData) => planAPI.create({
      name: data.name,
      price: parseInt(data.price),
      discountPrice: data.discountPrice ? parseInt(data.discountPrice) : undefined,
      duration: parseInt(data.duration),
      planType: data.planType,
      features: data.features,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success('Plan created successfully!');
      setIsCreateOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create plan');
    },
  });

  // Update plan mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PlanFormData }) => 
      planAPI.update(id, {
        name: data.name,
        price: parseInt(data.price),
        discountPrice: data.discountPrice ? parseInt(data.discountPrice) : undefined,
        duration: parseInt(data.duration),
        planType: data.planType,
        features: data.features,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success('Plan updated successfully!');
      setIsEditOpen(false);
      setSelectedPlan(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update plan');
    },
  });

  // Delete plan mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => planAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success('Plan deleted successfully!');
      setIsDeleteOpen(false);
      setSelectedPlan(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete plan');
    },
  });

  const onCreateSubmit = (data: PlanFormData) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: PlanFormData) => {
    if (selectedPlan) {
      updateMutation.mutate({ id: selectedPlan.id, data });
    }
  };

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    reset({
      name: plan.name,
      price: plan.price.toString(),
      discountPrice: plan.discountPrice ? plan.discountPrice.toString() : '',
      duration: plan.duration.toString(),
      planType: plan.planType || 'GYM',
      features: plan.features || '',
    });
    setIsEditOpen(true);
  };

  const handleDelete = (plan: any) => {
    setSelectedPlan(plan);
    setIsDeleteOpen(true);
  };

  const getPlanColor = (name: string) => {
    switch (name) {
      case 'Elite':
        return 'border-primary dark:border-primary bg-primary/5 dark:bg-primary/10 shadow-lg shadow-primary/10';
      case 'Premium':
        return 'border-primary/60 dark:border-primary/60 bg-primary/5 dark:bg-primary/5 shadow-md shadow-primary/5';
      case 'Basic':
        return 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/10';
      default:
        return 'border-border';
    }
  };

  const totalRevenue = plans?.reduce((sum: number, plan: any) => 
    sum + (plan.price * (plan._count?.members || 0)), 0
  ) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Membership Plans</h2>
          <p className="text-muted-foreground">Create and manage your gym membership plans</p>
        </div>
        <Button 
          onClick={() => {
            reset();
            setIsCreateOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Plans</p>
                <p className="text-2xl font-bold text-primary">{plans?.length || 0}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Package className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold text-primary">
                  {plans?.reduce((sum: number, plan: any) => sum + (plan._count?.members || 0), 0) || 0}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Duration</p>
                <p className="text-2xl font-bold text-primary">
                  {plans && plans.length > 0 
                    ? Math.round(plans.reduce((sum: number, plan: any) => sum + plan.duration, 0) / plans.length)
                    : 0
                  } days
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : plans && plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan: any) => (
            <Card key={plan.id} className={`hover:shadow-lg transition-all duration-300 ${getPlanColor(plan.name)}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline mt-2">
                      {plan.discountPrice ? (
                        <>
                          <span className="text-lg line-through text-muted-foreground mr-2">₹{plan.price.toLocaleString()}</span>
                          <span className="text-3xl font-bold text-primary">₹{plan.discountPrice.toLocaleString()}</span>
                          <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                            {Math.round(((plan.price - plan.discountPrice) / plan.price) * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-primary">₹{plan.price.toLocaleString()}</span>
                      )}
                      <span className="text-muted-foreground ml-2">/{plan.duration} days</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => handleEdit(plan)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => handleDelete(plan)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Members</span>
                  <span className="font-semibold text-foreground">{plan._count?.members || 0}</span>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Revenue</span>
                    <span className="font-semibold text-primary">
                      ₹{(plan.price * (plan._count?.members || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Plan Card */}
          <Card 
            className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setIsCreateOpen(true)}
          >
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Create New Plan</h3>
              <p className="text-muted-foreground">
                Add a new membership plan with custom pricing and features
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No plans found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first membership plan</p>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Plan Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
            <DialogDescription>
              Add a new membership plan for your gym
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name *</Label>
              <Input id="name" placeholder="e.g., Basic, Premium, Elite" {...register('name')} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="planType">Plan Type *</Label>
                <select 
                  id="planType" 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  {...register('planType')}
                >
                  <option value="GYM">Gym</option>
                  <option value="CARDIO">Cardio</option>
                  <option value="COMBO">Combo</option>
                </select>
                {errors.planType && <p className="text-sm text-red-500">{errors.planType.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days) *</Label>
                <Input id="duration" type="number" placeholder="30" {...register('duration')} />
                {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input id="price" type="number" placeholder="2999" {...register('price')} />
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                <Input id="discountPrice" type="number" placeholder="2499 (optional)" {...register('discountPrice')} />
                {errors.discountPrice && <p className="text-sm text-red-500">{errors.discountPrice.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <textarea
                id="features"
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="24/7 gym access&#10;Personal trainer&#10;Nutrition consultation"
                {...register('features')}
              />
              <p className="text-xs text-muted-foreground">Enter each feature on a new line</p>
              {errors.features && <p className="text-sm text-red-500">{errors.features.message}</p>}
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Plan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>
              Update plan information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Plan Name *</Label>
              <Input id="edit-name" {...register('name')} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-planType">Plan Type *</Label>
                <select 
                  id="edit-planType" 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  {...register('planType')}
                >
                  <option value="GYM">Gym</option>
                  <option value="CARDIO">Cardio</option>
                  <option value="COMBO">Combo</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (days) *</Label>
                <Input id="edit-duration" type="number" {...register('duration')} />
                {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (₹) *</Label>
                <Input id="edit-price" type="number" {...register('price')} />
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-discountPrice">Discount Price (₹)</Label>
                <Input id="edit-discountPrice" type="number" placeholder="Optional" {...register('discountPrice')} />
                {errors.discountPrice && <p className="text-sm text-red-500">{errors.discountPrice.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-features">Features (one per line)</Label>
              <textarea
                id="edit-features"
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="24/7 gym access&#10;Personal trainer&#10;Nutrition consultation"
                {...register('features')}
              />
              <p className="text-xs text-muted-foreground">Enter each feature on a new line</p>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedPlan(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Plan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the {selectedPlan?.name} plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteOpen(false);
                setSelectedPlan(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedPlan && deleteMutation.mutate(selectedPlan.id)}
              disabled={deleteMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
