'use client';

import { motion } from 'framer-motion';
import Scene3D from '@/components/landing/scene-3d';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Side: 3D Visualization */}
      <div className="relative hidden w-full items-center justify-center bg-secondary/30 lg:flex lg:w-1/2">
        <div className="absolute inset-0 z-0">
          <Scene3D />
        </div>
        <div className="relative z-10 w-full max-w-md p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
              <div className="h-6 w-6 rounded-full bg-background" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 block lg:hidden">
             <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-foreground" />
                <span className="text-xl font-bold tracking-tight">MaintenanceOps</span>
             </Link>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
