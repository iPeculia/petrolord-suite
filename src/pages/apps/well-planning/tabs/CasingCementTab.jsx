import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, CheckCircle2, AlertCircle, Clock, Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const WorkflowStatusBadge = ({ status }) => {
    const styles = {
        'Not Started': 'bg-slate-700 text-slate-400 border-slate-600',
        'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'Approved': 'bg-green-500/10 text-green-400 border-green-500/20',
        'Review': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };
    return (
        <Badge variant="outline" className={`${styles[status] || styles['Not Started']} border`}>
            {status}
        </Badge>
    );
};

const KPIValue = ({ label, value, unit, status = 'neutral' }) => {
    const colors = {
        neutral: 'text-white',
        good: 'text-emerald-400',
        warning: 'text-yellow-400',
        error: 'text-red-400'
    };
    return (
        <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</span>
            <div className="flex items-baseline mt-1">
                <span className={`text-xl font-mono font-bold ${colors[status]}`}>{value}</span>
                {unit && <span className="ml-1 text-xs text-slate-500">{unit}</span>}
            </div>
        </div>
    );
};

const CasingCementTab = ({ wellId }) => {
    const navigate = useNavigate();

    // Mock Data (In real app, fetch from casing_schemes table)
    const casingStatus = "In Progress";
    const kpis = {
        strings: 3,
        totalCost: 1.25, // MM USD
        deepestShoe: 12500,
        integrity: "Pass"
    };
    const pendingItems = [
        { id: 1, text: "Production casing burst check", priority: "High" },
        { id: 2, text: "Cement slurry volume calculation", priority: "Medium" },
        { id: 3, text: "Approval workflow initiation", priority: "Low" }
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <Layers className="mr-3 h-6 w-6 text-orange-400" />
                        Casing & Cementing
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Manage tubular design, load cases, and cementing programs.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 mr-2">Workflow Status:</span>
                    <WorkflowStatusBadge status={casingStatus} />
                </div>
            </div>

            {/* Main Dashboard Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: KPIs & Launch */}
                <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg text-white">Design Summary</CardTitle>
                            <Button 
                                size="sm" 
                                onClick={() => navigate(`/dashboard/apps/drilling/casing-tubing-design?wellId=${wellId}`)}
                                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-900/20"
                            >
                                Open Designer <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <KPIValue label="Casing Strings" value={kpis.strings} unit="runs" />
                            <KPIValue label="Deepest Shoe" value={kpis.deepestShoe.toLocaleString()} unit="ft" />
                            <KPIValue label="Est. Cost" value={`$${kpis.totalCost}`} unit="MM" />
                            <KPIValue label="Shoe Integrity" value={kpis.integrity} status={kpis.integrity === 'Pass' ? 'good' : 'error'} />
                        </div>

                        <div className="bg-slate-950/50 rounded-lg border border-slate-800 p-4">
                            <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
                                <Database className="w-4 h-4 mr-2 text-blue-400" />
                                Schematic Preview
                            </h4>
                            {/* Simple Visual Representation of Casing Strings */}
                            <div className="h-32 flex items-end justify-center gap-1 border-b border-slate-700 relative">
                                <div className="absolute top-0 left-0 text-[10px] text-slate-600">Surface</div>
                                <div className="w-8 bg-slate-700 h-full rounded-t-sm mx-auto opacity-50 relative top-0 border-x border-slate-500" title="Conductor"></div>
                                <div className="w-6 bg-slate-600 h-[80%] rounded-t-sm mx-auto absolute bottom-0 border-x border-slate-500" title="Surface"></div>
                                <div className="w-4 bg-slate-500 h-[60%] rounded-t-sm mx-auto absolute bottom-0 border-x border-slate-500" title="Intermediate"></div>
                                <div className="w-2 bg-orange-900/50 h-[40%] rounded-t-sm mx-auto absolute bottom-0 border-x border-orange-500/50" title="Production"></div>
                            </div>
                            <div className="text-center text-[10px] text-slate-500 mt-1">TD: {kpis.deepestShoe} ft</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Workflow & Pending */}
                <Card className="bg-slate-900 border-slate-800 flex flex-col">
                    <CardHeader className="border-b border-slate-800 pb-4">
                        <CardTitle className="text-lg text-white">Action Items</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pt-4">
                        <div className="space-y-4">
                            {pendingItems.map(item => (
                                <div key={item.id} className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded border border-slate-700/50">
                                    {item.priority === 'High' ? (
                                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    ) : (
                                        <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <p className="text-sm text-slate-200">{item.text}</p>
                                        <span className={`text-[10px] font-bold uppercase ${item.priority === 'High' ? 'text-red-400' : 'text-slate-500'}`}>
                                            {item.priority} Priority
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {pendingItems.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 py-10">
                                    <CheckCircle2 className="w-10 h-10 mb-2 text-green-500/50" />
                                    <p>All tasks completed</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-slate-800 pt-4">
                        <Button variant="ghost" className="w-full text-xs text-slate-400 hover:text-white">View Full Workflow</Button>
                    </CardFooter>
                </Card>
            </div>
        </motion.div>
    );
};

export default CasingCementTab;