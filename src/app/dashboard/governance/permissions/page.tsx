'use client';

import PageShell from '@/components/dashboard/shared/page-shell';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Users, 
    ShieldAlert, 
    MoreHorizontal, 
    Lock,
    Settings,
    Plus,
    Loader2,
    Edit2,
    Trash2,
    AlertTriangle
} from 'lucide-react';
import { governanceService } from '@/services/api';
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

export default function PermissionsPage() {
    const [roles, setRoles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Form state for roles
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    // Form state for invitations
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [inviteData, setInviteData] = useState({
        email: '',
        role: ''
    });

    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            const data = await governanceService.getRoles();
            setRoles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleOpenDialog = (role: any = null) => {
        if (role) {
            setSelectedRole(role);
            setFormData({
                name: role.name,
                description: role.description || ''
            });
        } else {
            setSelectedRole(null);
            setFormData({
                name: '',
                description: ''
            });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsActionLoading(true);
        try {
            if (selectedRole) {
                await governanceService.updateRole(selectedRole.id, formData);
            } else {
                await governanceService.createRole(formData);
            }
            setIsDialogOpen(false);
            fetchRoles();
        } catch (error) {
            console.error('Failed to save role:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedRole) return;
        setIsActionLoading(true);
        try {
            await governanceService.deleteRole(selectedRole.id);
            setIsDeleteDialogOpen(false);
            fetchRoles();
        } catch (error) {
            console.error('Failed to delete role:', error);
        } finally {
            setIsActionLoading(false);
        }
    };
    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsActionLoading(true);
        try {
            await governanceService.inviteUser(inviteData);
            setIsInviteDialogOpen(false);
            setInviteData({ email: '', role: '' });
            alert('Invitation sent successfully!');
        } catch (error) {
            console.error('Failed to invite user:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <PageShell 
            title="User Permissions" 
            description="Manage organizational roles and access control policies." 
            breadcrumbs={[{ label: "Governance", href: "/dashboard/governance" }, { label: "User Permissions" }]}
            actions={
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-xl h-11" onClick={() => setIsInviteDialogOpen(true)}>
                         Invite Staff
                    </Button>
                    <Button className="rounded-xl h-11" onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" /> Create Custom Role
                    </Button>
                </div>
            }
        >
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                    <h3 className="text-xl font-bold px-2">System Roles</h3>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                            <p className="text-muted-foreground italic text-sm">Loading roles...</p>
                        </div>
                    ) : (
                        roles.map((role, idx) => (
                            <Card key={role.id || idx} className="rounded-3xl border-border/50 bg-background/50 p-8 hover:border-border transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{role.name}</h4>
                                        <p className="text-sm text-muted-foreground">{role.description}</p>
                                    </div>
                                    <Badge variant="secondary" className="rounded-full px-3">{role.user_count || 0} Users</Badge>
                                </div>
                                <div className="flex items-center justify-between border-t border-border/50 pt-6">
                                    <div className="flex -space-x-3">
                                        {Array.from({ length: Math.min(role.user_count || 0, 4) }).map((_, i) => (
                                            <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="rounded-xl"
                                            onClick={() => handleOpenDialog(role)}
                                        >
                                            <Settings className="h-4 w-4 mr-2" /> Configure
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="rounded-full h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                            onClick={() => { setSelectedRole(role); setIsDeleteDialogOpen(true); }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] border-border/50 bg-secondary/5 p-8 border-dashed border-2">
                        <div className="flex flex-col items-center text-center p-8 space-y-6">
                            <div className="h-20 w-20 rounded-[2rem] bg-background shadow-lg flex items-center justify-center">
                                <ShieldAlert className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-bold">Security Overview</h4>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    Multi-Factor Authentication is currently <span className="text-emerald-500 font-bold">Enabled</span> for all Administrative roles.
                                </p>
                            </div>
                            <Button variant="outline" className="rounded-2xl h-11 px-6">View Security Audit</Button>
                        </div>
                    </Card>

                    <Card className="rounded-[2.5rem] border-border/50 bg-background/50 p-10">
                        <h4 className="text-xl font-bold mb-8">Role Permission Matrix</h4>
                        <div className="space-y-6">
                            {[
                                { module: "Asset Management", status: "Read/Write" },
                                { module: "Work Orders", status: "Full Access" },
                                { module: "Financial Logs", status: "Read Only" },
                                { module: "User Admin", status: "No Access" },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <span className="font-semibold text-sm">{item.module}</span>
                                    </div>
                                    <Badge variant="outline" className="rounded-full px-4 border-none bg-secondary/50 font-bold group-hover:bg-foreground group-hover:text-background transition-all">
                                        {item.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>{selectedRole ? 'Edit Role' : 'Create Custom Role'}</DialogTitle>
                        <DialogDescription>
                            Define the role name and its primary responsibilities.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Role Name</Label>
                            <Input 
                                id="name" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="eg. Maintenance Supervisor"
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
                                placeholder="Details about this role's scope..."
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isActionLoading}>
                                {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {selectedRole ? 'Update Role' : 'Create Role'}
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
                            Are you sure you want to delete the <strong>{selectedRole?.name}</strong> role? This will affect all assigned users.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isActionLoading} className="rounded-xl">
                            {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Role
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Invite Staff Dialog */}
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Invite Staff Member</DialogTitle>
                        <DialogDescription>
                            Send an email invitation to join the organization.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInvite} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                                id="email" 
                                type="email"
                                value={inviteData.email} 
                                onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                                placeholder="eg. engineer@factory.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="invite-role">Assign Initial Role</Label>
                            <select 
                                id="invite-role"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={inviteData.role}
                                onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
                                required
                            >
                                <option key="default" value="">Select a role...</option>
                                {roles.map((r, idx) => (
                                    <option key={r.id || idx} value={r.name}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsInviteDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isActionLoading}>
                                {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Invite
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </PageShell>
    );
}
