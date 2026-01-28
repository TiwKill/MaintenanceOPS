'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import NotFoundScene from './not-found-scene';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFoundHero() {
    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 pt-20">
            <NotFoundScene />

            <div className="container relative z-10 mx-auto flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="mb-4 inline-block rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium tracking-wider uppercase backdrop-blur-sm text-destructive">
                        404 Error
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl text-6xl font-bold tracking-tight sm:text-8xl lg:text-9xl"
                >
                    Lost in <br />
                    <span className="text-muted-foreground">the Void</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
                >
                    The page you are looking for has drifted beyond our operational reach.
                    Let&apos;s get you back to safety.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-10"
                >
                    <Button asChild size="lg" className="h-12 rounded-full px-8 text-base">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return Home
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
