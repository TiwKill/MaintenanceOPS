'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { multipothService, PublicService } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import * as LucideIcons from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function Ecosystem() {
  const [services, setServices] = useState<PublicService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await multipothService.getPublicServices();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch public services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <section className="bg-background py-24 sm:py-32 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">
            Unified Ecosystem
          </h2>
          <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Part of the MultiPoth Network.
          </h3>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Maintenance Ops integrates seamlessly with other specialized services in our industrial automation ecosystem.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            // Dynamically get icon component
            const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Layers;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-8 rounded-3xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-all"
              >
                <div className="mb-6 h-12 w-12 rounded-2xl bg-background flex items-center justify-center border border-border group-hover:scale-110 transition-transform">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">{service.title}</h4>
                    <div className={`h-2 w-2 rounded-full ${
                      service.status === 'online' ? 'bg-emerald-500' : 
                      service.status === 'maintenance' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.subTitle}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] uppercase tracking-wider bg-background/50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
