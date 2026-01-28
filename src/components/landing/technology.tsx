'use client';

import { motion } from 'framer-motion';

const techItems = [
    'React 19', 'Next.js 16', 'Three.js', 'Framer Motion', 'Tailwind v4',
    'TypeScript', 'Radix UI', 'Shadcn UI', 'Cloudflare', 'PostgreSQL'
];

export default function Technology() {
    return (
        <section className="bg-secondary/30 py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground">
                        Built with the latest
                    </h2>
                    <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-8">
                        {techItems.map((tech, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 0.6 }}
                                whileHover={{ opacity: 1, scale: 1.05 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="text-2xl font-bold tracking-tight text-foreground grayscale transition-all hover:grayscale-0 sm:text-3xl lg:text-4xl"
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
