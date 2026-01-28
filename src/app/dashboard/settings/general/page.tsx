'use client';

import PageShell from '@/components/dashboard/shared/page-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
    Building2, 
    Globe, 
    Clock, 
    Bell, 
    ShieldCheck, 
    CreditCard,
    Save
} from 'lucide-react';
import { generalSettings } from '@/data/settings';

export default function GeneralSettingsPage() {
    return (
        <PageShell 
            title="General Settings" 
            description="Manage your organizational profile and system-wide preferences." 
            breadcrumbs={[{ label: "Settings", href: "/dashboard/settings" }, { label: "General" }]}
            actions={
                <Button className="rounded-xl h-11 shadow-lg">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            }
        >
            <div className="grid gap-12 max-w-4xl">
                <section className="space-y-8">
                    <div className="flex items-center gap-4 px-2">
                        <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold">Organization Profile</h3>
                    </div>
                    
                    <Card className="rounded-[2.5rem] border-border/50 bg-background/50 p-10 space-y-8">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Plant Name</Label>
                                <Input defaultValue={generalSettings.orgName} className="rounded-xl h-12 bg-secondary/50 border-none" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Primary Industry</Label>
                                <Input defaultValue="Industrial Manufacturing" className="rounded-xl h-12 bg-secondary/50 border-none" />
                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Primary Email</Label>
                                <Input defaultValue="contact@acmeindustrial.tech" className="rounded-xl h-12 bg-secondary/50 border-none" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Phone Number</Label>
                                <Input defaultValue="+1 (555) 001-9988" className="rounded-xl h-12 bg-secondary/50 border-none" />
                            </div>
                        </div>
                    </Card>
                </section>

                <section className="space-y-8">
                    <div className="flex items-center gap-4 px-2">
                        <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                            <Globe className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold">Localization & Compliance</h3>
                    </div>

                    <Card className="rounded-[2.5rem] border-border/50 bg-background/50 p-10 space-y-8">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Timezone</Label>
                                <Input defaultValue={generalSettings.timezone} className="rounded-xl h-12 bg-secondary/50 border-none" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Currency</Label>
                                <Input defaultValue={generalSettings.currency} className="rounded-xl h-12 bg-secondary/50 border-none" />
                            </div>
                        </div>
                    </Card>
                </section>
                
                <Separator className="bg-border/50" />

                <div className="flex justify-end gap-4 p-4 pb-12">
                     <Button variant="ghost" className="rounded-xl h-12 px-8 font-bold">Reset Defaults</Button>
                     <Button className="rounded-xl h-12 px-8 font-bold shadow-xl">Update Profile</Button>
                </div>
            </div>
        </PageShell>
    );
}
