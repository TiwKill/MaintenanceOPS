'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function Showcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

    return (
        <section ref={containerRef} className="overflow-hidden bg-background py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="mb-20">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Visualizing the future.
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A interface designed for clarity and speed. No distractions, just performance.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <motion.div style={{ y: y1 }} className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-secondary/50">
                        <Image 
                            src="/analytics-dashboard.png" 
                            alt="Analytics Dashboard" 
                            fill 
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-end p-8">
                            <h4 className="text-xl font-bold">Analytics Dashboard</h4>
                            <p className="text-sm text-foreground/80">Deep visibility into every component.</p>
                        </div>
                    </motion.div>

                    <motion.div style={{ y: y2 }} className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-secondary/50 lg:mt-20">
                         <Image 
                            src="/maintenance-logs.png" 
                            alt="Maintenance Logs" 
                            fill 
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-end p-8">
                            <h4 className="text-xl font-bold">Maintenance Logs</h4>
                            <p className="text-sm text-foreground/80">Automated tracking and auditing.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
