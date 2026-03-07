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
import { portfolioAPI } from '@/lib/api';
import { 
  Plus, 
  Edit, 
  Trash2,
  Image as ImageIcon,
  Video,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function AdminPortfolioPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filterType, setFilterType] = useState('ALL');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();

  const type = watch('type', 'IMAGE');

  // Fetch portfolio items
  const { data: items, isLoading } = useQuery({
    queryKey: ['portfolio-admin'],
    queryFn: async () => {
      const response = await portfolioAPI.getAll();
      return response.data;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (formData: FormData) => portfolioAPI.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-admin'] });
      toast.success('Portfolio item created successfully!');
      setIsCreateOpen(false);
      reset();
      setSelectedFile(null);
      setSelectedThumbnail(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create item');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      portfolioAPI.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-admin'] });
      toast.success('Portfolio item updated successfully!');
      setIsEditOpen(false);
      setSelectedItem(null);
      reset();
      setSelectedFile(null);
      setSelectedThumbnail(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update item');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => portfolioAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-admin'] });
      toast.success('Portfolio item deleted successfully!');
      setIsDeleteOpen(false);
      setSelectedItem(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete item');
    },
  });

  const onCreateSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('content', data.content || '');
    formData.append('type', data.type);
    formData.append('section', data.section || 'GENERAL');
    formData.append('isPublished', data.isPublished ? 'true' : 'false');
    
    if (selectedFile) {
      formData.append('media', selectedFile);
    }
    
    if (selectedThumbnail && data.type === 'VIDEO') {
      formData.append('thumbnail', selectedThumbnail);
    }

    createMutation.mutate(formData);
  };

  const onEditSubmit = (data: any) => {
    if (!selectedItem) return;
    
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('content', data.content || '');
    formData.append('type', data.type);
    formData.append('section', data.section || 'GENERAL');
    formData.append('isPublished', data.isPublished ? 'true' : 'false');
    
    if (selectedFile) {
      formData.append('media', selectedFile);
    }
    
    if (selectedThumbnail && data.type === 'VIDEO') {
      formData.append('thumbnail', selectedThumbnail);
    }

    updateMutation.mutate({ id: selectedItem.id, formData });
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    reset({
      title: item.title,
      description: item.description || '',
      content: item.content || '',
      type: item.type,
      section: item.section || 'GENERAL',
      isPublished: item.isPublished
    });
    setIsEditOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const filteredItems = items?.filter((item: any) => 
    filterType === 'ALL' || item.type === filterType
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE': return ImageIcon;
      case 'VIDEO': return Video;
      case 'BLOG': return FileText;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'IMAGE': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'VIDEO': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'BLOG': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Portfolio Management</h2>
          <p className="text-muted-foreground">Manage your gym's portfolio, blog posts, and media</p>
        </div>
        <Button 
          onClick={() => {
            reset({ type: 'IMAGE', section: 'GENERAL', isPublished: false });
            setIsCreateOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex gap-2">
            <Button
              variant={filterType === 'ALL' ? 'default' : 'outline'}
              onClick={() => setFilterType('ALL')}
              className={filterType === 'ALL' ? 'bg-primary hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10'}
            >
              All ({items?.length || 0})
            </Button>
            <Button
              variant={filterType === 'IMAGE' ? 'default' : 'outline'}
              onClick={() => setFilterType('IMAGE')}
              className={filterType === 'IMAGE' ? 'bg-primary hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10'}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Images ({items?.filter((i: any) => i.type === 'IMAGE').length || 0})
            </Button>
            <Button
              variant={filterType === 'VIDEO' ? 'default' : 'outline'}
              onClick={() => setFilterType('VIDEO')}
              className={filterType === 'VIDEO' ? 'bg-primary hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10'}
            >
              <Video className="w-4 h-4 mr-2" />
              Videos ({items?.filter((i: any) => i.type === 'VIDEO').length || 0})
            </Button>
            <Button
              variant={filterType === 'BLOG' ? 'default' : 'outline'}
              onClick={() => setFilterType('BLOG')}
              className={filterType === 'BLOG' ? 'bg-primary hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10'}
            >
              <FileText className="w-4 h-4 mr-2" />
              Blogs ({items?.filter((i: any) => i.type === 'BLOG').length || 0})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-muted rounded mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredItems && filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item: any) => {
            const Icon = getTypeIcon(item.type);
            return (
              <Card key={item.id} className="border-border hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-0">
                  {/* Media Preview */}
                  <div className="relative h-48 bg-muted overflow-hidden">
                    {item.type === 'IMAGE' && item.mediaUrl && (
                      <img 
                        src={`http://localhost:5000${item.mediaUrl}`} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {item.type === 'VIDEO' && item.thumbnailUrl && (
                      <img 
                        src={`http://localhost:5000${item.thumbnailUrl}`} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {item.type === 'BLOG' && (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <FileText className="w-16 h-16 text-primary" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      {item.isPublished ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500 text-white flex items-center">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        <Icon className="w-3 h-3 inline mr-1" />
                        {item.type}
                      </span>
                      {item.section && (
                        <span className="text-xs text-muted-foreground">{item.section}</span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 border-primary text-primary hover:bg-primary/10"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first portfolio item.</p>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || isEditOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setIsEditOpen(false);
          setSelectedItem(null);
          reset();
          setSelectedFile(null);
          setSelectedThumbnail(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditOpen ? 'Edit' : 'Add'} Portfolio Item</DialogTitle>
            <DialogDescription>
              {isEditOpen ? 'Update' : 'Create'} a portfolio item with images, videos, or blog content
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(isEditOpen ? onEditSubmit : onCreateSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <select 
                  id="type" 
                  {...register('type', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="IMAGE">Image</option>
                  <option value="VIDEO">Video</option>
                  <option value="BLOG">Blog Post</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <select 
                  id="section" 
                  {...register('section')}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="GENERAL">General</option>
                  <option value="GALLERY">Gallery</option>
                  <option value="SUCCESS_STORIES">Success Stories</option>
                  <option value="WORKOUTS">Workouts</option>
                  <option value="NUTRITION">Nutrition</option>
                  <option value="TIPS">Tips & Tricks</option>
                  <option value="EVENTS">Events</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                {...register('title', { required: 'Title is required' })}
                placeholder="Enter title"
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Input 
                id="description" 
                {...register('description')}
                placeholder="Brief description (shown in cards)"
              />
            </div>

            {type === 'BLOG' && (
              <div className="space-y-2">
                <Label htmlFor="content">Blog Content</Label>
                <textarea 
                  id="content" 
                  {...register('content')}
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                  placeholder="Full blog content..."
                />
              </div>
            )}

            {(type === 'IMAGE' || type === 'VIDEO') && (
              <div className="space-y-2">
                <Label htmlFor="media">{type === 'IMAGE' ? 'Image' : 'Video'} File</Label>
                <Input 
                  id="media" 
                  type="file"
                  accept={type === 'IMAGE' ? 'image/*' : 'video/*'}
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground">
                  Max size: {type === 'IMAGE' ? '5MB' : '100MB'}
                </p>
              </div>
            )}

            {type === 'VIDEO' && (
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Video Thumbnail</Label>
                <Input 
                  id="thumbnail" 
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedThumbnail(e.target.files?.[0] || null)}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                {...register('isPublished')}
                className="w-4 h-4 rounded border-border"
              />
              <Label htmlFor="isPublished" className="cursor-pointer">
                Publish immediately
              </Label>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsCreateOpen(false);
                  setIsEditOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : (isEditOpen ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Portfolio Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteOpen(false);
                setSelectedItem(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedItem && deleteMutation.mutate(selectedItem.id)}
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
