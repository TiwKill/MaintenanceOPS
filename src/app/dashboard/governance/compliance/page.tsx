'use client';

import PageShell from '@/components/dashboard/shared/page-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    ShieldCheck, 
    FileText, 
    AlertCircle, 
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import { governanceService } from '@/services/api';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CompliancePage() {
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompliance = async () => {
            try {
                const data = await governanceService.getComplianceReport();
                setReports(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch compliance report:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompliance();
    }, []);

    const averageScore = reports.length > 0 
        ? Math.round(reports.reduce((acc, curr) => acc + (curr.score || 0), 0) / reports.length)
        : 0;

    return (
        <PageShell 
            title="Compliance & Standards" 
            description="Track adherence to factory regulations and ISO certifications." 
            breadcrumbs={[{ label: "Governance", href: "/dashboard/governance" }, { label: "Compliance" }]}
        >
            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="rounded-[2.5rem] border-border/50 bg-background/50 p-8 flex flex-col justify-center items-center text-center">
                    <div className="h-24 w-24 rounded-full border-8 border-emerald-500/20 flex items-center justify-center relative mb-6">
                        <motion.div 
                            initial={{ rotate: -90 }}
                            animate={{ rotate: 270 }}
                            transition={{ duration: 1.5 }}
                            className="absolute inset-x-0 inset-y-0 text-3xl font-extrabold flex items-center justify-center"
                        >
                            {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : `${averageScore}%`}
                        </motion.div>
                    </div>
                    <h3 className="text-xl font-bold">Overall Rating</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        {averageScore >= 90 ? 'Excellent' : averageScore >= 70 ? 'Good' : 'Needs Review'} compliance status across all audited standards.
                    </p>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                            <p className="text-muted-foreground italic text-sm">Loading compliance data...</p>
                        </div>
                    ) : reports.length === 0 ? (
                        <Card className="rounded-3xl border-border/50 bg-background/50 p-12 text-center italic text-muted-foreground">
                            No compliance records found.
                        </Card>
                    ) : reports.map((item, idx) => (
                        <Card key={item.id || idx} className="rounded-3xl border-border/50 bg-background/50 p-6 flex items-center justify-between hover:border-border transition-all">
                            <div className="flex items-center gap-6">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
                                    (item.status === 'Compliant' || item.is_compliant) ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                                }`}>
                                    <ShieldCheck className="h-7 w-7" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-lg font-bold">{item.name || item.standard}</h4>
                                        <span className="text-xs font-mono text-muted-foreground">{item.id || item.code}</span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" /> Next Review: {item.nextReview || item.next_review_date || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-bold">
                                            Score: {item.score}/100
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant={(item.status === 'Compliant' || item.is_compliant) ? 'outline' : 'destructive'} className="rounded-full px-4 border-none bg-secondary">
                                    {item.status || (item.is_compliant ? 'Compliant' : 'Non-Compliant')}
                                </Badge>
                                <Button variant="ghost" size="icon" className="rounded-full"><ArrowUpRight className="h-5 w-5" /></Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <Card className="rounded-[2.5rem] border-border/50 bg-secondary/10 p-10 mt-12 overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="h-20 w-20 rounded-3xl bg-background shadow-xl flex items-center justify-center shrink-0">
                        <FileText className="h-10 w-10" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <h3 className="text-2xl font-bold">Self-Assessment Report</h3>
                        <p className="text-muted-foreground max-w-xl">
                            Generate a comprehensive documentation pack for ISO 9001:2015 recertification based on maintenance history and spare parts auditing.
                        </p>
                    </div>
                    <Button className="rounded-2xl h-14 px-8 font-bold shadow-xl">Pre-generate Pack</Button>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-background/20 to-transparent pointer-events-none" />
            </Card>
        </PageShell>
    );
}
