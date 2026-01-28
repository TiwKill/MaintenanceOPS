'use client';

import PageShell from '@/components/dashboard/shared/page-shell';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Calendar as CalendarIcon, 
    ChevronLeft, 
    ChevronRight, 
    Clock, 
    Wrench, 
    Loader2,
    CalendarDays,
    CalendarCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { operationService } from '@/services/api';
import { useEffect, useState, useMemo } from 'react';

export default function SchedulesPage() {
    const [rawSchedules, setRawSchedules] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState(new Date());

    const fetchSchedules = async () => {
        setIsLoading(true);
        try {
            const data = await operationService.getSchedules();
            setRawSchedules(Array.isArray(data) ? data : []);
            
            // Set initial start date to Sunday of the current week
            const today = new Date();
            const sunday = new Date(today);
            sunday.setDate(today.getDate() - today.getDay());
            setStartDate(sunday);
        } catch (error) {
            console.error('Failed to fetch schedules:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    // Generate 7 days starting from startDate - Using Local Date Logic
    const visibleDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            
            // Format to YYYY-MM-DD using local time to match API comparison
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const dateStr = `${d.getFullYear()}-${month}-${day}`;
            
            const dayName = d.toLocaleDateString('default', { weekday: 'short' });
            const dayNum = d.getDate();
            const monthLabel = d.toLocaleString('default', { month: 'short' });
            
            // Find tasks from API matching this local date
            const dayData = rawSchedules.find(item => item.date === dateStr);
            const tasks = dayData ? dayData.tasks : [];

            days.push({
                dateKey: dateStr,
                dayName,
                dayNum,
                monthLabel,
                year: d.getFullYear(),
                tasks: tasks
            });
        }
        return days;
    }, [startDate, rawSchedules]);

    const handlePrev = () => {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() - 7);
        setStartDate(d);
    };

    const handleNext = () => {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + 7);
        setStartDate(d);
    };

    const handleToday = () => {
        const today = new Date();
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - today.getDay());
        setStartDate(sunday);
    };

    // Calculate current range label
    const rangeLabel = visibleDays.length > 0 
        ? `${visibleDays[0].monthLabel} ${visibleDays[0].dayNum} - ${visibleDays[6].monthLabel} ${visibleDays[6].dayNum}, ${visibleDays[6].year}`
        : 'Weekly Schedule';

    return (
        <PageShell 
            title="Maintenance Schedules" 
            description="Operational timeline with detailed task distribution by date." 
            breadcrumbs={[{ label: "Operations", href: "/dashboard/operations" }, { label: "Schedules" }]}
            actions={
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl h-11 px-4 font-bold border-border/50 text-xs" onClick={handleToday}>
                        Today
                    </Button>
                    <div className="flex gap-1 items-center bg-secondary/20 p-1 rounded-2xl border border-border/50">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={handlePrev}><ChevronLeft className="h-4 w-4" /></Button>
                        <div className="px-4 text-[10px] font-black min-w-[150px] text-center uppercase tracking-tight">{rangeLabel}</div>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={handleNext}><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            }
        >
            <div className="grid gap-8">
                <Card className="rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm p-4 overflow-hidden overflow-x-auto shadow-2xl">
                    <div className="flex gap-4 min-w-[1200px]">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center py-40 gap-4"
                                >
                                    <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
                                    <p className="text-muted-foreground/40 italic text-sm font-medium tracking-tight">Syncing Schedule Logs...</p>
                                </motion.div>
                            ) : visibleDays.map((day, idx) => {
                                // Today comparison using local date strings
                                const todayStr = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0');
                                const isToday = day.dateKey === todayStr;

                                return (
                                    <motion.div 
                                        key={day.dateKey}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex-1 min-h-[500px] border-r border-border/30 last:border-none px-2 py-4 space-y-4 group"
                                    >
                                        {/* Date Header - Focused on Date and Day Name */}
                                        <div className={`text-center space-y-1 py-6 rounded-[2rem] transition-all duration-500 ${
                                            isToday 
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' 
                                            : 'bg-secondary/20 group-hover:bg-secondary/40'
                                        }`}>
                                            <p className="text-[10px] uppercase font-black tracking-widest opacity-60">{day.dayName}</p>
                                            <div className="flex flex-col items-center leading-none">
                                                <p className="text-4xl font-black">{day.dayNum}</p>
                                                <p className="text-[10px] uppercase font-bold opacity-60 mt-1">{day.monthLabel}</p>
                                            </div>
                                        </div>

                                        {/* Tasks for the Day */}
                                        <div className="space-y-3 pt-2">
                                            {day.tasks.length > 0 ? (
                                                day.tasks.map((task: any) => (
                                                    <motion.div
                                                        key={task.id}
                                                        whileHover={{ y: -4, scale: 1.02 }}
                                                        className="p-4 rounded-3xl bg-background border border-border/40 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group/item"
                                                    >
                                                        <div className={`absolute top-0 left-0 w-1 h-full ${
                                                            task.priority === 'HIGH' || task.priority === 'CRITICAL' ? 'bg-rose-500' : 'bg-primary/20'
                                                        }`} />
                                                        <div className="flex justify-between items-start mb-2">
                                                            <Badge variant="outline" className={`rounded-xl px-2 py-0.5 text-[8px] border-none font-black ${
                                                                task.type === 'WORK_ORDER' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'
                                                            }`}>
                                                                {task.type === 'WORK_ORDER' ? 'WO' : 'PM'}
                                                            </Badge>
                                                            <span className="text-[10px] font-mono font-bold opacity-30 group-hover/item:opacity-60">
                                                                {task.priority?.[0] || ''}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-[11px] font-extrabold leading-snug line-clamp-2 h-8">{task.title}</h4>
                                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/20">
                                                            <div className="h-6 w-6 rounded-xl bg-secondary flex items-center justify-center text-[9px] font-black">
                                                                {task.tech?.split(' ').map((n: string) => n[0]).join('') || '??'}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-bold opacity-40 uppercase truncate leading-none group-hover/item:text-primary transition-colors">
                                                                    {task.status}
                                                                </span>
                                                                <span className="text-[8px] opacity-30 font-bold mt-0.5">
                                                                    {task.tech || 'Unassigned'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="h-40 rounded-[2.5rem] border-2 border-dashed border-border/10 flex flex-col items-center justify-center gap-3 opacity-20 group-hover:opacity-40 transition-all">
                                                    <CalendarCheck className="h-6 w-6" />
                                                    <span className="text-[8px] uppercase font-black tracking-tighter">Day Clear</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </Card>

                {/* Legend/Info */}
                <div className="flex justify-center gap-8 py-2">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Work Orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Preventive Plans</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Critical Priority</span>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
