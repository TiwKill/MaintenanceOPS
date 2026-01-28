'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Zap, 
    Shield, 
    Activity, 
    ArrowUpRight, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    Plus,
    Loader2
} from 'lucide-react';
import DashboardScene from './dashboard-scene';
import { analyticsService } from '@/services/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const kpis = [
    { title: "MTTR", value: "2.4h", description: "Mean Time To Repair", icon: Clock, trend: "-12%" },
    { title: "MTBF", value: "482h", description: "Mean Time Between Failure", icon: Activity, trend: "+5%" },
    { title: "Completion", value: "94.2%", description: "PM Completion Rate", icon: CheckCircle2, trend: "+2%" },
    { title: "Safety", value: "100%", description: "Accident-free Days", icon: Shield, trend: "0%" },
];

const recentActivity = [
    { id: 1, type: "Breakdown", machine: "CNC-01", status: "In Progress", priority: "Critical", time: "2h ago" },
    { id: 2, type: "PM", machine: "Hydraulic Pump", status: "Scheduled", priority: "Medium", time: "Tomorrow" },
    { id: 3, type: "Audit", machine: "Main Conveyor", status: "Completed", priority: "Low", time: "5h ago" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

export default function DashboardOverview() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await analyticsService.getOverview();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch overview stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const displayKpis = (stats && stats.active_work_orders !== undefined) ? [
        { title: "MTTR", value: stats.mttr || "0h", description: "Mean Time To Repair", icon: Clock, trend: "-12%" },
        { title: "MTBF", value: stats.mtbf || "0h", description: "Mean Time Between Failure", icon: Activity, trend: "+5%" },
        { title: "Active Orders", value: stats.active_work_orders?.toString() || "0", description: "Ongoing maintenance", icon: CheckCircle2, trend: "+2%" },
        { title: "Critical Assets", value: stats.critical_assets?.toString() || "0", description: "Immediate attention", icon: Shield, trend: "0%" },
    ] : kpis;

    return (
        <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto">
            {/* Hero / Header Section */}
            <header className="relative overflow-hidden rounded-[2.5rem] bg-secondary/30 p-12 border border-border/50">
                <DashboardScene />
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Badge variant="outline" className="mb-4 rounded-full border-border bg-background/50 backdrop-blur-sm px-4 py-1">
                                Operational Status: Normal
                            </Badge>
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold tracking-tight"
                        >
                            Industrial Intelligence <br />
                            <span className="text-muted-foreground font-medium italic">Dashboard</span>
                        </motion.h1>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <Button size="lg" className="rounded-2xl h-14 px-8 text-base shadow-xl" onClick={() => router.push('/dashboard/operations/work-orders')}>
                            <Plus className="mr-2 h-5 w-5" />
                            New Work Order
                        </Button>
                    </motion.div>
                </div>
            </header>

            {/* KPI Grid */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
                {displayKpis.map((kpi, idx) => (
                    <motion.div key={idx} variants={itemVariants}>
                        <Card className="rounded-[2rem] border-border/50 bg-background hover:border-border transition-all hover:shadow-lg group">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
                                    {kpi.title}
                                </CardTitle>
                                <kpi.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight">{kpi.value}</div>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    {kpi.description}
                                    <span className={kpi.trend.startsWith('+') ? "text-emerald-500 font-medium" : kpi.trend === "0%" ? "text-muted-foreground" : "text-rose-500 font-medium ml-1"}>
                                        {kpi.trend}
                                    </span>
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Sections Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Visual / Activity Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-bold tracking-tight">System Reliability</h2>
                        <Button variant="ghost" size="sm" className="rounded-full">
                            View details <ArrowUpRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                    <Card className="rounded-[2.5rem] border-border/50 bg-secondary/10 p-4 aspect-[21/9] flex items-center justify-center relative overflow-hidden">
                         <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/50 to-transparent z-0" />
                         <div className="relative z-10 w-full px-8 flex flex-col items-center">
                            {/* Mock Graph Visual */}
                            <div className="w-full flex items-end gap-2 h-32">
                                {[40, 60, 45, 70, 85, 60, 90, 75, 95, 80].map((h, i) => (
                                    <div key={i} className="flex-1 bg-foreground/10 rounded-t-xl group relative">
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="bg-foreground rounded-t-xl w-full"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 grid grid-cols-2 gap-12 text-center w-full">
                                <div>
                                    <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Downtime</div>
                                    <div className="text-2xl font-bold">1.2%</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">OEE</div>
                                    <div className="text-2xl font-bold text-emerald-600">89.4%</div>
                                </div>
                            </div>
                         </div>
                    </Card>
                </motion.div>

                {/* Recent Items Sidebar */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <h2 className="text-2xl font-bold tracking-tight px-2">Recent Events</h2>
                    <div className="space-y-4">
                        {recentActivity.map((event) => (
                            <Card key={event.id} className="rounded-3xl border-border/50 bg-background p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-semibold">{event.machine}</h4>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{event.type}</p>
                                    </div>
                                    <Badge variant={event.priority === "Critical" ? "destructive" : "secondary"} className="rounded-full px-3">
                                        {event.priority}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between border-t pt-4 border-border/50">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full ${
                                            event.status === "Completed" ? "bg-emerald-500" : 
                                            event.status === "In Progress" ? "bg-amber-500" : "bg-blue-500"
                                        }`} />
                                        <span className="text-sm font-medium">{event.status}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{event.time}</span>
                                </div>
                            </Card>
                        ))}
                        <Button variant="ghost" className="w-full rounded-2xl h-12 text-muted-foreground">
                            View All Events
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
