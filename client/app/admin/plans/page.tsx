'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Edit, 
  Trash2,
  Users,
  DollarSign,
  Calendar,
  Package
} from 'lucide-react';

// Mock data - replace with real API calls
const plans = [
  {
    id: '1',
    name: 'Basic',
    price: 2999,
    duration: 30,
    features: ['Gym access during peak hours', 'Basic equipment usage', 'Locker facility', 'Free fitness assessment'],
    memberCount: 45,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Premium',
    price: 4999,
    duration: 30,
    features: ['24/7 gym access', 'All equipment access', 'Personal trainer (2 sessions)', 'Nutrition consultation', 'Steam & sauna access'],
    memberCount: 78,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Elite',
    price: 7999,
    duration: 30,
    features: ['All Premium features', 'Unlimited personal training', 'Custom meal plans', 'Priority booking', 'Guest passes (2 per month)'],
    memberCount: 23,
    isActive: true,
    createdAt: '2024-01-01'
  }
];

export default function PlansPage() {
  const plansRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const planCards = document.querySelectorAll('.plan-card');
      if (planCards.length > 0) {
        gsap.fromTo(planCards, 
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
    }, plansRef);

    return () => ctx.revert();
  }, []);

  const getPlanColor = (name: string) => {
    switch (name) {
      case 'Elite':
        return 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10';
      case 'Premium':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10';
      case 'Basic':
        return 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/10';
      default:
        return 'border-border';
    }
  };

  return (
    <div ref={plansRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Membership Plans</h2>
          <p className="text-muted-foreground">Create and manage your gym membership plans</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Plans</p>
                <p className="text-2xl font-bold text-foreground">{plans.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold text-foreground">{plans.reduce((sum, plan) => sum + plan.memberCount, 0)}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold text-foreground">₹{plans.reduce((sum, plan) => sum + (plan.price * plan.memberCount), 0).toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Duration</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(plans.reduce((sum, plan) => sum + plan.duration, 0) / plans.length)} days</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`plan-card hover:shadow-lg transition-all duration-300 ${getPlanColor(plan.name)}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline mt-2">
                    <span className="text-3xl font-bold text-primary">₹{plan.price.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-2">/{plan.duration} days</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Members</span>
                <span className="font-semibold text-foreground">{plan.memberCount}</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Features:</p>
                <ul className="space-y-1">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      +{plan.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Revenue</span>
                  <span className="font-semibold text-primary">₹{(plan.price * plan.memberCount).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Plan Card */}
      <Card className="plan-card border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Create New Plan</h3>
          <p className="text-muted-foreground mb-4">
            Add a new membership plan with custom pricing and features
          </p>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}