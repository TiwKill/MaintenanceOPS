'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTelemetrySocket } from "@/hooks/use-telemetry-socket";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { Activity, Gauge as GaugeIcon, Thermometer, Cpu, ArrowLeft, RefreshCw, Power } from "lucide-react";
import { motion } from "framer-motion";
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, OrbitControls, Cylinder, Torus, Box, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Types
interface AssetData {
  vibration_mm_s: number;
  temperature_c: number;
  rpm: number;
  status: 'RUNNING' | 'IDLE' | 'STOPPED' | 'ERROR';
  timestamp: string;
}

interface AssetUpdate {
  event: string;
  asset_id: string;
  data: AssetData;
}

// 3D Component
function MachineModel({ isRunning, rpm }: { isRunning: boolean, rpm: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current && isRunning) {
        // Rotate based on RPM (scaled down)
        const speed = (rpm / 1000) * 5; 
        groupRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Abstract Industrial Motor Look */}
      <Cylinder args={[1, 1, 2, 32]} rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#27272a" roughness={0.4} metalness={0.8} />
      </Cylinder>
      <Cylinder args={[1.1, 1.1, 0.2, 32]} rotation={[0, 0, Math.PI / 2]} position={[0.9, 0, 0]}>
         <meshStandardMaterial color="#3f3f46" roughness={0.3} metalness={0.9} />
      </Cylinder>
      <Cylinder args={[1.1, 1.1, 0.2, 32]} rotation={[0, 0, Math.PI / 2]} position={[-0.9, 0, 0]}>
         <meshStandardMaterial color="#3f3f46" roughness={0.3} metalness={0.9} />
      </Cylinder>
      
      {/* Emissive Ring indicating status */}
      <Torus args={[1.2, 0.05, 16, 100]} rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
         <meshBasicMaterial color={isRunning ? "#10b981" : "#ef4444"} toneMapped={false} />
      </Torus>
      
      {/* Floating Elements */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
         <Box args={[0.2, 0.2, 0.2]} position={[1.5, 1, 0]}>
             <MeshTransmissionMaterial resolution={512} thickness={0.2} roughness={0.1} color="#ffffff" />
         </Box>
         <Box args={[0.1, 0.1, 0.1]} position={[-1.5, -1, 0.5]}>
             <MeshTransmissionMaterial resolution={512} thickness={0.2} roughness={0.1} color="#ffffff" />
         </Box>
      </Float>
    </group>
  );
}

const MAX_HISTORY = 50;

