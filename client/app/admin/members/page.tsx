'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';

// Mock data - replace with real API calls
const members = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91-9876543210',
    plan: 'Premium',
    status: 'ACTIVE',
    joinDate: '2024-01-15',
    expiryDate: '2024-04-15',
    lastCheckIn: '2024-03-01'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '+91-9876543211',
    plan: 'Basic',
    status: 'ACTIVE',
    joinDate: '2024-02-01',
    expiryDate: '2024-05-01',
    lastCheckIn: '2024-02-28'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+91-9876543212',
    plan: 'Elite',
    status: 'EXPIRED',
    joinDate: '2023-12-01',
    expiryDate: '2024-02-29',
    lastCheckIn: '2024-02-25'
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma@example.com',
    phone: '+91-9876543213',
    plan: 'Premium',
    status: 'ACTIVE',
    joinDate: '2024-01-20',
    expiryDate: '2024-04-20',
    lastCheckIn: '2024-03-01'
  }
];

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filteredMembers, setFilteredMembers] = useState(members);
  const membersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const memberCards = document.querySelectorAll('.member-card');
      if (memberCards.length > 0) {
        gsap.fromTo(memberCards, 
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
          }
        );
      }
    }, membersRef);

    return () => ctx.revert();
  }, [filteredMembers]);

  useEffect(() => {
    let filtered = members;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm)
      );
    }

    // Filter by status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(member => member.status === filterStatus);
    }

    setFilteredMembers(filtered);
  }, [searchTerm, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'EXPIRED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Elite':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Premium':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Basic':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div ref={membersRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Members Management</h2>
          <p className="text-muted-foreground">Manage your gym members and their subscriptions</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
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
                placeholder="Search members by name, email, or phone..."
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
                All ({members.length})
              </Button>
              <Button
                variant={filterStatus === 'ACTIVE' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('ACTIVE')}
                className={filterStatus === 'ACTIVE' ? 'bg-primary hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10'}
              >
                Active ({members.filter(m => m.status === 'ACTIVE').length})
              </Button>
              <Button
                variant={filterStatus === 'EXPIRED' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('EXPIRED')}
                className={filterStatus === 'EXPIRED' ? 'bg-primary hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10'}
              >
                Expired ({members.filter(m => m.status === 'EXPIRED').length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="member-card border-border hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(member.plan)}`}>
                        {member.plan}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  {member.email}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 mr-2" />
                  {member.phone}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Expires: {new Date(member.expiryDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Last check-in: {new Date(member.lastCheckIn).toLocaleDateString()}
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
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
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add First Member
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}