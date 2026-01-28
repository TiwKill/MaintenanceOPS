'use client';

import PageShell from '@/components/dashboard/shared/page-shell';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
    title: string;
    description: string;
    breadcrumbs: { label: string; href?: string }[];
}

export default function PlaceholderPage({ title, description, breadcrumbs }: PlaceholderPageProps) {
    return (
        <PageShell title={title} description={description} breadcrumbs={breadcrumbs}>
            <Card className="rounded-[2.5rem] border-border/50 bg-secondary/10 min-h-[500px] flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 rounded-full bg-background p-8 shadow-xl border border-border/50"
                >
                    <Construction className="h-12 w-12 text-muted-foreground" />
                </motion.div>
                <div className="max-w-md space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">Technical Refinement in Progress</h2>
                    <p className="text-muted-foreground">
                        We are currently optimizing the UI/UX for the <span className="text-foreground font-semibold">{title}</span> module 
                        to ensure it meets our premium performance standards.
                    </p>
                    <div className="pt-8 flex justify-center gap-1">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                className="h-1.5 w-1.5 rounded-full bg-foreground"
                            />
                        ))}
                    </div>
                </div>
            </Card>
        </PageShell>
    );
}
