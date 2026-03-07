'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Award, 
  Users, 
  Dumbbell, 
  Heart,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle
} from 'lucide-react';
import { gymAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const ownerRef = useRef<HTMLDivElement>(null);
  const facilitiesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const { data: settings } = useQuery({
    queryKey: ['gym-settings'],
    queryFn: async () => {
      const response = await gymAPI.getSettings();
      return response.data;
    },
  });

  const facilities = settings?.facilities ? JSON.parse(settings.facilities) : [
    "Modern Cardio Equipment",
    "Free Weights & Dumbbells",
    "Strength Training Machines",
    "Functional Training Area",
    "Steam & Sauna",
    "Locker Rooms",
    "Shower Facilities",
    "Parking Space",
    "Air Conditioned",
    "Water Purifier",
    "First Aid Kit",
    "CCTV Security"
  ];

  const trainers = settings?.trainers ? JSON.parse(settings.trainers) : [];
  const gymPhotos = settings?.gymPhotos ? JSON.parse(settings.gymPhotos) : [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
          }
        );
      }

      // Stats animation
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll('.stat-card');
        gsap.fromTo(
          statCards,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Owner section animation
      if (ownerRef.current) {
        gsap.fromTo(
          ownerRef.current,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ownerRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Facilities animation
      if (facilitiesRef.current) {
        const facilityItems = facilitiesRef.current.querySelectorAll('.facility-item');
        gsap.fromTo(
          facilityItems,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: facilitiesRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Team section animation
      if (teamRef.current) {
        gsap.fromTo(
          teamRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: teamRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [settings]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="absolute top-20 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div ref={heroRef} className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              💪 About Us
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to <span className="text-primary">{settings?.name || 'B Gym International'}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {settings?.aboutDescription || settings?.description || 
              "Your journey to a healthier, stronger you starts here. We're more than just a gym – we're a community dedicated to transforming lives through fitness."}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-co