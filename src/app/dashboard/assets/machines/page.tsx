'use client';

import PageShell from '@/components/dashboard/shared/page-shell';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Factory,
    ArrowRight,
    Search,
    Trash2,
    Edit2,
    Plus,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { assetService } from '@/services/api';
import { AssetStatus } from '@/services/types';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MachinesPage() {
    const [machines, setMachines] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    
    // Form state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState<any>(null);
    const [formData, setFormData] = useState<{
        name: string;
        serial_number: string;
        model: string;
        status: AssetStatus;
        health_score: number;
    }>({
        name: '',
        serial_number: '',
        model: '',
        status: 'IDLE',
        health_score: 100
    });

    const fetchMachines = async () => {
        setIsLoading(true);
        try {
            const data = await assetService.getAssets();
            setMachines(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch machines:', error);
            setError('Failed to load assets. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    const handleOpenDialog = (machine: any = null) => {
        if (machine) {
            setSelectedMachine(machine);
            setFormData({
                name: machine.name,
                serial_number: machine.serial_number,
                model: machine.model,
                status: machine.status as AssetStatus,
                health_score: machine.health_score
            });
        } else {
            setSelectedMachine(null);
            setFormData({
                name: '',
                serial_number: '',
                model: '',
                status: 'IDLE',
                health_score: 100
            });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsActionLoading(true);
        try {
            if (selectedMachine) {
                await assetService.updateAsset(selectedMachine.id, formData);
            } else {
                await assetService.createAsset(formData as any);
            }
            setIsDialogOpen(false);
            fetchMachines();
        } catch (error) {
            console.error('Failed to save machine:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedMachine) return;
        setIsActionLoading(true);
        try {
            await assetService.deleteAsset(selectedMachine.id);
            setIsDeleteDialogOpen(false);
            fetchMachines();
        } catch (error) {
            console.error('Failed to delete machine:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <PageShell 
            title="Machine Registry" 
            description="Manage industrial assets and technical specifications." 
            breadcrumbs={[{ label: "Asset Management", href: "/dashboard/assets" }, { label: "Machines" }]}
            actions={
                <Button className="rounded-xl h-11" onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Register New Asset
                </Button>
            }
        >
            <div className="flex items-center justify-between mb-8 gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                        className="w-full bg-background/50 border border-border/50 rounded-xl h-11 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Search by serial number or name..."
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="rounded-lg h-11">All</Button>
                    <Button variant="ghost" size="sm" className="rounded-lg h-11 text-muted-foreground">Running</Button>
                    <Button variant="ghost" size="sm" className="rounded-lg h-11 text-muted-foreground">Down</Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground font-medium italic">Loading assets...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <p className="text-rose-500 font-medium">{error}</p>
                    <Button variant="outline" onClick={() => fetchMachines()}>Retry</Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(machines) && machines.map((mac, idx) => (
                    <motion.div
                        key={mac.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group"
                    >
                        <Card className="rounded-[2.5rem] border-border/50 bg-background/50 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <Factory className="h-7 w-7" />
                                    </div>
                                    <Badge 
                                        className={`rounded-full px-4 py-1 text-[10px] uppercase font-bold tracking-widest ${
                                            mac.status === 'RUNNING' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                            mac.status === 'MAINTENANCE' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                            'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                        }`}
                                        variant="outline"
                                    >
                                        {mac.status}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-extrabold tracking-tight">{mac.name}</h3>
                                    <p className="text-sm text-muted-foreground font-medium">{mac.model}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4">
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Serial ID</p>
                                        <p className="text-sm font-mono font-semibold">{mac.serial_number}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Team ID</p>
                                        <p className="text-sm font-semibold truncate max-w-[100px]">{mac.team_id}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 mb-8">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Health Index</p>
                                        <p className="text-sm font-extrabold">{mac.health_score}%</p>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${mac.health_score}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className={`h-full ${mac.health_score > 80 ? 'bg-emerald-500' : mac.health_score > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link href={`/dashboard/assets/machines/${mac.id}`} className="flex-1">
                                        <Button 
                                            className="w-full rounded-2xl h-12 bg-foreground text-background hover:scale-[0.98] transition-transform group" 
                                            variant="default"
                                        >
                                            <span className="relative z-10 flex items-center justify-center font-bold text-xs">
                                                Analytics <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </Button>
                                    </Link>
                                    <Button 
                                        variant="outline" 
                                        className="h-12 w-12 rounded-2xl border-border/50 hover:bg-secondary"
                                        onClick={() => handleOpenDialog(mac)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="h-12 w-12 rounded-2xl border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                                        onClick={() => { setSelectedMachine(mac); setIsDeleteDialogOpen(true); }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>{selectedMachine ? 'Edit Machine' : 'Register New Machine'}</DialogTitle>
                        <DialogDescription>
                            Enter the specifications for the industrial asset.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Machine Name</Label>
                            <Input 
                                id="name" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. CNC Milling Machine"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="serial">Serial Number</Label>
                            <Input 
                                id="serial" 
                                value={formData.serial_number} 
                                onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
                                placeholder="e.g. CNC-001"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="model">Model</Label>
                            <Input 
                                id="model" 
                                value={formData.model} 
                                onChange={(e) => setFormData({...formData, model: e.target.value})}
                                placeholder="e.g. Fanuc Series 30i"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <select 
                                    id="status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value as AssetStatus})}
                                >
                                    <option value="RUNNING">RUNNING</option>
                                    <option value="IDLE">IDLE</option>
                                    <option value="MAINTENANCE">MAINTENANCE</option>
                                    <option value="BREAKDOWN">BREAKDOWN</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="health">Health Score (%)</Label>
                                <Input 
                                    id="health" 
                                    type="number" 
                                    min="0" 
                                    max="100"
                                    value={formData.health_score} 
                                    onChange={(e) => setFormData({...formData, health_score: parseInt(e.target.value)})}
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isActionLoading}>
                                {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {selectedMachine ? 'Update Machine' : 'Save Machine'}
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
                            Are you sure you want to delete <strong>{selectedMachine?.name}</strong>? This action is permanent and cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isActionLoading} className="rounded-xl">
                            {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Machine
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageShell>
    );
}
