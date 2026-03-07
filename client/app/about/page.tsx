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
  Shield,
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
  const trainersRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Fetch gym settings
  const { data: gymSettings, isLoading } = useQuery({
    queryKey: ['gym-settings'],
    queryFn: async () => {
      const response = await gymAPI.getSettings();
      return response.data;
    },
  });

  const facilities = gymSettings?.facilities 
    ? JSON.parse(gymSettings.facilities) 
    : [
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

  const trainers = gymSettings?.trainers 
    ? JSON.parse(gymSettings.trainers) 
    : [];

  const gymPhotos = gymSettings?.gymPhotos 
    ? JSON.parse(gymSettings.gymPhotos) 
    : [];

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

      // Owner section animation
      if (ownerRef.current) {
        gsap.fromTo(
          ownerRef.current.querySelectorAll('.owner-content'),
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
              trigger: ownerRef.current,
              start: 'top 80%',
            },
          }
        );

        gsap.fromTo(
          ownerRef.current.querySelector('.owner-image'),
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: ownerRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Facilities animation
      const facilityCards = document.querySelectorAll('.facility-card');
      if (facilityCards.length > 0) {
        gsap.fromTo(
          facilityCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: facilitiesRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Trainers animation
      const trainerCards = document.querySelectorAll('.trainer-card');
      if (trainerCards.length > 0) {
        gsap.fromTo(
          trainerCards,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: trainersRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Gallery animation
      const galleryImages = document.querySelectorAll('.gallery-image');
      if (galleryImages.length > 0) {
        gsap.fromTo(
          galleryImages,
          { opacity: 0, scale: 0.8, rotation: -5 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Parallax effect on scroll
      gsap.to('.parallax-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [gymSettings]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="parallax-bg absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div ref={heroRef} className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              💪 About Us
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to <span className="text-primary">{gymSettings?.name || 'B Gym International'}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {gymSettings?.aboutDescription || gymSettings?.description || 'Transform your body, transform your life. Join us on your fitness journey.'}
          </p>
          
          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            <Card className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Open Daily</h3>
                <p className="text-sm text-muted-foreground">
                  {gymSettings?.morningTiming?.split(' - ')[0]} - {gymSettings?.eveningTiming?.split(' - ')[1]}
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Location</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {gymSettings?.address || 'Visit us today'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                <p className="text-sm text-muted-foreground">
                  {gymSettings?.phone || '+91-XXXXXXXXXX'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">
                  {gymSettings?.email || 'info@gym.com'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Owner/Founder Section */}
      {(gymSettings?.ownerName || gymSettings?.ownerMessage) && (
        <section ref={ownerRef} className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="owner-content space-y-6">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Meet Our Founder
                  </span>
                </div>
                <h2 className="owner-content text-4xl font-bold text-foreground">
                  {gymSettings?.ownerName || 'Our Founder'}
                </h2>
                <p className="owner-content text-lg text-muted-foreground leading-relaxed">
                  {gymSettings?.ownerMessage || 'Dedicated to helping you achieve your fitness goals and transform your life through health and wellness.'}
                </p>
                <div className="owner-content flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Certified Trainer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Passionate Coach</span>
                  </div>
                </div>
              </div>
              
              <div className="owner-image">
                {gymSettings?.ownerPhoto ? (
                  <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${gymSettings.ownerPhoto}`}
                      alt={gymSettings.ownerName || 'Owner'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-96 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Users className="w-24 h-24 text-primary/30" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Facilities Section */}
      <section ref={facilitiesRef} className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center space-x-2">
                <Dumbbell className="w-4 h-4" />
                <span>Our Facilities</span>
              </span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              World-Class <span className="text-primary">Equipment</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              State-of-the-art facilities designed to help you reach your fitness goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {facilities.map((facility: string, index: number) => (
              <Card 
                key={index}
                className="facility-card border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{facility}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      {trainers.length > 0 && (
        <section ref={trainersRef} className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Our Team</span>
                </span>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Expert <span className="text-primary">Trainers</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Certified professionals dedicated to your success
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {trainers.map((trainer: any, index: number) => (
                <Card 
                  key={index}
                  className="trainer-card border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    {trainer.photo ? (
                      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}${trainer.photo}`}
                          alt={trainer.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Users className="w-16 h-16 text-primary/30" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-foreground mb-2">{trainer.name}</h3>
                    <p className="text-primary font-medium mb-3">{trainer.specialization}</p>
                    {trainer.experience && (
                      <p className="text-sm text-muted-foreground">{trainer.experience} years experience</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Photo Section */}
      {gymSettings?.teamPhoto && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Our <span className="text-primary">Team</span>
              </h2>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${gymSettings.teamPhoto}`}
                alt="Our Team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {gymPhotos.length > 0 && (
        <section ref={galleryRef} className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Gallery</span>
                </span>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Our <span className="text-primary">Gym</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Take a virtual tour of our state-of-the-art facility
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {gymPhotos.map((photo: string, index: number) => (
                <div 
                  key={index}
                  className="gallery-image relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer group"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${photo}`}
                    alt={`Gym photo ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
