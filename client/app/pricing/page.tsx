'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Sparkles, 
  Clock, 
  DollarSign,
  Dumbbell,
  Heart,
  Zap
} from 'lucide-react';
import { planAPI, gymAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PricingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gymPlansRef = useRef<HTMLDivElement>(null);
  const cardioPlansRef = useRef<HTMLDivElement>(null);
  const chargesRef = useRef<HTMLDivElement>(null);

  // Fetch gym settings
  const { data: gymSettings } = useQuery({
    queryKey: ['gym-settings'],
    queryFn: async () => {
      const response = await gymAPI.getSettings();
      return response.data;
    },
  });

  // Fetch all plans
  const { data: plans, isLoading } = useQuery({
    queryKey: ['all-plans'],
    queryFn: async () => {
      const response = await planAPI.getAll();
      return response.data;
    },
  });

  // Separate plans by type
  const gymPlans = plans?.filter((p: any) => p.planType === 'GYM') || [];
  const cardioPlans = plans?.filter((p: any) => p.planType === 'CARDIO') || [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
          }
        );
      }

      // Plan cards animation
      const allCards = document.querySelectorAll('.pricing-card');
      if (allCards.length > 0) {
        gsap.fromTo(
          allCards,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: gymPlansRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [plans]);

  const getPlanFeatures = (plan: any) => {
    if (plan.features) {
      try {
        return JSON.parse(plan.features);
      } catch {
        return [];
      }
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div ref={heroRef} className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              💪 Complete Pricing Guide
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Choose Your <span className="text-primary">Perfect Plan</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Flexible membership options designed for every fitness goal. No hidden fees, just results.
          </p>
        </div>
      </section>

      {/* Charges Section */}
      <section ref={chargesRef} className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="pricing-card border-primary/20 hover:border-primary/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Admission</h3>
                <p className="text-3xl font-bold text-primary">
                  ₹{gymSettings?.admissionCharge || 600}
                </p>
                <p className="text-sm text-muted-foreground mt-1">One-time fee</p>
              </CardContent>
            </Card>

            <Card className="pricing-card border-primary/20 hover:border-primary/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Monthly</h3>
                <p className="text-3xl font-bold text-primary">
                  ₹{gymSettings?.monthlyCharge || 800}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Per month</p>
              </CardContent>
            </Card>

            <Card className="pricing-card border-primary/20 hover:border-primary/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Morning</h3>
                <p className="text-sm font-semibold text-foreground">
                  {gymSettings?.morningTiming || '6:00 AM - 11:00 AM'}
                </p>
              </CardContent>
            </Card>

            <Card className="pricing-card border-primary/20 hover:border-primary/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Evening</h3>
                <p className="text-sm font-semibold text-foreground">
                  {gymSettings?.eveningTiming || '4:00 PM - 10:00 PM'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gym Membership Plans */}
      <section ref={gymPlansRef} className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center space-x-2">
                <Dumbbell className="w-4 h-4" />
                <span>Gym Membership Plans</span>
              </span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Full Gym <span className="text-primary">Access</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete access to all gym equipment and facilities
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-48 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {gymPlans.map((plan: any, index: number) => {
                const hasDiscount = plan.discountPrice && plan.discountPrice < plan.price;
                const discountPercentage = hasDiscount 
                  ? Math.round(((plan.price - plan.discountPrice) / plan.price) * 100)
                  : 0;
                const displayPrice = hasDiscount ? plan.discountPrice : plan.price;

                return (
                  <Card
                    key={plan.id}
                    className="pricing-card relative border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                  >
                    {hasDiscount && (
                      <div className="absolute -top-3 -right-3 z-10">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary to-red-600 rounded-full blur-md opacity-75" />
                          <span className="relative bg-gradient-to-r from-primary to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
                            <Sparkles className="w-3 h-3" />
                            <span>{discountPercentage}% OFF</span>
                          </span>
                        </div>
                      </div>
                    )}

                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-foreground mb-3">{plan.name}</h3>
                        
                        {hasDiscount && (
                          <div className="mb-2">
                            <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                              🔥 Limited Offer
                            </span>
                          </div>
                        )}
                        
                        <div className="mb-3">
                          {hasDiscount ? (
                            <div className="space-y-1">
                              <div className="text-lg line-through text-muted-foreground/60">
                                ₹{plan.price.toLocaleString()}
                              </div>
                              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                                ₹{displayPrice.toLocaleString()}
                              </div>
                            </div>
                          ) : (
                            <div className="text-3xl font-bold text-primary">
                              ₹{displayPrice.toLocaleString()}
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            {plan.duration} days
                          </p>
                        </div>
                        
                        {hasDiscount && (
                          <div className="text-xs text-primary font-medium">
                            Save ₹{(plan.price - plan.discountPrice).toLocaleString()}
                          </div>
                        )}
                      </div>

                      <ul className="space-y-2 mb-6">
                        {getPlanFeatures(plan).map((feature: string, i: number) => (
                          <li key={i} className="flex items-start text-sm">
                            <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => window.location.href = '/auth/register'}
                      >
                        {hasDiscount ? 'Grab Deal' : 'Choose Plan'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Cardio Plans */}
      <section ref={cardioPlansRef} className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Cardio Plans</span>
              </span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Cardio <span className="text-primary">Packages</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Specialized cardio training with exclusive equipment access
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {cardioPlans.map((plan: any) => {
              const hasDiscount = plan.discountPrice && plan.discountPrice < plan.price;
              const discountPercentage = hasDiscount 
                ? Math.round(((plan.price - plan.discountPrice) / plan.price) * 100)
                : 0;
              const displayPrice = hasDiscount ? plan.discountPrice : plan.price;

              return (
                <Card
                  key={plan.id}
                  className="pricing-card relative border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                >
                  {hasDiscount && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <span className="bg-gradient-to-r from-primary to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {discountPercentage}% OFF
                      </span>
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-foreground mb-3">{plan.name}</h3>
                      
                      <div className="mb-3">
                        {hasDiscount ? (
                          <div className="space-y-1">
                            <div className="text-lg line-through text-muted-foreground/60">
                              ₹{plan.price.toLocaleString()}
                            </div>
                            <div className="text-3xl font-bold text-primary">
                              ₹{displayPrice.toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <div className="text-3xl font-bold text-primary">
                            ₹{displayPrice.toLocaleString()}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          {plan.duration} days
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {getPlanFeatures(plan).map((feature: string, i: number) => (
                        <li key={i} className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => window.location.href = '/auth/register'}
                    >
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
