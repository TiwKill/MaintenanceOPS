'use client';

import PageShell from '@/components/dashboard/shared/page-shell';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Cloud, 
    RefreshCcw, 
    Link2, 
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    Search
} from 'lucide-react';
import { integrations } from '@/data/settings';

export default function IntegrationsPage() {
    return (
        <PageShell 
            title="Integrations" 
            description="Connect MaintenanceOps with your existing industrial IoT, ERP, and communication tools." 
            breadcrumbs={[{ label: "Settings", href: "/dashboard/settings" }, { label: "Integrations" }]}
            actions={
                <Button className="rounded-xl h-11">
                    Discover Apps
                </Button>
            }
        >
            <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input className="w-full bg-background/50 border border-border/50 rounded-xl h-11 pl-10 pr-4 text-sm focus:outline-none" placeholder="Search marketplace..." />
                </div>
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500" /> 3 Active</div>
                    <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-rose-500" /> 1 Disconnected</div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {integrations.map((app, idx) => (
                    <Card key={idx} className="rounded-[2.5rem] border-border/50 bg-background/50 p-8 flex flex-col justify-between hover:border-border transition-all group overflow-hidden relative">
                        <div>
                            <div className="flex justify-between items-start mb-8">
                                <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform duration-500">
                                    <Cloud className="h-8 w-8" />
                                </div>
                                <Badge variant={app.status === 'Connected' ? 'outline' : 'destructive'} className="rounded-full px-4 py-1 border-none bg-secondary/80">
                                    {app.status === 'Connected' ? <CheckCircle2 className="h-3 w-3 mr-2 text-emerald-500" /> : <XCircle className="h-3 w-3 mr-2 text-rose-500" />}
                                    {app.status}
                                </Badge>
                            </div>
                            <h3 className="text-xl font-extrabold tracking-tight mb-1">{app.name}</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{app.type}</p>
                        </div>
                        
                        <div className="mt-10 flex items-center justify-between border-t border-border/50 pt-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Last Sync</span>
                                <span className="text-sm font-semibold flex items-center gap-1.5 mt-0.5">
                                    <RefreshCcw className="h-3 w-3 text-muted-foreground" />
                                    {app.lastSync}
                                </span>
                            </div>
                            <Button variant="ghost" className="h-12 w-12 rounded-full"><ArrowUpRight className="h-5 w-5" /></Button>
                        </div>

                        {app.status === 'Connected' && (
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-40" />
                        )}
                    </Card>
                ))}

                <Card className="rounded-[2.5rem] border-2 border-dashed border-border/50 bg-secondary/5 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-secondary/10 hover:border-border transition-all">
                    <div className="h-16 w-16 rounded-full bg-background shadow-lg flex items-center justify-center mb-6">
                        <Link2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold">Request Native Connector</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-[200px]">Don't see your ERP? Our team can build it.</p>
                </Card>
            </div>
        </PageShell>
    );
}
