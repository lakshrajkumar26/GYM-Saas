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
import { Switch } from '@/components/ui/switch';
import { memberAPI, planAPI } from '@/lib/api';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  UserX
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const memberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  planId: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  bodyFat: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });

  // Fetch members
  const { data: members, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await memberAPI.getAll();
      return response.data;
    },
  });

  // Fetch plans for dropdown
  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await planAPI.getAll();
      return response.data;
    },
  });

  // Create member mutation
  const createMutation = useMutation({
    mutationFn: (data: MemberFormData) => memberAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member created successfully!');
      setIsCreateOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create member');
    },
  });

  // Update member mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MemberFormData }) => 
      memberAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member updated successfully!');
      setIsEditOpen(false);
      setSelectedMember(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update member');
    },
  });

  // Delete member mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => memberAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member deleted successfully!');
      setIsDeleteOpen(false);
      setSelectedMember(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete member');
    },
  });

  // Toggle member status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => memberAPI.toggleStatus(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(response.data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to toggle member status');
    },
  });

  const onCreateSubmit = (data: MemberFormData) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: MemberFormData) => {
    if (selectedMember) {
      updateMutation.mutate({ id: selectedMember.id, data });
    }
  };

  const handleEdit = (member: any) => {
    setSelectedMember(member);
    reset({
      name: member.user.name,
      email: member.user.email,
      phone: member.phone || '',
      address: member.address || '',
      planId: member.planId || '',
      height: member.height?.toString() || '',
      weight: member.weight?.toString() || '',
      bodyFat: member.bodyFat?.toString() || '',
    });
    setIsEditOpen(true);
  };

  const handleDelete = (member: any) => {
    setSelectedMember(member);
    setIsDeleteOpen(true);
  };

  const filteredMembers = members?.filter((member: any) => {
    const matchesSearch = member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' 
      ? 'bg-primary/10 text-primary border-primary/20'
      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200';
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Elite':
        return 'bg-primary text-white border-primary shadow-sm shadow-primary/20';
      case 'Premium':
        return 'bg-primary/80 text-white border-primary/80 shadow-sm shadow-primary/15';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Members Management</h2>
          <p className="text-muted-foreground">Manage your gym members and their subscriptions</p>
        </div>
        <Button 
          onClick={() => {
            reset();
            setIsCreateOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search members by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'ALL' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('ALL')}
                className={filterStatus === 'ALL' ? 'bg-primary hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10'}
              >
                All ({members?.length || 0})
              </Button>
              <Button
                variant={filterStatus === 'ACTIVE' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('ACTIVE')}
                className={filterStatus === 'ACTIVE' ? 'bg-primary hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10'}
              >
                Active ({members?.filter((m: any) => m.status === 'ACTIVE').length || 0})
              </Button>
              <Button
                variant={filterStatus === 'EXPIRED' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('EXPIRED')}
                className={filterStatus === 'EXPIRED' ? 'bg-primary hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10'}
              >
                Expired ({members?.filter((m: any) => m.status === 'EXPIRED').length || 0})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMembers && filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member: any) => (
            <Card key={member.id} className="border-border hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ring-2 ring-primary/20">
                      <span className="text-lg font-semibold text-primary">
                        {member.user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.user.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                        {member.plan && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(member.plan.name)}`}>
                            {member.plan.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {member.user.email}
                  </div>
                  {member.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2" />
                      {member.phone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Expires: {new Date(member.expiryDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={member.user.isActive}
                      onCheckedChange={() => toggleStatusMutation.mutate(member.id)}
                      disabled={toggleStatusMutation.isPending}
                    />
                    <span className="text-sm text-muted-foreground">
                      {member.user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => handleDelete(member)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <UserX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No members found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'ALL' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first member.'
              }
            </p>
            {!searchTerm && filterStatus === 'ALL' && (
              <Button 
                onClick={() => setIsCreateOpen(true)}
                className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Member
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Member Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Create a new member account with their details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('phone')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register('address')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planId">Membership Plan</Label>
              <select 
                id="planId" 
                {...register('planId')}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                <option value="">Select a plan</option>
                {plans?.map((plan: any) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ₹{plan.price} ({plan.duration} days)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" {...register('height')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" {...register('weight')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                <Input id="bodyFat" type="number" {...register('bodyFat')} />
              </div>
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
                {createMutation.isPending ? 'Creating...' : 'Create Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update member information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input id="edit-name" {...register('name')} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input id="edit-email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" {...register('phone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-planId">Membership Plan</Label>
                <select 
                  id="edit-planId" 
                  {...register('planId')}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="">Select a plan</option>
                  {plans?.map((plan: any) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - ₹{plan.price} ({plan.duration} days)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input id="edit-address" {...register('address')} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-height">Height (cm)</Label>
                <Input id="edit-height" type="number" {...register('height')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-weight">Weight (kg)</Label>
                <Input id="edit-weight" type="number" {...register('weight')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bodyFat">Body Fat (%)</Label>
                <Input id="edit-bodyFat" type="number" {...register('bodyFat')} />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedMember(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedMember?.user?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteOpen(false);
                setSelectedMember(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedMember && deleteMutation.mutate(selectedMember.id)}
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
