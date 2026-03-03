'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ThemeToggle } from '@/components/theme-toggle';
import { Dumbbell } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the background pattern
      gsap.fromTo('.auth-bg-pattern', 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
      );

      // Animate the main content
      gsap.fromTo('.auth-content', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );

      // Animate the logo
      gsap.fromTo('.auth-logo', 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' }
      );
    }, layoutRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={layoutRef} className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="auth-bg-pattern absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-primary/15 rounded-full blur-lg" />
          <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary/8 rounded-full blur-2xl" />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-primary/12 rounded-full blur-xl" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="auth-logo flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">B Gym Internationals</h1>
              <p className="text-sm text-muted-foreground">Premium Fitness Experience</p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center px-6 py-12">
        <div className="auth-content w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 B Gym Internationals. All rights reserved.
        </p>
      </footer>
    </div>
  );
}