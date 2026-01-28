'use client';

import PageShell from '@/components/dashboard/shared/page-shell';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { 
    Hammer, 
    MoreHorizontal, 
    ShieldCheck, 
    PenTool as Tool, 
    Search, 
    Filter,
    AlertCircle,
    Loader2,
    Plus,
    Edit2,
    Trash2,
    AlertTriangle
} from 'lucide-react';
import { assetService } from '@/services/api';
import { useEffect, useState } from 'react';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ToolsPage() {
    const [toolsData, setToolsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Form state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTool, setSelectedTool] = useState<any>(null);
    const [formData, setFormData] = useState<{
        name: string;
        brand: string;
        condition: 'GOOD' | 'FAIR' | 'POOR';
        status: 'AVAILABLE' | 'IN_USE' | 'UNDER_MAINTENANCE';
    }>({
        name: '',
        brand: '',
        condition: 'GOOD',
        status: 'AVAILABLE'
    });

    const fetchTools = async () => {
        setIsLoading(true);
        try {
            const data = await assetService.getTools();
            setToolsData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch tools:', error);
            setError('Failed to load tools. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTools();
    }, []);

    const handleOpenDialog = (tool: any = null) => {
        if (tool) {
            setSelectedTool(tool);
            setFormData({
                name: tool.name,
                brand: tool.brand,
                condition: tool.condition as 'GOOD' | 'FAIR' | 'POOR',
                status: tool.status as 'AVAILABLE' | 'IN_USE' | 'UNDER_MAINTENANCE'
            });
        } else {
            setSelectedTool(null);
            setFormData({
                name: '',
                brand: '',
                condition: 'GOOD',
                status: 'AVAILABLE'
            });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsActionLoading(true);
        try {
            if (selectedTool) {
                await assetService.updateTool(selectedTool.id, formData);
            } else {
                await assetService.createTool(formData);
            }
            setIsDialogOpen(false);
            fetchTools();
        } catch (error) {
            console.error('Failed to save tool:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedTool) return;
        setIsActionLoading(true);
        try {
            await assetService.deleteTool(selectedTool.id);
            setIsDeleteDialogOpen(false);
            fetchTools();
        } catch (error) {
            console.error('Failed to delete tool:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <PageShell 
            title="Tools & Equipment" 
            description="Tracking specialized maintenance gear and calibration status." 
            breadcrumbs={[{ label: "Asset Management", href: "/dashboard/assets" }, { label: "Tools & Equipment" }]}
            actions={
                <Button className="rounded-xl h-11" onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Tool
                </Button>
            }
        >
            <Card className="rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-secondary/10 px-8 py-6 flex flex-row items-center justify-between">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            className="pl-10 h-11 bg-background/50 border-border/50 rounded-xl"
                            placeholder="Search tools..."
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="rounded-xl h-11">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-border/50">
                                <TableHead className="pl-8">ID</TableHead>
                                <TableHead>Tool Name</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>Condition</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Calibrated</TableHead>
                                <TableHead className="pr-8"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                            <p className="text-muted-foreground italic">Loading tools...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertCircle className="h-8 w-8 text-rose-500" />
                                            <p className="text-rose-500 font-medium">{error}</p>
                                            <Button variant="outline" size="sm" onClick={() => fetchTools()}>Retry</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : Array.isArray(toolsData) && toolsData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center">
                                        <p className="text-muted-foreground italic">No tools found.</p>
                                    </TableCell>
                                </TableRow>
                            ) : toolsData.map((tool) => (
                                <TableRow key={tool.id} className="hover:bg-secondary/10 transition-colors border-border/50">
                                    <TableCell className="font-mono text-xs pl-8">{tool.id.slice(0, 8)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                                                <Tool className="h-4 w-4" />
                                            </div>
                                            <span className="font-semibold">{tool.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{tool.brand}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`rounded-full ${
                                            tool.condition === 'GOOD' ? 'text-emerald-500 border-emerald-500/20' :
                                            tool.condition === 'FAIR' ? 'text-blue-500 border-blue-500/20' :
                                            'text-amber-500 border-amber-500/20'
                                        }`}>
                                            {tool.condition}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${tool.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <span className="text-sm font-medium">{tool.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground font-mono">2024-01-15</TableCell>
                                    <TableCell className="pr-8 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem onClick={() => handleOpenDialog(tool)}>
                                                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-rose-500 focus:text-rose-500" 
                                                    onClick={() => { setSelectedTool(tool); setIsDeleteDialogOpen(true); }}
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

            <div className="grid gap-6 md:grid-cols-2 mt-8">
                <Card className="rounded-3xl border-border/50 bg-emerald-500/5 p-8 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-emerald-700">Compliance Ready</h4>
                        <p className="text-sm text-emerald-600/80">95% of specialized tools are within their calibration window.</p>
                    </div>
                </Card>
                <Card className="rounded-3xl border-border/50 bg-background/50 p-8 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center">
                        <Hammer className="h-8 w-8" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">Maintenance Utility</h4>
                        <p className="text-sm text-muted-foreground">Most used tool this month: Digital Multimeter (Level 1 Power Checks).</p>
                    </div>
                </Card>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>{selectedTool ? 'Edit Tool' : 'Add New Tool'}</DialogTitle>
                        <DialogDescription>
                            Define the specifications and condition of the maintenance equipment.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Tool Name</Label>
                            <Input 
                                id="name" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Digital Multimeter"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Input 
                                id="brand" 
                                value={formData.brand} 
                                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                placeholder="e.g. Fluke"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="condition">Condition</Label>
                                <select 
                                    id="condition"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.condition}
                                    onChange={(e) => setFormData({...formData, condition: e.target.value as 'GOOD' | 'FAIR' | 'POOR'})}
                                >
                                    <option value="GOOD">GOOD</option>
                                    <option value="FAIR">FAIR</option>
                                    <option value="POOR">POOR</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <select 
                                    id="status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value as 'AVAILABLE' | 'IN_USE' | 'UNDER_MAINTENANCE'})}
                                >
                                    <option value="AVAILABLE">AVAILABLE</option>
                                    <option value="IN_USE">IN_USE</option>
                                    <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isActionLoading}>
                                {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {selectedTool ? 'Update Tool' : 'Add Tool'}
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
                            Are you sure you want to delete <strong>{selectedTool?.name}</strong>? This will remove the tool from availability.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isActionLoading} className="rounded-xl">
                            {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Tool
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageShell>
    );
}
