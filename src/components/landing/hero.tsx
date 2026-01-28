'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Scene3D from './scene-3d';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-4 pt-20">
            <Scene3D />

            <div className="container relative z-10 mx-auto flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="mb-4 inline-block rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium tracking-wider uppercase backdrop-blur-sm">
                        Introducing MaintenanceOps
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
                >
                    Streamlining <br />
                    <span className="text-muted-foreground">Modern Operations</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
                >
                    Experience the next generation of infrastructure maintenance.
                    Clean, minimal, and built for high-performance teams.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-10 flex flex-col gap-4 sm:flex-row"
                >
                    <Button size="lg" className="h-12 rounded-full px-8 text-base">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 rounded-full px-8 text-base">
                        View Documentation
                    </Button>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Scroll to explore</span>
                    <div className="h-12 w-[1px] bg-gradient-to-b from-muted-foreground/50 to-transparent" />
                </div>
            </motion.div>
        </section>
    );
}
