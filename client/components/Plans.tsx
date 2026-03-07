'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';
import { planAPI } from '@/lib/api';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Default plans (fallback if no plans in backend)
const defaultPlans = [
  {
    name: 'Basic',
    price: 2999,
    duration: 30,
    features: [
      'Gym access during peak hours',
      'Basic equipment usage',
      'Locker facility',
      'Free fitness assessment',
    ],
  },
  {
    name: 'Premium',
    price: 4999,
    duration: 30,
    features: [
      '24/7 gym access',
      'All equipment access',
      'Personal trainer (2 sessions)',
      'Nutrition consultation',
      'Steam & sauna access',
    ],
    popular: true,
  },
  {
    name: 'Elite',
    price: 7999,
    duration: 30,
    features: [
      'All Premium features',
      'Unlimited personal training',
      'Custom meal plans',
      'Priority booking',
      'Guest passes (2 per month)',
    ],
  },
];

export default function Plans() {
  const plansRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch plans from backend
  const { data: backendPlans, isLoading } = useQuery({
    queryKey: ['public-plans'],
    queryFn: async () => {
      try {
        const response = await planAPI.getAll();
        return response.data;
      } catch (error) {
        console.error('Error fetching plans:', error);
        return [];
      }
    },
  });

  // Use backend plans if available, otherwise use default plans
  const plans = backendPlans && backendPlans.length > 0 ? backendPlans : defaultPlans;

  // Mark middle plan as popular if using backend plans
  const displayPlans = plans.map((plan: any, index: number) => ({
    ...plan,
    popular: backendPlans && backendPlans.length > 0 
      ? index === Math.floor(plans.length / 2) // Middle plan
      : plan.popular,
  }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const planCards = document.querySelectorAll('.plan-card');
      if (planCards.length > 0) {
        gsap.fromTo(
          planCards,
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
            },
          }
        );
      }

      // Animate discount badges
      badgeRefs.current.forEach((badge) => {
        if (badge) {
          gsap.fromTo(
            badge,
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: badge,
                start: 'top 90%',
              },
            }
          );

          // Pulse animation for discount badges
          gsap.to(badge, {
            scale: 1.05,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
      });
    }, plansRef);

    return () => ctx.revert();
  }, [plans]);

  // Helper function to get plan features
  const getPlanFeatures = (plan: any) => {
    // If plan has features array, use it
    if (plan.features && Array.isArray(plan.features)) {
      return plan.features;
    }
    
    // Otherwise, generate default features based on plan name
    const baseFeatures = [
      'Gym access',
      'Equipment usage',
      'Locker facility',
      'Fitness assessment',
    ];
    
    if (plan.name?.toLowerCase().includes('premium')) {
      return [
        '24/7 gym access',
        'All equipment access',
        'Personal trainer sessions',
        'Nutrition consultation',
        'Steam & sauna access',
      ];
    } else if (plan.name?.toLowerCase().includes('elite')) {
      return [
        'All Premium features',
        'Unlimited personal training',
        'Custom meal plans',
        'Priority booking',
        'Guest passes',
      ];
    }
    
    return baseFeatures;
  };

  if (isLoading) {
    return (
      <section id="plans" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Choose Your <span className="text-primary">Plan</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border animate-pulse">
                <CardContent className="p-8">
                  <div className="h-64 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="plans" ref={plansRef} className="py-20 px-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Pricing Plans
            </span>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Choose Your <span className="text-primary">Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Flexible membership options designed to fit your lifestyle and fitness goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayPlans.map((plan: any, index: number) => {
            const hasDiscount = plan.discountPrice && plan.discountPrice < plan.price;
            const discountPercentage = hasDiscount 
              ? Math.round(((plan.price - plan.discountPrice) / plan.price) * 100)
              : 0;
            const displayPrice = hasDiscount ? plan.discountPrice : plan.price;

            return (
              <Card
                key={plan.id || index}
                className={`plan-card relative ${
                  plan.popular
                    ? 'border-primary shadow-xl shadow-primary/20 scale-105'
                    : 'border-border hover:border-primary/50'
                } hover:shadow-xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-red-600 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium flex items-center space-x-1 shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}
                
                {hasDiscount && (
                  <div 
                    ref={(el) => { badgeRefs.current[index] = el; }}
                    className="absolute -top-4 right-4"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-red-600 rounded-full blur-md opacity-75" />
                      <span className="relative bg-gradient-to-r from-primary to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
                        <Sparkles className="w-4 h-4" />
                        <span>{discountPercentage}% OFF</span>
                      </span>
                    </div>
                  </div>
                )}

                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    
                    {hasDiscount && (
                      <div className="mb-2">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full animate-pulse">
                          🔥 Limited Time Offer
                        </span>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      {hasDiscount ? (
                        <div className="space-y-1">
                          <div className="text-2xl line-through text-muted-foreground/60">
                            ₹{typeof plan.price === 'number' ? plan.price.toLocaleString() : plan.price}
                          </div>
                          <div className="flex items-center justify-center">
                            <span className="text-5xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                              ₹{typeof displayPrice === 'number' ? displayPrice.toLocaleString() : displayPrice}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-5xl font-bold text-primary">
                          ₹{typeof displayPrice === 'number' ? displayPrice.toLocaleString() : displayPrice}
                        </span>
                      )}
                      <span className="text-muted-foreground ml-2">
                        / {plan.duration} days
                      </span>
                    </div>
                    
                    {hasDiscount && (
                      <div className="text-sm text-primary font-medium">
                        Save ₹{(plan.price - plan.discountPrice).toLocaleString()}!
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {getPlanFeatures(plan).map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30'
                        : 'bg-muted hover:bg-muted/80 text-foreground hover:text-primary'
                    }`}
                    size="lg"
                    onClick={() => {
                      // Redirect to register page
                      window.location.href = '/auth/register';
                    }}
                  >
                    {hasDiscount ? 'Grab This Deal' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {backendPlans && backendPlans.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-8">
            Showing default plans. Admin can customize plans from the dashboard.
          </p>
        )}

        {/* Explore All Plans Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white shadow-xl shadow-primary/30 px-8"
            onClick={() => window.location.href = '/pricing'}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Explore All Plans & Pricing
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            View detailed pricing for Gym, Cardio, and special packages
          </p>
        </div>
      </div>
    </section>
  );
}
