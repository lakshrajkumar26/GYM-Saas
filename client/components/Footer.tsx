'use client';

import { Dumbbell } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border bg-card">
      <div className="container mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              B Gym <span className="text-primary">Internationals</span>
            </span>
          </div>
          
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Transform your fitness journey with premium equipment and expert guidance.
          </p>
          
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground mb-6">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <span className="text-border">|</span>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <span className="text-border">|</span>
            <a href="#contact" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
          
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2024 B Gym Internationals. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}