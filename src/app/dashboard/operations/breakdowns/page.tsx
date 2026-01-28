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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Factory,
    AlertCircle,
    Loader2,
    AlertOctagon,
    Clock,
    Search,
    TrendingDown,
    Activity,
    Plus,
    CheckCircle2
} from 'lucide-react';
import { operationService, assetService } from '@/services/api';
import { Asset } from '@/services/types';
import { useEffect, useState } from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function BreakdownsPage() {
    const [breakdownLogs, setBreakdownLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isAssetsLoading, setIsAssetsLoading] = useState(false);
    const [openAsset, setOpenAsset] = useState(false);

    // Form state for reporting
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const [reportData, setReportData] = useState({
        asset_id: '',
        description: '',
        initial_severity: 'MEDIUM'
    });

    // Form state for resolving
    const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
    const [selectedBreakdown, setSelectedBreakdown] = useState<any>(null);
    const [resolveData, setResolveData] = useState({
        completion_notes: '',
        root_cause: ''
    });

    const fetchBreakdowns = async () => {
        setIsLoading(true);
        try {
            const data = await operationService.getBreakdowns();
            setBreakdownLogs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch breakdown logs:', error);
            setError('Failed to load breakdown logs. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAssets = async () => {
        setIsAssetsLoading(true);
        try {
            const data = await assetService.getAssets();
            setAssets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch assets:', error);
        } finally {
            setIsAssetsLoading(false);
        }
    };

    useEffect(() => {
        fetchBreakdowns();
        fetchAssets();
    }, []);

    const handleReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsActionLoading(true);
        try {
            await operationService.reportBreakdown({
                asset_id: reportData.asset_id,
                cause: reportData.description, // Mapping to api cause
                description: reportData.description
            } as any);
            setIsReportDialogOpen(false);
            fetchBreakdowns();
        } catch (error) {
            console.error('Failed to report breakdown:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleResolve = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBreakdown) return;
        setIsActionLoading(true);
        try {
            await operationService.resolveBreakdown(selectedBreakdown.id, resolveData);
            setIsResolveDialogOpen(false);
            fetchBreakdowns();
        } catch (error) {
            console.error('Failed to resolve breakdown:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <PageShell 
            title="Breakdown Logs" 
            description="Historical analysis and documentation of system failures." 
            breadcrumbs={[{ label: "Operations", href: "/dashboard/operations" }, { label: "Breakdown Logs" }]}
            actions={
                <Button className="rounded-xl h-11 bg-rose-600 hover:bg-rose-700" onClick={() => setIsReportDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Report Failure
                </Button>
            }
        >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="rounded-3xl border-border/50 bg-rose-500/5 p-8 border-rose-500/10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-600">
                            <AlertOctagon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-rose-600">Current MTBF</span>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-rose-700">482h</div>
                        <p className="text-xs text-rose-600/70 mt-1 flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" /> 12% lower than Q4 average
                        </p>
                    </div>
                </Card>
                
                <Card className="rounded-3xl border-border/50 bg-background/50 p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center">
                            <Activity className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Failures</span>
                    </div>
                    <div className="text-4xl font-extrabold">{breakdownLogs.filter(b => !b.endTime).length}</div>
                </Card>

                <Card className="rounded-3xl border-border/50 bg-background/50 p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reactive Hours</span>
                    </div>
                    <div className="text-4xl font-extrabold">42.5h</div>
                </Card>

                <Card className="rounded-3xl border-border/50 bg-background/50 p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resolved (24h)</span>
                    </div>
                    <div className="text-4xl font-extrabold text-emerald-600">12</div>
                </Card>
            </div>

            <Card className="rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-secondary/10 px-8 py-6 flex flex-row items-center justify-between">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10 h-11 bg-background/50 border-border/50 rounded-xl" placeholder="Search machine or cause..." />
                    </div>
                    <Badge variant="outline" className="rounded-full px-4 h-8 bg-background">Active Maintenance: 1</Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary/20 border-border/50">
                                <TableHead className="pl-8">Machine ID</TableHead>
                                <TableHead>Reported Time</TableHead>
                                <TableHead>Restored Time</TableHead>
                                <TableHead>Downtime Duration</TableHead>
                                <TableHead>Primary Cause</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="pr-8"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                            <p className="text-muted-foreground italic">Loading historical logs...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertCircle className="h-8 w-8 text-rose-500" />
                                            <p className="text-rose-500 font-medium">{error}</p>
                                            <Button variant="outline" size="sm" onClick={() => fetchBreakdowns()}>Retry</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : breakdownLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center">
                                        <p className="text-muted-foreground italic">No breakdown history found.</p>
                                    </TableCell>
                                </TableRow>
                            ) : breakdownLogs.map((bd, idx) => (
                                <TableRow key={bd.id || idx} className="hover:bg-rose-500/5 transition-colors border-border/50">
                                    <TableCell className="pl-8 font-bold">{bd.machine?.name || bd.asset?.name || bd.asset_id}</TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-xs">{bd.startTime || bd.created_at}</TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-xs">{bd.endTime || '---'}</TableCell>
                                    <TableCell className="font-semibold">{bd.duration || '---'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="rounded-full bg-secondary/50 border-none font-medium text-xs">{bd.cause || 'N/A'}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={bd.endTime ? "outline" : "destructive"} 
                                            className={`rounded-full shadow-sm ${bd.endTime ? 'bg-emerald-500/10 text-emerald-600' : 'animate-pulse'}`}
                                        >
                                            {bd.endTime ? 'Resolved' : 'Active Breakdown'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="pr-8 text-right">
                                        {!bd.endTime && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="rounded-xl h-8"
                                                onClick={() => { setSelectedBreakdown(bd); setIsResolveDialogOpen(true); }}
                                            >
                                                Resolve
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Report Failure Dialog */}
            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-rose-600">Report Failure</DialogTitle>
                        <DialogDescription>
                            Document a new system breakdown or asset failure.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleReport} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Asset ID / Serial</Label>
                            <Popover open={openAsset} onOpenChange={setOpenAsset}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openAsset}
                                        className="w-full justify-between rounded-md h-10 px-3 text-sm font-normal"
                                    >
                                        <span className="truncate">
                                            {reportData.asset_id
                                                ? assets.find((asset) => asset.id === reportData.asset_id || asset.serial_number === reportData.asset_id)?.serial_number || reportData.asset_id
                                                : "Select asset..."}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search asset (name or serial)..." />
                                        <CommandList>
                                            <CommandEmpty>No asset found.</CommandEmpty>
                                            <CommandGroup>
                                                {assets.map((asset) => (
                                                    <CommandItem
                                                        key={asset.id}
                                                        value={asset.serial_number + " " + asset.name}
                                                        onSelect={() => {
                                                            setReportData({ ...reportData, asset_id: asset.serial_number });
                                                            setOpenAsset(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                reportData.asset_id === asset.serial_number ? "opacity-100" : "opacity-0"
                                                                )}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="font-bold">{asset.serial_number}</span>
                                                            <span className="text-xs text-muted-foreground">{asset.name}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="severity">Initial Severity</Label>
                            <select 
                                id="severity"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={reportData.initial_severity}
                                onChange={(e) => setReportData({...reportData, initial_severity: e.target.value})}
                            >
                                <option value="LOW">LOW</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="HIGH">HIGH</option>
                                <option value="CRITICAL">CRITICAL</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desc">Problem Description</Label>
                            <textarea 
                                id="desc"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={reportData.description} 
                                onChange={(e) => setReportData({...reportData, description: e.target.value})}
                                placeholder="What happened? Observed symptoms..."
                                required
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsReportDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-rose-600 hover:bg-rose-700" disabled={isActionLoading}>
                                {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Report Failure
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Resolve Breakdown Dialog */}
            <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-emerald-600">Resolve Breakdown</DialogTitle>
                        <DialogDescription>
                            Confirm repairs and document the resolution of the failure.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleResolve} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reach">Root Cause</Label>
                            <Input 
                                id="reach" 
                                value={resolveData.root_cause} 
                                onChange={(e) => setResolveData({...resolveData, root_cause: e.target.value})}
                                placeholder="eg. Excessive heat, Component wear"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Completion Notes</Label>
                            <textarea 
                                id="notes"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={resolveData.completion_notes} 
                                onChange={(e) => setResolveData({...resolveData, completion_notes: e.target.value})}
                                placeholder="What repairs were performed?"
                                required
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsResolveDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isActionLoading}>
                                {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Resolve & Close
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </PageShell>
    );
}
