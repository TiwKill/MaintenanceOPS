'use client';

import PageShell from '@/components/dashboard/shared/page-shell';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Fingerprint, 
    Search, 
    Download, 
    History,
    Shield,
    Calendar
} from 'lucide-react';
import { audits } from '@/data/governance';

export default function AuditsPage() {
    return (
        <PageShell 
            title="Audit Logs" 
            description="Immutable activity history for compliance and security." 
            breadcrumbs={[{ label: "Governance", href: "/dashboard/governance" }, { label: "Audit Logs" }]}
            actions={
                <Button variant="outline" className="rounded-xl h-11">
                    <Download className="mr-2 h-4 w-4" /> Download Report
                </Button>
            }
        >
            <div className="flex gap-4 mb-8">
                <Card className="flex-1 rounded-3xl border-border/50 bg-background/50 p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center">
                        <History className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Total Events</p>
                        <p className="text-2xl font-bold">14,204</p>
                    </div>
                </Card>
                <Card className="flex-1 rounded-3xl border-border/50 bg-background/50 p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Storage Integrity</p>
                        <p className="text-2xl font-bold text-emerald-500">Verified</p>
                    </div>
                </Card>
                <Card className="flex-1 rounded-3xl border-border/50 bg-background/50 p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Retention</p>
                        <p className="text-2xl font-bold">365 Days</p>
                    </div>
                </Card>
            </div>

            <Card className="rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-secondary/10 px-8 py-6 flex flex-row items-center justify-between">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input className="w-full bg-background/50 border border-border/50 rounded-xl h-11 pl-10 pr-4 text-sm focus:outline-none" placeholder="Search logs..." />
                    </div>
                    <Badge variant="outline" className="rounded-full px-4 h-8">Live Feed</Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary/20 border-border/50">
                                <TableHead className="pl-8">Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Target Resource</TableHead>
                                <TableHead className="pr-8">ID Proof</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {audits.map((log) => (
                                <TableRow key={log.id} className="hover:bg-secondary/10 border-border/50 font-medium">
                                    <TableCell className="pl-8 text-muted-foreground font-mono text-xs">{log.timestamp}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                                                {log.user.slice(0, 2).toUpperCase()}
                                            </div>
                                            {log.user}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="rounded-full font-bold">{log.action}</Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{log.target}</TableCell>
                                    <TableCell className="pr-8 font-mono text-[10px] text-muted-foreground flex items-center gap-2">
                                        <Fingerprint className="h-3 w-3" />
                                        {Math.random().toString(16).slice(2, 10)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </PageShell>
    );
}
