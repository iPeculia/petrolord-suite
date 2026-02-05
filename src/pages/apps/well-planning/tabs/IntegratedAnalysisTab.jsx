import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, AlertTriangle, CheckCircle2, ChevronRight, Database, 
  Layers, HardHat, FileText, ArrowUpRight, ShieldCheck, Gauge 
} from 'lucide-react';
import TrajectoryKPIs from '../components/TrajectoryKPIs';

const StatusCard = ({ title, status, label, icon: Icon, onClick }) => {
    const colors = {
        success: 'bg-green-500/10 text-green-400 border-green-500/20',
        warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        error: 'bg-red-500/10 text-red-400 border-red-500/20',
        neutral: 'bg-slate-800 text-slate-400 border-slate-700'
    };
    
    return (
        <div 
            onClick={onClick}
            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer hover:bg-opacity-50 transition-all ${colors[status] || colors.neutral}`}
        >
            <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 bg-black/20`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold opacity-90">{title}</h4>
                    <p className="text-xs opacity-70">{label}</p>
                </div>
            </div>
            <div className="flex items-center">
                {status === 'success' && <CheckCircle2 className="w-5 h-5" />}
                {status === 'warning' && <AlertTriangle className="w-5 h-5" />}
                {status === 'error' && <AlertTriangle className="w-5 h-5" />}
                {onClick && <ChevronRight className="w-4 h-4 ml-2 opacity-50" />}
            </div>
        </div>
    );
};

const IntegratedAnalysisTab = ({ wellId, user }) => {
    const [loading, setLoading] = useState(true);
    const [wellData, setWellData] = useState(null);
    const [trajectorySummary, setTrajectorySummary] = useState(null);
    const [acSummary, setAcSummary] = useState(null);
    const [linkedProjects, setLinkedProjects] = useState({ ppfg: null, geomech: null });
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const fetchAnalysisData = async () => {
            if (!wellId) return;
            setLoading(true);
            try {
                // 1. Get Well Info
                const { data: well } = await supabase.from('wells').select('*').eq('id', wellId).single();
                setWellData(well);

                // 2. Get Latest Trajectory Stats
                const { data: traj } = await supabase
                    .from('trajectory_plans')
                    .select('stations')
                    .eq('well_id', wellId)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();
                
                if (traj?.stations?.length > 0) {
                    const last = traj.stations[traj.stations.length - 1];
                    const maxInc = Math.max(...traj.stations.map(s => s.INC));
                    const maxDls = Math.max(...traj.stations.map(s => s.DLS || 0));
                    setTrajectorySummary({
                        totalMD: last.MD,
                        totalTVD: last.TVD,
                        horizontalDisplacement: last.ClosureDist,
                        maxInclination: maxInc,
                        maxDLS: maxDls,
                        wellheadLat: traj.stations[0].lat,
                        wellheadLon: traj.stations[0].lon
                    });
                }

                // 3. Get AC Stats (Mock check if collision check exists)
                // In real app, query 'anticollision_checks' table if it existed, or local state
                // For demo, we check if there are any plans
                setAcSummary({ status: 'neutral', message: 'Not run yet' });

                // 4. Check Linked Projects (Mock for ecosystem)
                // Assuming well metadata holds links or we query by name pattern
                setLinkedProjects({
                    ppfg: { id: 'mock-ppfg', name: 'Field A - Pore Pressure Base', status: 'Available' },
                    geomech: { id: null, name: 'No Geomech Model', status: 'Missing' }
                });

            } catch (error) {
                console.error("Analysis load error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysisData();
    }, [wellId]);

    const navigateToApp = (appId) => {
        toast({ title: "Opening App", description: `Navigating to ${appId}...` });
        // Real navigation would go to /dashboard/apps/...
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
            {/* Top Level Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Feasibility Traffic Light */}
                <Card className="bg-slate-900 border-slate-800 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold text-white flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-lime-400" /> Feasibility Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <StatusCard 
                            title="Trajectory Design" 
                            status={trajectorySummary ? (trajectorySummary.maxDLS < 5 ? 'success' : 'warning') : 'neutral'} 
                            label={trajectorySummary ? `Max DLS: ${trajectorySummary.maxDLS.toFixed(2)}` : 'No Design'} 
                            icon={ArrowUpRight} 
                        />
                        <StatusCard 
                            title="Collision Risk" 
                            status={acSummary.status} 
                            label={acSummary.message} 
                            icon={ShieldCheck} 
                        />
                        <StatusCard 
                            title="PPFG Window" 
                            status={linkedProjects.ppfg?.id ? 'success' : 'warning'} 
                            label={linkedProjects.ppfg?.name || 'Not Linked'} 
                            icon={Gauge} 
                        />
                    </CardContent>
                </Card>

                {/* 2. Trajectory KPIs */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <h3 className="text-white font-bold mb-4 flex items-center"><Layers className="mr-2 w-5 h-5 text-blue-400"/> Current Plan KPIs</h3>
                        <TrajectoryKPIs summary={trajectorySummary} depthUnit={wellData?.depth_unit === 'feet' ? 'ft' : 'm'} />
                    </div>
                    
                    {/* Ecosystem Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-lime-500/50 transition-all group" onClick={() => navigateToApp('PPFG')}>
                            <Gauge className="w-6 h-6 mb-2 text-blue-400 group-hover:scale-110 transition-transform"/>
                            <span className="text-xs font-bold text-slate-300">Open PPFG</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-lime-500/50 transition-all group" onClick={() => navigateToApp('Geomech')}>
                            <Database className="w-6 h-6 mb-2 text-purple-400 group-hover:scale-110 transition-transform"/>
                            <span className="text-xs font-bold text-slate-300">Geomechanics</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-lime-500/50 transition-all group" onClick={() => navigateToApp('Casing')}>
                            <HardHat className="w-6 h-6 mb-2 text-orange-400 group-hover:scale-110 transition-transform"/>
                            <span className="text-xs font-bold text-slate-300">Casing Design</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-lime-500/50 transition-all group" onClick={() => navigateToApp('AFE')}>
                            <FileText className="w-6 h-6 mb-2 text-green-400 group-hover:scale-110 transition-transform"/>
                            <span className="text-xs font-bold text-slate-300">AFE / Cost</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Detailed Integration View (Placeholder for Phase 5) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 min-h-[300px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Safe Mud Window (PPFG Integration)</h3>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Live Link</Badge>
                    </div>
                    <div className="flex items-center justify-center h-full text-slate-500 pb-10">
                        {linkedProjects.ppfg?.id ? (
                            <div className="text-center">
                                <Gauge className="w-12 h-12 mx-auto mb-2 text-slate-700" />
                                <p>Drilling Margin: 0.5 ppg</p>
                                <p className="text-xs">Visualize safe mud weight window against trajectory depth.</p>
                            </div>
                        ) : (
                            <p>No PPFG project linked.</p>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 min-h-[300px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Wellbore Stability (Geomech Integration)</h3>
                        <Badge variant="outline" className="bg-slate-800 text-slate-500 border-slate-700">Not Linked</Badge>
                    </div>
                    <div className="flex items-center justify-center h-full text-slate-500 pb-10">
                        <div className="text-center">
                            <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-slate-700" />
                            <p>Link Geomechanics project to see breakout/breakdown risks.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default IntegratedAnalysisTab;