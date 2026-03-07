'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin } from 'lucide-react';
import { gymAPI } from '@/lib/api';

export default function Contact() {
  const [gymSettings, setGymSettings] = useState<any>(null);

  useEffect(() => {
    const fetchGymSettings = async () => {
      try {
        const response = await gymAPI.getSettings();
        setGymSettings(response.data);
      } catch (error) {
        console.error('Error fetching gym settings:', error);
        // Use default values if fetch fails
        setGymSettings({
          name: 'B Gym International',
          phone: '+91-7903906436',
          email: 'info@bgym.com',
          address: 'Your Gym Address Here'
        });
      }
    };

    fetchGymSettings();
  }, []);

  if (!gymSettings) {
    return null; // or a loading skeleton
  }

  return (
    <section id="contact" className="py-20 px-4 bg-muted/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Contact Us
            </span>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your fitness journey? Contact us today for a free consultation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                Phone
              </h3>
              <p className="text-muted-foreground">{gymSettings.phone || 'Not available'}</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                Email
              </h3>
              <p className="text-muted-foreground">{gymSettings.email || 'Not available'}</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                Location
              </h3>
              <p className="text-muted-foreground">{gymSettings.address || 'Not available'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}