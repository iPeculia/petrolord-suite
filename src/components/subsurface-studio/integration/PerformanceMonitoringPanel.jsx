import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Cpu, Zap } from 'lucide-react';

const PerformanceMonitoringPanel = () => {
    const [fps, setFps] = useState(0);
    const [memory, setMemory] = useState(0);

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        let animationFrameId;

        const loop = () => {
            const now = performance.now();
            frameCount++;
            if (now - lastTime >= 1000) {
                setFps(Math.round((frameCount * 1000) / (now - lastTime)));
                frameCount = 0;
                lastTime = now;
                
                // Check memory if available in Chrome
                if (performance.memory) {
                    setMemory(Math.round(performance.memory.usedJSHeapSize / 1048576));
                }
            }
            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <Activity className="w-4 h-4 mr-2 text-red-400" /> System Performance
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Zap className="w-3 h-3" /> Rendering (FPS)
                    </div>
                    <div className={`text-sm font-mono font-bold ${fps < 30 ? 'text-red-400' : 'text-green-400'}`}>
                        {fps}
                    </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Cpu className="w-3 h-3" /> Memory (MB)
                    </div>
                    <div className="text-sm font-mono font-bold text-blue-400">
                        {memory || 'N/A'}
                    </div>
                </div>

                <div className="text-[10px] text-slate-500 italic mt-2">
                    Optimization active: Level-of-Detail (LOD) enabled. Frustum culling active.
                </div>
            </CardContent>
        </Card>
    );
};

export default PerformanceMonitoringPanel;