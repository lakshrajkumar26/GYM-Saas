'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { portfolioAPI } from '@/lib/api';
import { 
  Image as ImageIcon,
  Video,
  FileText,
  ArrowRight,
  X,
  Play
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioPage() {
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const portfolioRef = useRef<HTMLDivElement>(null);

  // Fetch published portfolio items
  const { data: items, isLoading } = useQuery({
    queryKey: ['portfolio-public'],
    queryFn: async () => {
      const response = await portfolioAPI.getPublished();
      return response.data;
    },
  });

  useEffect(() => {
    if (!items || items.length === 0) return;

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo('.portfolio-hero',
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0,
          duration: 1,
          ease: 'power3.out'
        }
      );

      // Section tabs animation
      gsap.fromTo('.section-tab',
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power2.out'
        }
      );

      // Portfolio items animation with ScrollTrigger
      const portfolioItems = document.querySelectorAll('.portfolio-item');
      portfolioItems.forEach((item, index) => {
        gsap.fromTo(item,
          { 
            opacity: 0, 
            y: 60,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom-=100',
              end: 'top center',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Hover animation
        item.addEventListener('mouseenter', () => {
          gsap.to(item, {
            y: -10,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        item.addEventListener('mouseleave', () => {
          gsap.to(item, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });

      // Parallax effect for images
      const images = document.querySelectorAll('.portfolio-image');
      images.forEach((img) => {
        gsap.to(img, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      });

    }, portfolioRef);

    return () => ctx.revert();
  }, [items, selectedSection]);

  const sections = [
    { id: 'ALL', label: 'All' },
    { id: 'GALLERY', label: 'Gallery' },
    { id: 'SUCCESS_STORIES', label: 'Success Stories' },
    { id: 'WORKOUTS', label: 'Workouts' },
    { id: 'NUTRITION', label: 'Nutrition' },
    { id: 'TIPS', label: 'Tips & Tricks' },
    { id: 'EVENTS', label: 'Events' }
  ];

  const filteredItems = items?.filter((item: any) => 
    selectedSection === 'ALL' || item.section === selectedSection
  );

  const openModal = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE': return ImageIcon;
      case 'VIDEO': return Video;
      case 'BLOG': return FileText;
      default: return FileText;
    }
  };

  return (
    <div ref={portfolioRef} className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="portfolio-hero relative py-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Our <span className="text-primary">Portfolio</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore our journey, success stories, workout tips, and everything that makes our gym community special
            </p>
          </div>
        </div>
      </section>

      {/* Section Tabs */}
      <section className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-4 px-4">
        <div className="container mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`section-tab px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedSection === section.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredItems && filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item: any, index: number) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <Card 
                    key={item.id} 
                    className="portfolio-item border-border overflow-hidden cursor-pointer group"
                    onClick={() => openModal(item)}
                  >
                    <CardContent className="p-0">
                      {/* Media Container */}
                      <div className="relative h-64 overflow-hidden bg-muted">
                        {item.type === 'IMAGE' && item.mediaUrl && (
                          <img 
                            src={`http://localhost:5000${item.mediaUrl}`} 
                            alt={item.title}
                            className="portfolio-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}
                        {item.type === 'VIDEO' && item.thumbnailUrl && (
                          <>
                            <img 
                              src={`http://localhost:5000${item.thumbnailUrl}`} 
                              alt={item.title}
                              className="portfolio-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 text-white ml-1" />
                              </div>
                            </div>
                          </>
                        )}
                        {item.type === 'BLOG' && (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            <FileText className="w-20 h-20 text-primary opacity-50" />
                          </div>
                        )}
                        
                        {/* Type Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-sm flex items-center">
                            <Icon className="w-3 h-3 mr-1" />
                            {item.type}
                          </span>
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {item.section && (
                          <span className="text-xs text-primary font-medium mb-2 block">
                            {item.section.replace('_', ' ')}
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-muted-foreground line-clamp-2 mb-4">
                            {item.description}
                          </p>
                        )}
                        <Button 
                          variant="ghost" 
                          className="text-primary hover:text-primary/80 hover:bg-primary/10 p-0 h-auto font-medium group/btn"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground">
                {selectedSection === 'ALL' 
                  ? 'No portfolio items available yet.'
                  : `No items in ${selectedSection.replace('_', ' ')} section.`
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Media */}
            {selectedItem.type === 'IMAGE' && selectedItem.mediaUrl && (
              <img 
                src={`http://localhost:5000${selectedItem.mediaUrl}`} 
                alt={selectedItem.title}
                className="w-full max-h-96 object-cover"
              />
            )}
            {selectedItem.type === 'VIDEO' && selectedItem.mediaUrl && (
              <video 
                src={`http://localhost:5000${selectedItem.mediaUrl}`}
                controls
                className="w-full max-h-96"
              />
            )}

            {/* Content */}
            <div className="p-8">
              {selectedItem.section && (
                <span className="text-sm text-primary font-medium mb-2 block">
                  {selectedItem.section.replace('_', ' ')}
                </span>
              )}
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {selectedItem.title}
              </h2>
              {selectedItem.description && (
                <p className="text-lg text-muted-foreground mb-6">
                  {selectedItem.description}
                </p>
              )}
              {selectedItem.content && (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{selectedItem.content}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
