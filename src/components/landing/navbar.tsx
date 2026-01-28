'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300",
                isScrolled ? "bg-background/80 py-4 backdrop-blur-md border-b border-border" : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto flex items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-foreground" />
                    <span className="text-xl font-bold tracking-tight">MaintenanceOps</span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    <Link href="#features" className="text-sm font-medium transition-colors hover:text-foreground/70">Features</Link>
                    <Link href="#technology" className="text-sm font-medium transition-colors hover:text-foreground/70">Technology</Link>
                    <Link href="#showcase" className="text-sm font-medium transition-colors hover:text-foreground/70">Showcase</Link>
                    <Button variant="ghost" className="rounded-full px-6" onClick={() => window.location.href = "/auth/login"} >Login</Button>
                    <Button className="rounded-full px-6" onClick={() => window.location.href = "/auth/register"}>Get Started</Button>
                </nav>

                <Button variant="outline" className="md:hidden">Menu</Button>
            </div>
        </motion.header>
    );
}
