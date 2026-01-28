'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Shield, Zap, Cpu, Globe, BarChart3 } from 'lucide-react';

const features = [
    {
        title: 'Precision Monitoring',
        description: 'Get real-time insights into your infrastructure with millisecond accuracy.',
        icon: <Zap className="h-6 w-6" />,
    },
    {
        title: 'Secure by Design',
        description: 'Enterprise-grade security protocols built into every layer of the platform.',
        icon: <Shield className="h-6 w-6" />,
    },
    {
        title: 'Universal Scalability',
        description: 'Scale your operations globally without worrying about performance bottlenecks.',
        icon: <Globe className="h-6 w-6" />,
    },
    {
        title: 'Advanced Analytics',
        description: 'Leverage machine learning to predict and prevent system failures.',
        icon: <BarChart3 className="h-6 w-6" />,
    },
    {
        title: 'Cloud Integration',
        description: 'Seamlessly connect with your existing cloud infrastructure and tools.',
        icon: <Layers className="h-6 w-6" />,
    },
    {
        title: 'Edge Computing',
        description: 'Deploy maintenance protocols at the edge for ultra-low latency response.',
        icon: <Cpu className="h-6 w-6" />,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        },
    },
};

export default function Features() {
    return (
        <section className="bg-background py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="mb-20 max-w-2xl">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Engineered for excellence.
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Our platform provides the tools you need to manage complex systems with ease
                        and confidence.
                    </p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="h-full border-border/50 bg-background transition-colors hover:border-border">
                                <CardContent className="flex flex-col p-8">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                                    <p className="mt-3 text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
