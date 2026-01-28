'use client';

import PageShell from '@/components/dashboard/shared/page-shell';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    GitBranch, 
    Zap, 
    Play, 
    Settings, 
    ChevronRight,
    Search,
    Plus
} from 'lucide-react';
import { workflows } from '@/data/settings';
import { motion } from 'framer-motion';

export default function WorkflowsPage() {
    return (
        <PageShell 
            title="Automation Workflows" 
            description="Configure automated approval processes and notification triggers." 
            breadcrumbs={[{ label: "Settings", href: "/dashboard/settings" }, { label: "Workflows" }]}
            actions={
                <Button className="rounded-xl h-11 shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> Create Workflow
                </Button>
            }
        >
            <div className="flex justify-between items-center mb-10">
                <div className="flex gap-4">
                    <Button variant="ghost" className="rounded-full h-10 px-6 font-bold bg-foreground text-background">Active</Button>
                    <Button variant="ghost" className="rounded-full h-10 px-6 font-bold text-muted-foreground">Drafts</Button>
                    <Button variant="ghost" className="rounded-full h-10 px-6 font-bold text-muted-foreground">Archived</Button>
                </div>
            </div>

            <div className="space-y-6">
                {workflows.map((flow, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="rounded-[2.5rem] border-border/50 bg-background/50 p-8 flex items-center justify-between hover:border-border transition-all cursor-pointer group">
                            <div className="flex items-center gap-8">
                                <div className="h-16 w-16 rounded-[2rem] bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors duration-500">
                                    <GitBranch className="h-8 w-8" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-extrabold tracking-tight">{flow.name}</h3>
                                        <Badge variant="outline" className="rounded-full bg-emerald-500/10 text-emerald-600 border-none px-3 font-bold text-[10px]">ACTIVE</Badge>
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground tracking-tight">Trigger: <span className="text-foreground font-bold">{flow.trigger}</span></p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-12">
                                <div className="hidden md:flex flex-col items-center">
                                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Workflow Steps</span>
                                    <div className="flex gap-1.5 mt-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className={`h-1.5 w-6 rounded-full ${i < flow.steps ? 'bg-foreground' : 'bg-secondary'}`} />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full border border-border/50"><Play className="h-5 w-5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full border border-border/50"><Settings className="h-5 w-5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full"><ChevronRight className="h-6 w-6" /></Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}

                <Card className="rounded-[2.5rem] border-2 border-dashed border-border/50 bg-secondary/5 p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-secondary/10 transition-all">
                    <div className="h-20 w-20 rounded-[2.5rem] bg-background shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Zap className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold">New Notification Trigger</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                        Automatically alert technicians via Slack/Email when critical assets show high vibration indices.
                    </p>
                </Card>
            </div>
        </PageShell>
    );
}
