'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function CTA() {
    return (
        <section className="bg-background py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden rounded-[3rem] bg-foreground px-8 py-20 text-center text-background sm:px-20 sm:py-32"
                >
                    <div className="relative z-10 flex flex-col items-center">
                        <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
                            Ready to modernize <br /> your operations?
                        </h2>
                        <p className="mt-6 max-w-xl text-lg text-background/80">
                            Join the leading teams already using MaintenanceOps to streamline their
                            infrastructure and improve reliability.
                        </p>
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <Button size="lg" className="h-12 rounded-full bg-background px-8 text-base text-foreground hover:bg-background/90">
                                Get Started Now
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 rounded-full border-background/20 bg-transparent px-8 text-base text-background hover:bg-background/10">
                                Contact Sales
                            </Button>
                        </div>
                    </div>

                    {/* Subtle background circle decorations */}
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-background/5 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-background/5 blur-3xl" />
                </motion.div>
            </div>
        </section>
    );
}
