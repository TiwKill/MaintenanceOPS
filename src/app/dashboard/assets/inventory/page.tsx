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
    Package,
    AlertCircle,
    TrendingUp,
    Loader2,
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

export default function InventoryPage() {
    const [inventory, setInventory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Form state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        location: '',
        stock_quantity: 0,
        min_stock_level: 0,
        price: 0
    });

    const fetchInventory = async () => {
        setIsLoading(true);
        try {
            const data = await assetService.getInventory();
            setInventory(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
            setError('Failed to load inventory. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleOpenDialog = (item: any = null) => {
        if (item) {
            setSelectedItem(item);
            setFormData({
                name: item.name,
                sku: item.sku,
                category: item.category,
                location: item.location || '',
                stock_quantity: item.stock_quantity,
                min_stock_level: item.min_stock_level,
                price: item.price
            });
        } else {
            setSelectedItem(null);
            setFormData({
                name: '',
                sku: '',
                category: '',
                location: '',
                stock_quantity: 0,
                min_stock_level: 0,
                price: 0
            });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsActionLoading(true);
        try {
            if (selectedItem) {
                await assetService.updateInventoryItem(selectedItem.id, formData);
            } else {
                await assetService.createInventoryItem(formData as any);
            }
            setIsDialogOpen(false);
            fetchInventory();
        } catch (error) {
            console.error('Failed to save inventory item:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        setIsActionLoading(true);
        try {
            await assetService.deleteInventoryItem(selectedItem.id);
            setIsDeleteDialogOpen(false);
            fetchInventory();
        } catch (error) {
            console.error('Failed to delete item:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <PageShell 
            title="Spare Parts Inventory" 
            description="Manage stock levels and consumable components." 
            breadcrumbs={[{ label: "Asset Management", href: "/dashboard/assets" }, { label: "Spare Parts" }]}
            actions={
                <Button className="rounded-xl h-11" onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            }
        >
            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card className="rounded-3xl border-border/50 bg-background/50 p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground mb-4">
                        <Package className="h-4 w-4" />
                        <span className="text-sm font-medium uppercase tracking-widest">Total SKUs</span>
                    </div>
                    <div>
                        <div className="text-4xl font-bold">{inventory.length}</div>
                        <p className="text-xs text-emerald-500 font-medium mt-1">Live tracking active</p>
                    </div>
                </Card>
                <Card className="rounded-3xl border-border/50 bg-background/50 p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium uppercase tracking-widest">Low Stock Alerts</span>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-rose-500">
                            {inventory.filter(item => item.stock_quantity < item.min_stock_level).length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Requires reorder</p>
                    </div>
                </Card>
                <Card className="rounded-3xl border-border/50 bg-background/50 p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground mb-4">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium uppercase tracking-widest">Inventory Value</span>
                    </div>
                    <div>
                        <div className="text-4xl font-bold">
                            ${inventory.reduce((acc, item) => acc + (item.price * item.stock_quantity), 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Estimated total cost</p>
                    </div>
                </Card>
            </div>

            <Card className="rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-secondary/10 px-8 py-6 flex flex-row items-center justify-between">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search inventory..." className="pl-10 h-11 bg-background/50 border-border/50 rounded-xl" />
                    </div>
                    <Button variant="outline" className="rounded-xl h-11">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-border/50">
                                <TableHead className="w-[120px] pl-8">ID</TableHead>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Stock Level</TableHead>
                                <TableHead>Min Stock</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="w-[50px] pr-8"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                            <p className="text-muted-foreground italic">Loading inventory...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertCircle className="h-8 w-8 text-rose-500" />
                                            <p className="text-rose-500 font-medium">{error}</p>
                                            <Button variant="outline" size="sm" onClick={() => fetchInventory()}>Retry</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : Array.isArray(inventory) && inventory.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center">
                                        <p className="text-muted-foreground italic">No inventory items found.</p>
                                    </TableCell>
                                </TableRow>
                            ) : Array.isArray(inventory) && inventory.map((item) => (
                                <TableRow key={item.id} className="hover:bg-secondary/10 transition-colors border-border/50 group">
                                    <TableCell className="font-mono text-xs pl-8">{item.id.slice(0, 8)}</TableCell>
                                    <TableCell className="font-medium group-hover:text-primary transition-colors">{item.name}</TableCell>
                                    <TableCell><Badge variant="outline" className="rounded-full bg-secondary/50 border-none">{item.category}</Badge></TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 w-32">
                                            <div className="flex justify-between text-[10px] font-bold">
                                                <span>{item.stock_quantity} units</span>
                                                <span className={item.stock_quantity < item.min_stock_level ? 'text-rose-500' : 'text-emerald-500'}>
                                                    {item.min_stock_level > 0 ? ((item.stock_quantity / (item.min_stock_level * 2)) * 100).toFixed(0) : 100}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${item.stock_quantity < item.min_stock_level ? 'bg-rose-500' : 'bg-foreground'}`}
                                                    style={{ width: `${Math.min((item.min_stock_level > 0 ? (item.stock_quantity / (item.min_stock_level * 2)) * 100 : 100), 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground font-mono">{item.min_stock_level}</TableCell>
                                    <TableCell className="font-medium">${Number(item.price).toFixed(2)}</TableCell>
                                    <TableCell className="pr-8">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem onClick={() => handleOpenDialog(item)}>
                                                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-rose-500 focus:text-rose-500" 
                                                    onClick={() => { setSelectedItem(item); setIsDeleteDialogOpen(true); }}
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
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>{selectedItem ? 'Edit Item' : 'Add Inventory Item'}</DialogTitle>
                        <DialogDescription>
                            Update stock details and pricing for this spare part.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Item Name</Label>
                            <Input 
                                id="name" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Hydraulic Seal Kit"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input 
                                    id="sku" 
                                    value={formData.sku} 
                                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                    placeholder="SKU-001"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Input 
                                    id="category" 
                                    value={formData.category} 
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    placeholder="Mechanical"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="stock">Stock Quantity</Label>
                                <Input 
                                    id="stock" 
                                    type="number"
                                    value={formData.stock_quantity} 
                                    onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value)})}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="min-stock">Min Stock Level</Label>
                                <Input 
                                    id="min-stock" 
                                    type="number"
                                    value={formData.min_stock_level} 
                                    onChange={(e) => setFormData({...formData, min_stock_level: parseInt(e.target.value)})}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input 
                                    id="price" 
                                    type="number"
                                    step="0.01"
                                    value={formData.price} 
                                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Location</Label>
                                <Input 
                                    id="location" 
                                    value={formData.location} 
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    placeholder="Aisle 4, Shelf B"
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isActionLoading}>
                                {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {selectedItem ? 'Update Item' : 'Add Item'}
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
                            Are you sure you want to delete <strong>{selectedItem?.name}</strong>? This will remove the item from inventory records.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isActionLoading} className="rounded-xl">
                            {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Item
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageShell>
    );
}