export default function MachineDetailPage() {
  const params = useParams();
  const machineId = params.machinesId as string;
  const wsUrl = `wss://multipothtech.ddns.net/api/maintenance_ops/v1/ws/telemetry/${machineId}`;

  const [history, setHistory] = useState<(AssetData & { timeStr: string })[]>([]);
  
  
  // Mock Generator
  const generateMachineMock = (): AssetUpdate => ({
    event: 'asset_update',
    asset_id: machineId,
    data: {
      vibration_mm_s: 2.0 + (Math.random() - 0.5) * 1.5,
      temperature_c: 58 + (Math.random() - 0.5) * 5,
      rpm: 1450 + Math.floor((Math.random() - 0.5) * 100),
      status: Math.random() > 0.95 ? 'ERROR' : 'RUNNING',
      timestamp: new Date().toISOString()
    }
  });

  // Custom hook usage with callback to update history
  const { data: latestUpdate, status: connectionStatus } = useTelemetrySocket<AssetUpdate>(wsUrl, {
    mockDataGenerator: generateMachineMock,
    onMessage: (msg: AssetUpdate) => {
      if (msg.event === 'asset_update' && msg.data) {
        setHistory(prev => {
          const newData = {
              ...msg.data,
              timeStr: new Date(msg.data.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' })
          };
          const newHistory = [...prev, newData];
          return newHistory.slice(-MAX_HISTORY); // Keep only last N points
        });
      }
    }
  });

  const currentData = latestUpdate?.data || {
    vibration_mm_s: 0,
    temperature_c: 0,
    rpm: 0,
    status: 'STOPPED' as const,
    timestamp: new Date().toISOString()
  };

  const isRunning = currentData.status === 'RUNNING';

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 selection:bg-foreground selection:text-background pb-20">
      
      {/* Navigation & Header */}
      <div className="max-w-[1600px] mx-auto space-y-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Link href="/dashboard/analytics/health">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
             </Link>
             <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Asset ID: {machineId.slice(0,8)}...</p>
                <div className="flex items-center gap-3">
                   <h1 className="text-3xl font-bold tracking-tight">Main Turbine Generator</h1>
                   <Badge variant={isRunning ? "default" : "destructive"} className="px-2 py-0.5">
                      {currentData.status}
                   </Badge>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full text-xs font-medium text-muted-foreground">
                <div className={`h-2 w-2 rounded-full ${
                    connectionStatus === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 
                    connectionStatus === 'SIMULATED' ? 'bg-amber-500 animate-pulse' :
                    'bg-red-500'
                }`} />
                {connectionStatus === 'CONNECTED' ? 'LIVE STREAM' : connectionStatus === 'SIMULATED' ? 'SIMULATION' : 'OFFLINE'}
             </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
           {/* Left: 3D Visualization */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.7 }}
             className="lg:col-span-8 relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/5 shadow-2xl"
           >
              <div className="absolute inset-0 z-0">
                  <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
                      <color attach="background" args={['#09090b']} />
                      <ambientLight intensity={0.5} />
                      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                      <pointLight position={[-10, -10, -10]} intensity={0.5} />
                      
                      <MachineModel isRunning={isRunning} rpm={currentData.rpm} />
                      
                      <OrbitControls enableZoom={false} autoRotate={!isRunning} autoRotateSpeed={0.5} />
                      <PerspectiveCamera makeDefault position={[3, 2, 5]} />
                  </Canvas>
              </div>
              
              {/* Overlay Stats in 3D View */}
              <div className="absolute bottom-6 left-6 z-10 flex gap-4">
                  <div className="glass-card backdrop-blur-md bg-black/50 border border-white/10 p-4 rounded-xl min-w-[120px]">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <GaugeIcon className="h-4 w-4" />
                          <span className="text-xs uppercase tracking-wider">RPM</span>
                      </div>
                      <p className="text-3xl font-mono font-bold text-white">{currentData.rpm}</p>
                  </div>
                  <div className="glass-card backdrop-blur-md bg-black/50 border border-white/10 p-4 rounded-xl min-w-[120px]">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Activity className="h-4 w-4" />
                          <span className="text-xs uppercase tracking-wider">Vibration</span>
                      </div>
                      <p className="text-3xl font-mono font-bold text-white">{currentData.vibration_mm_s.toFixed(2)}</p>
                      <span className="text-xs text-zinc-500">mm/s</span>
                  </div>
              </div>
           </motion.div>

           {/* Right: Key Stats & Quick Actions */}
           <div className="lg:col-span-4 flex flex-col gap-6">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
               >
                   <Card className="h-full border-input/50 backdrop-blur-sm shadow-sm bg-background/50">
                       <CardHeader>
                           <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Temperature</CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-4">
                           <div className="flex items-baseline justify-between">
                               <div className="flex items-baseline gap-2">
                                   <span className="text-6xl font-thin tracking-tighter text-foreground">
                                       {currentData.temperature_c.toFixed(1)}
                                   </span>
                                   <span className="text-xl text-muted-foreground">°C</span>
                               </div>
                               <Thermometer className={`h-8 w-8 ${currentData.temperature_c > 65 ? 'text-red-500' : 'text-emerald-500'}`} />
                           </div>
                           <div className="space-y-2">
                               <div className="flex justify-between text-xs text-muted-foreground">
                                   <span>Optimal Range</span>
                                   <span>40 - 70 °C</span>
                               </div>
                               <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                   <div 
                                      className={`h-full transition-all duration-500 ease-out ${currentData.temperature_c > 65 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                      style={{ width: `${Math.min((currentData.temperature_c / 100) * 100, 100)}%` }} 
                                   />
                               </div>
                           </div>
                       </CardContent>
                   </Card>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="flex-1"
               >
                  <Card className="h-full border-input/50 backdrop-blur-sm shadow-sm bg-background/50 flex flex-col justify-center gap-4 p-6">
                      <Button className="w-full" variant="outline">
                          <RefreshCw className="mr-2 h-4 w-4" /> Calibrate Sensors
                      </Button>
                      <Button className="w-full" variant={isRunning ? "destructive" : "default"}>
                          <Power className="mr-2 h-4 w-4" /> {isRunning ? "Emergency Stop" : "Start Machine"}
                      </Button>
                  </Card>
               </motion.div>
           </div>
        </div>

        {/* Real-time Charts Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
            <Card className="border-input/50 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-light flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" /> Vibration History
                    </CardTitle>
                    <CardDescription>Real-time vibration analysis (mm/s)</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient id="vibrationGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                            <XAxis 
                                dataKey="timeStr" 
                                tick={{fontSize: 10, fill: '#71717a'}} 
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis 
                                domain={[0, 'auto']} 
                                tick={{fontSize: 10, fill: '#71717a'}} 
                                tickLine={false}
                                axisLine={false}
                                width={30}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '12px' }}
                                itemStyle={{ color: '#e4e4e7' }}
                            />
                             <ReferenceLine y={2.5} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right',  value: 'Limit', fill: '#ef4444', fontSize: 10 }} />
                            <Area 
                                type="monotone" 
                                dataKey="vibration_mm_s" 
                                stroke="#8b5cf6" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#vibrationGradient)" 
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="border-input/50 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-light flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-primary" /> Thermal Monitor
                    </CardTitle>
                    <CardDescription>Continuous temperature tracking (°C)</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={history}>
                             <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                            <XAxis 
                                dataKey="timeStr" 
                                tick={{fontSize: 10, fill: '#71717a'}} 
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis 
                                domain={['auto', 'auto']} 
                                tick={{fontSize: 10, fill: '#71717a'}} 
                                tickLine={false}
                                axisLine={false}
                                width={30}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '12px' }}
                                itemStyle={{ color: '#e4e4e7' }}
                            />
                            <ReferenceLine y={65} stroke="#f59e0b" strokeDasharray="3 3" />
                            <Line 
                                type="monotone" 
                                dataKey="temperature_c" 
                                stroke="#10b981" 
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
      </div>
    </div>
  );
}
