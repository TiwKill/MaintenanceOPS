'use client';

import { Suspense, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTelemetrySocket } from "@/hooks/use-telemetry-socket";
import DashboardScene from "@/components/dashboard/dashboard-scene";
import { Activity, Thermometer, Zap, CheckCircle, AlertTriangle, XCircle, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GlobalHealthData {
  event: string;
  active_assets: number;
  avg_vibration: number;
  avg_temperature: number;
  overall_status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  timestamp: number;
}

const WS_URL = 'wss://multipothtech.ddns.net/api/maintenance_ops/v1/ws/telemetry';

// Mock Generator
const generateHealthMock = (): GlobalHealthData => ({
  event: "global_update",
  active_assets: 5,
  avg_vibration: 1.2 + Math.random() * 0.5,
  avg_temperature: 55 + Math.random() * 5,
  overall_status: Math.random() > 0.8 ? 'WARNING' : 'HEALTHY',
  timestamp: Date.now()
});

export default function HealthPage() {
  const { data, status } = useTelemetrySocket<GlobalHealthData>(WS_URL, {
    mockDataGenerator: generateHealthMock
  });

  const healthData = data || {
    active_assets: 0,
    avg_vibration: 0,
    avg_temperature: 0,
    overall_status: 'HEALTHY' as const,
  };

  const statusConfig = {
    HEALTHY: { color: "bg-emerald-500", text: "text-emerald-500", icon: CheckCircle, label: "Healthy", description: "All systems nominal" },
    WARNING: { color: "bg-amber-500", text: "text-amber-500", icon: AlertTriangle, label: "Warning", description: "Attention required" },
    CRITICAL: { color: "bg-red-500", text: "text-red-500", icon: XCircle, label: "Critical", description: "Immediate action needed" },
  };

  const currentStatus = statusConfig[healthData.overall_status] || statusConfig.HEALTHY;
  const StatusIcon = currentStatus.icon;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
        y: 0, 
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  const pieData = [
    { name: 'Healthy', value: 70 },
    { name: 'Warning', value: 20 },
    { name: 'Critical', value: 10 },
  ];
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden p-6">
      {/* 3D Background - Reused */}
      <DashboardScene />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          
          <motion.div variants={item} className="flex flex-col space-y-2">
            <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl">
              Plant Health
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Real-time overview of global asset telemetry and operational status.
            </p>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-l-4 border-l-primary dark:border-l-primary overflow-hidden backdrop-blur-3xl bg-background/50 border-input/50 shadow-sm">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${currentStatus.color}`} />
              <CardContent className="p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <StatusIcon className={`h-8 w-8 ${currentStatus.text}`} />
                    <h2 className="text-3xl font-medium tracking-tight">{currentStatus.label}</h2>
                  </div>
                  <p className="text-muted-foreground">{currentStatus.description}</p>
                </div>
                <div className="text-left sm:text-right flex items-center gap-2 sm:block">
                   <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">System Status</div>
                   <Badge variant="outline" className={`text-xs font-mono uppercase tracking-widest px-3 py-1 ${
                       status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                       status === 'SIMULATED' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                       'bg-red-500/10 text-red-500 border-red-500/20'
                   }`}>
                      {status === 'CONNECTED' ? 'ONLINE' : status === 'SIMULATED' ? 'SIMULATED' : 'OFFLINE'}
                   </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <motion.div variants={item}>
              <Card className="backdrop-blur-md bg-background/40 hover:bg-background/60 transition-colors border-input/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Zap className="h-4 w-4" /> Active Assets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tighter">
                      {healthData.active_assets}
                    </span>
                    <span className="text-sm text-muted-foreground">units</span>
                  </div>
                  <div className="mt-4 h-1.5 w-full bg-muted/50 overflow-hidden rounded-full">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-foreground" 
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

             <motion.div variants={item}>
              <Card className="backdrop-blur-md bg-background/40 hover:bg-background/60 transition-colors border-input/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Avg Vibration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tighter">
                      {healthData.avg_vibration?.toFixed(2) || '0.00'}
                    </span>
                    <span className="text-sm text-muted-foreground">mm/s</span>
                  </div>
                   <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Current</span>
                    <span>Threshold: 2.0</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

             <motion.div variants={item}>
              <Card className="backdrop-blur-md bg-background/40 hover:bg-background/60 transition-colors border-input/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                     <Thermometer className="h-4 w-4" /> Avg Temp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tighter">
                      {healthData.avg_temperature?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-sm text-muted-foreground">°C</span>
                  </div>
                   <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Current</span>
                    <span>Target: &lt; 65°C</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Health Distribution Custom Gauge */}
             <motion.div variants={item} className="h-full">
                <Card className="h-full border-input/50 bg-background/40 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gauge className="h-5 w-5" /> Plant Health Distribution
                        </CardTitle>
                        <CardDescription>
                            Efficiency breakdown across all monitored assets
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-6 h-[300px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-bold tracking-tighter">92%</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Efficiency</span>
                        </div>
                    </CardContent>
                </Card>
             </motion.div>

             {/* Recent Events / Log Stream Placeholder */}
             <motion.div variants={item} className="h-full">
                 <Card className="h-full border-input/50 bg-background/40 backdrop-blur-md">
                     <CardHeader>
                         <CardTitle>System Logs</CardTitle>
                         <CardDescription>Recent telemetry events</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-6 relative">
                            <div className="absolute left-1.5 top-0 bottom-0 w-px bg-border/50" />
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="relative flex gap-4">
                                    <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-background mt-1.5 z-10" />
                                    <div>
                                        <p className="text-sm font-medium leading-none">Global status synchronization</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Telemetry data aggregated from {healthData.active_assets} active nodes.
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2 font-mono opacity-70">
                                            {new Date().toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </CardContent>
                 </Card>
             </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
