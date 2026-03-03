'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  Dumbbell, 
  Users, 
  Trophy, 
  Clock, 
  Star,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import Hero from '@/components/Hero';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      const heroTitle = document.querySelector('.hero-title');
      const heroSubtitle = document.querySelector('.hero-subtitle');
      const heroButtons = document.querySelector('.hero-buttons');
      
      if (heroTitle) {
        gsap.fromTo(heroTitle, 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );
      }
      
      if (heroSubtitle) {
        gsap.fromTo(heroSubtitle, 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
        );
      }
      
      if (heroButtons) {
        gsap.fromTo(heroButtons, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power3.out' }
        );
      }

      // Features animation
      const featureCards = document.querySelectorAll('.feature-card');
      if (featureCards.length > 0) {
        gsap.fromTo(featureCards, 
          { opacity: 0, y: 50, scale: 0.9 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      // Plans animation
      const planCards = document.querySelectorAll('.plan-card');
      if (planCards.length > 0) {
        gsap.fromTo(planCards, 
          { opacity: 0, x: -50 },
          { 
            opacity: 1, 
            x: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: plansRef.current,
              start: 'top 80%',
            }
          }
        );
      }

    }, [heroRef, featuresRef, plansRef]);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Dumbbell,
      title: 'Premium Equipment',
      description: 'State-of-the-art fitness equipment from leading brands'
    },
    {
      icon: Users,
      title: 'Expert Trainers',
      description: 'Certified personal trainers to guide your fitness journey'
    },
    {
      icon: Trophy,
      title: 'Proven Results',
      description: 'Track your progress with our advanced monitoring system'
    },
    {
      icon: Clock,
      title: '24/7 Access',
      description: 'Work out on your schedule with round-the-clock access'
    }
  ];

  const plans = [
    {
      name: 'Basic',
      price: '₹2,999',
      duration: 'per month',
      features: [
        'Gym access during peak hours',
        'Basic equipment usage',
        'Locker facility',
        'Free fitness assessment'
      ]
    },
    {
      name: 'Premium',
      price: '₹4,999',
      duration: 'per month',
      features: [
        '24/7 gym access',
        'All equipment access',
        'Personal trainer (2 sessions)',
        'Nutrition consultation',
        'Steam & sauna access'
      ],
      popular: true
    },
    {
      name: 'Elite',
      price: '₹7,999',
      duration: 'per month',
      features: [
        'All Premium features',
        'Unlimited personal training',
        'Custom meal plans',
        'Priority booking',
        'Guest passes (2 per month)'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">B Gym Internationals</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#plans" className="text-muted-foreground hover:text-primary transition-colors">Plans</a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary hover:bg-primary/90">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero/>
      <section ref={heroRef} className="pt-20 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="hero-title text-5xl md:text-7xl font-bold text-foreground mb-6">
              Transform Your
              <span className="text-primary block">Fitness Journey</span>
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience premium fitness with state-of-the-art equipment, expert trainers, 
              and personalized workout plans at B Gym Internationals.
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10">
                View Plans
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose B Gym?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to achieve your fitness goals in a premium environment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" ref={plansRef} className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible membership options designed to fit your lifestyle and fitness goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`plan-card relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'} hover:shadow-xl transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-primary">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.duration}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
                    size="lg"
                  >
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Get In Touch</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to start your fitness journey? Contact us today for a free consultation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Phone</h3>
                <p className="text-muted-foreground">+91-XXXXXXXXXX</p>
              </CardContent>
            </Card>
            
            <Card className="border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground">info@bgym.com</p>
              </CardContent>
            </Card>
            
            <Card className="border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Location</h3>
                <p className="text-muted-foreground">Your Gym Address Here</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Dumbbell className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-foreground">B Gym Internationals</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Transform your fitness journey with premium equipment and expert guidance.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            © 2024 B Gym Internationals. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}