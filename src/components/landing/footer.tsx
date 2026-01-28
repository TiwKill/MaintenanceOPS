'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-border bg-background py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-foreground" />
                        <span className="font-bold tracking-tight">MaintenanceOps</span>
                    </div>

                    <nav className="flex gap-8">
                        <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">About</Link>
                        <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Products</Link>
                        <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Privacy</Link>
                        <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Terms</Link>
                    </nav>

                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} MaintenanceOps. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
