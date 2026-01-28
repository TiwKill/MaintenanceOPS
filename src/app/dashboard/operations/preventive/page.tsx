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
    CalendarCheck, 
    Clock, 
    Zap, 
    ClipboardCheck,
    Calendar,
    ArrowUpRight,
    AlertCircle,
    Loader2,
    Plus,
    Trash2,
    AlertTriangle
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

export default function PreventivePage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isAssetsLoading, setIsAssetsLoading] = useState(false);

    // Form state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [openAsset, setOpenAsset] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [formData, setFormData] = useState({
        asset_id: '',
        frequency: 'Monthly',
        task_description: ''
    });

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const data = await operationService.getPreventiveTasks();
            setTasks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch preventive tasks:', error);
            setError('Failed to load tasks. Please try again later.');
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
        fetchTasks();
        fetchAssets();
    }, []);

    const handleRunGenerator = async () => {
        setIsActionLoading(true);
        try {
            const result = await operationService.runPreventiveGenerator();
            alert(`${result.message}. Work orders created: ${result.work_orders_created}`);
            fetchTasks();
        } catch (error) {
            console.error('Failed to run PM generator:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setFormData({
            asset_id: '',
            frequency: 'Monthly',
            task_description: ''
        });
        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsActionLoading(true);
        try {
            await operationService.createPreventiveTask(formData);
            setIsDialogOpen(false);
            fetchTasks();
        } catch (error) {
            console.error('Failed to save PM plan:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedTask) return;
        setIsActionLoading(true);
        try {
            await operationService.deletePreventiveTask(selectedTask.id);
            setIsDeleteDialogOpen(false);
            fetchTasks();
        } catch (error) {
            console.error('Failed to delete PM plan:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <PageShell 
            title="Preventive Maintenance" 
            description="Manage recurring service tasks and proactive maintenance plans." 
            breadcrumbs={[{ label: "Operations", href: "/dashboard/operations" }, { label: "Preventive (PM)" }]}
            actions={
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-xl h-11" onClick={handleOpenDialog}>
                        <Plus className="mr-2 h-4 w-4" /> Add PM Plan
                    </Button>
                    <Button 
                        className="rounded-xl h-11 bg-emerald-600 hover:bg-emerald-700" 
                        onClick={handleRunGenerator}
                        disabled={isActionLoading}
                    >
                        {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                        Run PM Generator
                    </Button>
                </div>
            }
        >
            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card className="rounded-3xl border-border/50 bg-emerald-500/5 p-8 border-emerald-500/10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                            <ClipboardCheck className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">PM Compliance</span>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-emerald-700">98.2%</div>
                        <p className="text-xs text-emerald-600/70 mt-1">Goal: 95.0%</p>
                    </div>
                </Card>

                <Card className="rounded-3xl border-border/50 bg-background/50 p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Due This Week</span>
                    </div>
                    <div className="text-4xl font-extrabold">{tasks.filter(t => t.status === 'Pending').length}</div>
                </Card>

                <Card className="rounded-3xl border-border/50 bg-background/50 p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center">
                            <CalendarCheck className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Active Plans</span>
                    </div>
                    <div className="text-4xl font-extrabold">{tasks.length}</div>
                </Card>
            </div>

            <Card className="rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-secondary/10 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">Planned Maintenance Tasks</h3>
                        <Button variant="ghost" size="sm" className="rounded-xl">View Master Schedule <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary/20 border-border/50">
                                <TableHead className="pl-8">Task Code</TableHead>
                                <TableHead>Machine</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Next Service</TableHead>
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
                                            <p className="text-muted-foreground italic">Loading planned tasks...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertCircle className="h-8 w-8 text-rose-500" />
                                            <p className="text-rose-500 font-medium">{error}</p>
                                            <Button variant="outline" size="sm" onClick={() => fetchTasks()}>Retry</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : tasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center">
                                        <p className="text-muted-foreground italic">No preventive tasks found.</p>
                                    </TableCell>
                                </TableRow>
                            ) : tasks.map((pm, idx) => (
                                <TableRow key={pm.id || idx} className="hover:bg-emerald-500/5 transition-colors border-border/50">
                                    <TableCell className="pl-8 font-mono text-xs">{pm.id?.slice(0, 8) || 'N/A'}</TableCell>
                                    <TableCell className="font-bold">{pm.machine?.name || pm.asset?.name}</TableCell>
                                    <TableCell className="font-medium">{pm.task || pm.task_description}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="rounded-full shadow-sm">{pm.frequency}</Badge>
                                    </TableCell>
                                    <TableCell className="font-semibold text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {pm.nextDate || pm.next_due_date || '---'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant="outline" 
                                            className={`rounded-full shadow-sm ${pm.status === 'Pending' ? 'bg-amber-500 text-white' : 'bg-secondary text-muted-foreground'}`}
                                        >
                                            {pm.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="pr-8 text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                            onClick={() => { setSelectedTask(pm); setIsDeleteDialogOpen(true); }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create PM Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Add PM Plan</DialogTitle>
                        <DialogDescription>
                            Create a new recurring preventive maintenance plan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="grid gap-4 py-4">
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
                                            {formData.asset_id
                                                ? assets.find((asset) => asset.id === formData.asset_id || asset.serial_number === formData.asset_id)?.serial_number || formData.asset_id
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
                                                            setFormData({ ...formData, asset_id: asset.serial_number });
                                                            setOpenAsset(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.asset_id === asset.serial_number ? "opacity-100" : "opacity-0"
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
                            <Label htmlFor="freq">Frequency</Label>
                            <select 
                                id="freq"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.frequency}
                                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                            >
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desc">Task Description</Label>
                            <textarea 
                                id="desc"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.task_description} 
                                onChange={(e) => setFormData({...formData, task_description: e.target.value})}
                                placeholder="Describe the maintenance steps..."
                                required
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isActionLoading}>
                                {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Plan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-600">
                            <AlertTriangle className="h-5 w-5" /> Confirm Deletion
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Are you sure you want to delete this PM plan? Recurring tasks will no longer be generated.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isActionLoading} className="rounded-xl">
                            {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Plan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageShell>
    );
}
