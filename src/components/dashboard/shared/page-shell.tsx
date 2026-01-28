'use client';

import { motion } from 'framer-motion';
import { 
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbList, 
    BreadcrumbPage, 
    BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ReactNode } from 'react';

interface PageShellProps {
    title: string;
    description?: string;
    breadcrumbs: { label: string; href?: string }[];
    children: ReactNode;
    actions?: ReactNode;
}

export default function PageShell({ title, description, breadcrumbs, children, actions }: PageShellProps) {
    return (
        <div className="flex flex-col min-h-screen bg-background/50">
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 px-8 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/50 backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground">
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {breadcrumbs.map((crumb, idx) => (
                                <React.Fragment key={idx}>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        {crumb.href ? (
                                            <BreadcrumbLink href={crumb.href} className="text-muted-foreground hover:text-foreground">
                                                {crumb.label}
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage className="font-semibold">{crumb.label}</BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            
            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-[1600px] mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                            {description && <p className="text-muted-foreground mt-1">{description}</p>}
                        </motion.div>
                        {actions && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex gap-2 w-full md:w-auto"
                            >
                                {actions}
                            </motion.div>
                        )}
                    </div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

import * as React from 'react';
