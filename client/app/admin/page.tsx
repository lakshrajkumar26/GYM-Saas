'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import AdminStatsGrid from '@/components/admin/AdminStatsGrid';
import RecentActivities from '@/components/admin/RecentActivities';
import UpcomingTasks from '@/components/admin/UpcomingTasks';
import QuickActions from '@/components/admin/QuickActions';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

 const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate stats cards
      const statCards = document.querySelectorAll('.stat-card');
      if (statCards.length > 0) {
        gsap.fromTo(statCards, 
          { opacity: 0, y: 30, scale: 0.9 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
          }
        );
      }

      // Animate activity items
      const activityItems = document.querySelectorAll('.activity-item');
      if (activityItems.length > 0) {
        gsap.fromTo(activityItems, 
          { opacity: 0, x: -20 },
          { 
            opacity: 1, 
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.3,
            ease: 'power2.out'
          }
        );
      }

      // Animate task items
      const taskItems = document.querySelectorAll('.task-item');
      if (taskItems.length > 0) {
        gsap.fromTo(taskItems, 
          { opacity: 0, x: 20 },
          { 
            opacity: 1, 
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.5,
            ease: 'power2.out'
          }
        );
      }
    }, dashboardRef);

    return () => ctx.revert();
  }, []);

    useEffect(() => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
  }, [router]);
  
  return (
    <div ref={dashboardRef} className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Good morning{user ? `, ${user.name}` : ''}! 
        </h2>
        <p className="text-muted-foreground">Here's what's happening at B Gym today.</p>
      </div>

      {/* Stats Grid */}
      <AdminStatsGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivities />
        <UpcomingTasks />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
