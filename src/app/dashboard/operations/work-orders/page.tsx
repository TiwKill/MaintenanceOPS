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
    Search, 
    Filter, 
    Plus, 
    MoreHorizontal, 
    ArrowUpDown,
    Wrench,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Edit2,
    Trash2
} from 'lucide-react';
import { operationService, assetService, governanceService } from '@/services/api';
import { Priority, Asset, User } from '@/services/types';
import { useEffect, useState, useMemo } from 'react';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WorkOrdersPage() {
    const [workOrders, setWorkOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const [assets, setAssets] = useState<Asset[]>([]);
    const [technicians, setTechnicians] = useState<User[]>([]);
    const [isAssetsLoading, setIsAssetsLoading] = useState(false);
    const [isTechLoading, setIsTechLoading] = useState(false);

    // Form state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    // Combobox open states
    const [openAsset, setOpenAsset] = useState(false);
    const [openTech, setOpenTech] = useState(false);

    const [selectedWO, setSelectedWO] = useState<any>(null);
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        asset_id: string;
        priority: Priority;
        due_date: string;
        assigned_to?: string;
    }>({
        title: '',
        description: '',
        asset_id: '',
        priority: 'MEDIUM',
        due_date: new Date().toISOString().split('T')[0],
        assigned_to: ''
    });

    const fetchWorkOrders = async () => {
        setIsLoading(true);
        try {
            const data = await operationService.getWorkOrders();
            setWorkOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch work orders:', error);
            setError('Failed to load work orders. Please check your connection or try again later.');
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

    const fetchTechnicians = async () => {
        setIsTechLoading(true);
        try {
            const data = await governanceService.getTechnicians();
            setTechnicians(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch technicians:', error);
        } finally {
            setIsTechLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkOrders();
        fetchAssets();
        fetchTechnicians();
    }, []);

    const handleOpenDialog = (wo: any = null) => {
        if (wo) {
            setSelectedWO(wo);
            setFormData({
                title: wo.title,
                description: wo.description || '',
                asset_id: wo.asset_id,
                priority: wo.priority as Priority,
                due_date: wo.due_date ? new Date(wo.due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                assigned_to: wo.assigned_to || wo.assignee_id || ''
            });
        } else {
            setSelectedWO(null);
            setFormData({
                title: '',
                description: '',
                asset_id: '',
                priority: 'MEDIUM',
                due_date: new Date().toISOString().split('T')[0]
            });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsActionLoading(true);
        try {
            if (selectedWO) {
                await operationService.updateWorkOrder(selectedWO.id, formData);
            } else {
                await operationService.createWorkOrder(formData as any);
            }
            setIsDialogOpen(false);
            fetchWorkOrders();
        } catch (error) {
            console.error('Failed to save work order:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedWO) return;
        setIsActionLoading(true);
        try {
            await operationService.deleteWorkOrder(selectedWO.id);
            setIsDeleteDialogOpen(false);
            fetchWorkOrders();
        } catch (error) {
            console.error('Failed to delete work order:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <PageShell 
            title="Work Orders"
            description="Manage and track all maintenance activities."
            breadcrumbs={[{ label: "Operations", href: "/dashboard/operations" }, { label: "Work Orders" }]}
            actions={
                <Button className="rounded-xl h-11" onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Create Work Order
                </Button>
            }
        >
            <Card className="rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-secondary/10 px-8 py-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search work orders..." 
                                className="pl-10 h-11 bg-background/50 border-border/50 rounded-xl"
                            />
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Badge variant="outline" className="rounded-full">{workOrders.filter(w => w.status === 'OPEN').length}</Badge> Open</span>
                            <span className="flex items-center gap-1"><Badge variant="outline" className="rounded-full">{workOrders.filter(w => w.status === 'IN_PROGRESS').length}</Badge> Progress</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-border/50">
                                <TableHead className="w-[150px] pl-8">ID <ArrowUpDown className="inline ml-1 h-3 w-3" /></TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Asset ID</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Assignee ID</TableHead>
                                <TableHead className="w-[50px] pr-8"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-40 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                            <p className="text-muted-foreground italic">Loading work orders...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-40 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertCircle className="h-8 w-8 text-rose-500" />
                                            <p className="text-rose-500 font-medium">{error}</p>
                                            <Button variant="outline" size="sm" onClick={() => fetchWorkOrders()}>
                                                Retry
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : workOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-40 text-center">
                                        <p className="text-muted-foreground italic">No work orders found.</p>
                                    </TableCell>
                                </TableRow>
                            ) : workOrders.map((wo) => (
                                <TableRow key={wo.id} className="hover:bg-secondary/10 transition-colors border-border/50 cursor-pointer group">
                                    <TableCell className="font-mono text-xs pl-8">{wo.id.slice(0, 8)}</TableCell>
                                    <TableCell className="font-medium group-hover:text-primary transition-colors">{wo.title}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Wrench className="h-3 w-3" /> {wo.asset_id?.slice(0, 8) || 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant="outline" 
                                            className={`rounded-full px-3 py-0.5 border-none shadow-sm ${
                                                wo.priority === "CRITICAL" ? "bg-rose-500/10 text-rose-600" :
                                                wo.priority === "HIGH" ? "bg-amber-500/10 text-amber-600" :
                                                wo.priority === "MEDIUM" ? "bg-blue-500/10 text-blue-600" :
                                                "bg-slate-500/10 text-slate-600"
                                            }`}
                                        >
                                            {wo.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {wo.status === "COMPLETED" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                                             wo.status === "IN_PROGRESS" ? <Clock className="h-4 w-4 text-amber-500" /> :
                                             <AlertTriangle className="h-4 w-4 text-slate-400" />}
                                            <span className="text-sm font-medium">{wo.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{wo.assignee_id?.slice(0, 8) || 'Unassigned'}</TableCell>
                                    <TableCell className="pr-8">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem onClick={() => handleOpenDialog(wo)}>
                                                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-rose-500 focus:text-rose-500" 
                                                    onClick={() => { setSelectedWO(wo); setIsDeleteDialogOpen(true); }}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>{selectedWO ? 'Edit Work Order' : 'Create Work Order'}</DialogTitle>
                        <DialogDescription>
                            Define a new maintenance task or update an existing one.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input 
                                id="title" 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="e.g. Repair Hydraulic Leak"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea 
                                id="description"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Details about the work needed..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Asset ID / Serial</Label>
                                <Popover open={openAsset} onOpenChange={setOpenAsset}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openAsset}
                                            className="w-full justify-between rounded-md h-10 px-3 text-sm"
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
                                <Label htmlFor="due">Due Date</Label>
                                <Input 
                                    id="due" 
                                    type="date"
                                    value={formData.due_date} 
                                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Responsible Technician</Label>
                            <Popover open={openTech} onOpenChange={setOpenTech}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openTech}
                                        className="w-full justify-between rounded-md h-10 px-3 text-sm font-normal"
                                    >
                                        <span className="truncate text-muted-foreground">
                                            {formData.assigned_to
                                                ? technicians.find((tech) => tech.id === formData.assigned_to || tech.employee_id === formData.assigned_to)?.first_name + " " + technicians.find((tech) => tech.id === formData.assigned_to || tech.employee_id === formData.assigned_to)?.last_name
                                                : "Select technician..."}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search technician..." />
                                        <CommandList>
                                            <CommandEmpty>No technician found.</CommandEmpty>
                                            <CommandGroup>
                                                {technicians.map((tech) => (
                                                    <CommandItem
                                                        key={tech.id}
                                                        value={tech.first_name + " " + tech.last_name + " " + tech.employee_id}
                                                        onSelect={() => {
                                                            setFormData({ ...formData, assigned_to: tech.employee_id });
                                                            setOpenTech(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    formData.assigned_to === tech.employee_id ? "opacity-100" : "opacity-0"
                                                                )}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="font-bold">{tech.first_name} {tech.last_name}</span>
                                                            <span className="text-xs text-muted-foreground">ID: {tech.employee_id}</span>
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
                            <Label htmlFor="priority">Priority</Label>
                            <select 
                                id="priority"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.priority}
                                onChange={(e) => setFormData({...formData, priority: e.target.value as Priority})}
                            >
                                <option value="LOW">LOW</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="HIGH">HIGH</option>
                                <option value="CRITICAL">CRITICAL</option>
                            </select>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isActionLoading}>
                                {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {selectedWO ? 'Update Order' : 'Create Order'}
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
                            Are you sure you want to delete work order <strong>{selectedWO?.title}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isActionLoading} className="rounded-xl">
                            {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Order
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageShell>
    );
}
