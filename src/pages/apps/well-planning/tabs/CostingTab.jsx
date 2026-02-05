import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ArrowRight, PieChart, TrendingUp, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const WorkflowStatusBadge = ({ status }) => {
    const styles = {
        'Draft': 'bg-slate-700 text-slate-400 border-slate-600',
        'Review': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'Approved': 'bg-green-500/10 text-green-400 border-green-500/20',
        'Over Budget': 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
        <Badge variant="outline" className={`${styles[status] || styles['Draft']} border`}>
            {status}
        </Badge>
    );
};

const CostingTab = ({ wellId }) => {
    const navigate = useNavigate();

    // Mock Data
    const afeStatus = "Draft";
    const budgetUtilization = 65; // %
    const costData = {
        totalAFE: 8.5, // MM USD
        variance: -0.2, // MM USD (Under budget)
        p50: 8.5,
        p90: 9.2
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <DollarSign className="mr-3 h-6 w-6 text-emerald-400" />
                        Cost Control & AFE
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Estimate well costs, manage AFEs, and track budget variance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 mr-2">AFE Status:</span>
                    <WorkflowStatusBadge status={afeStatus} />
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Cost Summary Card */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg text-white">Financial Overview</CardTitle>
                            <Button 
                                size="sm" 
                                onClick={() => navigate(`/dashboard/apps/economics/afe-cost-control?wellId=${wellId}`)}
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-900/20"
                            >
                                Open Cost Manager <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                                <div className="text-slate-500 text-xs uppercase font-bold mb-1">Total AFE (P50)</div>
                                <div className="text-2xl font-mono font-bold text-white">${costData.totalAFE.toFixed(2)} MM</div>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                                <div className="text-slate-500 text-xs uppercase font-bold mb-1">Variance</div>
                                <div className={`text-2xl font-mono font-bold ${costData.variance <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {costData.variance > 0 ? '+' : ''}{costData.variance.toFixed(2)} MM
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Budget Utilization</span>
                                <span className="text-white font-mono">{budgetUtilization}%</span>
                            </div>
                            <Progress value={budgetUtilization} className="h-2 bg-slate-800" indicatorClassName="bg-emerald-500" />
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                            <span>P10: ${(costData.p50 * 0.85).toFixed(1)} MM</span>
                            <span>P90: ${costData.p90.toFixed(1)} MM</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Breakdown & Alerts */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="py-4 border-b border-slate-800">
                            <CardTitle className="text-base text-white">Pending Approvals</CardTitle>
                        </CardHeader>
                        <CardContent className="py-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700/50">
                                    <div className="flex items-center">
                                        <FileText className="w-4 h-4 text-blue-400 mr-3" />
                                        <div>
                                            <div className="text-sm text-white">Drilling AFE - Section 1</div>
                                            <div className="text-xs text-slate-500">Submitted 2 days ago</div>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-yellow-400 border-yellow-500/20 bg-yellow-500/10">Pending</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="py-4 border-b border-slate-800">
                            <CardTitle className="text-base text-white flex items-center">
                                <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
                                Cost Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-4">
                            <div className="text-sm text-slate-400">
                                No active cost alerts. Project is currently tracking within P50 estimates.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};

export default CostingTab;