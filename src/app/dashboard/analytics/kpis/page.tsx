'use client';

import PageShell from '@/components/dashboard/shared/page-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Activity, 
    TrendingUp, 
    TrendingDown, 
    Clock, 
    Zap, 
    ShieldCheck, 
    BarChart3,
    ArrowUpRight,
    Download
} from 'lucide-react';
import { motion } from 'framer-motion';

const kpiMetrics = [
    { title: "Equipment Downtime", value: "1.2%", trend: "-0.4%", positive: true, icon: Activity },
    { title: "Average Repair Time", value: "2.4h", trend: "-15%", positive: true, icon: Clock },
    { title: "PM Compliance", value: "98.2%", trend: "+2.1%", positive: true, icon: ShieldCheck },
    { title: "Energy Usage", value: "1,240 kWh", trend: "+4.2%", positive: false, icon: Zap },
];

export default function KPIsPage() {
    return (
        <PageShell 
            title="KPIs & Metrics"
            description="Real-time performance indicators and operational health tracking."
            breadcrumbs={[{ label: "Insights", href: "/dashboard" }, { label: "KPIs & Metrics" }]}
            actions={
                <Button variant="outline" className="rounded-xl h-11">
                    <Download className="mr-2 h-4 w-4" /> Export Report
                </Button>
            }
        >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpiMetrics.map((kpi, idx) => (
                    <Card key={idx} className="rounded-[2rem] border-border/50 bg-background/50 hover:border-border transition-all hover:shadow-lg group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{kpi.title}</CardTitle>
                            <kpi.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight">{kpi.value}</div>
                            <div className={`text-xs mt-2 flex items-center gap-1 font-medium ${kpi.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {kpi.trend.startsWith('+') ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {kpi.trend} from last month
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3 mt-6">
                <Card className="lg:col-span-2 rounded-[2.5rem] border-border/50 bg-secondary/10 overflow-hidden min-h-[400px]">
                    <CardHeader className="p-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl font-bold">Reliability Trends</CardTitle>
                                <p className="text-sm text-muted-foreground">Detailed breakdown of machine uptime across lines.</p>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full"><ArrowUpRight className="h-5 w-5" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 flex flex-col justify-end h-[300px]">
                        <div className="flex items-end gap-3 h-48">
                            {[65, 59, 80, 81, 56, 55, 40, 67, 72, 88, 91, 85].map((h, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.05 }}
                                    className="flex-1 bg-foreground/20 rounded-t-lg hover:bg-foreground/40 transition-colors"
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                            <span>Jul</span>
                            <span>Aug</span>
                            <span>Sep</span>
                            <span>Oct</span>
                            <span>Nov</span>
                            <span>Dec</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-border/50 bg-background/50 p-8 flex flex-col items-center justify-center text-center">
                    <div className="mb-6 rounded-full bg-secondary p-4">
                        <BarChart3 className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold">Top Failure Categories</h3>
                    <p className="text-sm text-muted-foreground mt-2 px-4">
                        Mechanical issues account for 45% of total system downtime this quarter.
                    </p>
                    <div className="mt-8 space-y-4 w-full">
                        {[
                            { label: "Mechanical", value: 45, color: "bg-foreground" },
                            { label: "Electrical", value: 30, color: "bg-muted-foreground" },
                            { label: "Software", value: 15, color: "bg-secondary" },
                            { label: "Other", value: 10, color: "bg-border" },
                        ].map((item, idx) => (
                            <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-medium">
                                    <span>{item.label}</span>
                                    <span>{item.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className={`h-full ${item.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </PageShell>
    );
}
