'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import StatsGrid from '@/components/dashboard/StatsGrid';
import RecentActivities from '@/components/dashboard/RecentActivities';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import QuickActions from '@/components/dashboard/QuickActions';
import WeeklyProgress from '@/components/dashboard/WeeklyProgress';

export default function MemberDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);

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

      // Animate event items
      const eventItems = document.querySelectorAll('.event-item');
      if (eventItems.length > 0) {
        gsap.fromTo(eventItems, 
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

  return (
    <div ref={dashboardRef} className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Good morning!</h2>
        <p className="text-muted-foreground">Ready for another great workout? Here's your fitness overview.</p>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivities />
        <UpcomingEvents />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Progress Chart */}
      <WeeklyProgress />
    </div>
  );
}
