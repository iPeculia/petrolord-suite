import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
    BrainCircuit, AlertTriangle, TrendingUp, ShieldCheck, 
    Lightbulb, BarChart3, RefreshCcw, CheckCircle2, 
    FileText, ChevronRight, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
    detectAnomalies, 
    analyzeTrends, 
    assessRisk, 
    compareWells, 
    generateAISummary 
} from '@/utils/petrophysicsAI';

const InsightCard = ({ insight }) => (
    <Card className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-all cursor-pointer group">
        <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${insight.score > 90 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                        <CardTitle className="text-base text-white">{insight.title}</CardTitle>
                        <CardDescription className="text-xs">{insight.category}</CardDescription>
                    </div>
                </div>
                <Badge variant="outline" className="bg-slate-950">{insight.score}% Conf.</Badge>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-slate-400 mb-3">{insight.details}</p>
            <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Impact: High</span>
                <span className="flex items-center text-blue-400 group-hover:underline">
                    View Analysis <ChevronRight className="w-3 h-3 ml-1" />
                </span>
            </div>
        </CardContent>
    </Card>
);

const AnomalyRow = ({ anomaly }) => (
    <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-950/50 border border-slate-800">
        <div className={`mt-1 ${anomaly.severity === 'High' ? 'text-red-500' : 'text-amber-500'}`}>
            <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium text-slate-200">{anomaly.type}</h4>
                <Badge variant={anomaly.severity === 'High' ? 'destructive' : 'secondary'} className="text-[10px]">
                    {anomaly.severity}
                </Badge>
            </div>
            <p className="text-xs text-slate-400">{anomaly.description}</p>
            <p className="text-[10px] text-slate-500 mt-1 font-mono">At: {anomaly.location}</p>
        </div>
        <Button size="sm" variant="ghost" className="h-8 text-xs hover:bg-slate-800">Dismiss</Button>
    </div>
);

const AIInsightsPanel = ({ petroState }) => {
    const { activeWellId, wells } = petroState;
    const activeWell = wells.find(w => w.id === activeWellId);
    
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (activeWell) {
            runAnalysis();
        }
    }, [activeWellId]); // Re-run on well change

    const runAnalysis = () => {
        setIsAnalyzing(true);
        // Simulate processing delay for "AI" feel
        setTimeout(() => {
            if (!activeWell) return;

            const anomalies = detectAnomalies(activeWell);
            const insights = analyzeTrends(activeWell);
            const risks = assessRisk(activeWell);
            const comparison = compareWells(activeWell, wells);
            const summary = generateAISummary(activeWell, insights, anomalies, risks);

            setAnalysis({ anomalies, insights, risks, comparison, summary });
            setIsAnalyzing(false);
        }, 1200);
    };

    if (!activeWell) {
        return (
            <div className="h-full flex items-center justify-center flex-col text-slate-500">
                <BrainCircuit className="w-16 h-16 mb-4 opacity-20" />
                <p>Select a well to generate AI insights.</p>
            </div>
        );
    }

    if (isAnalyzing || !analysis) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-slate-950">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BrainCircuit className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
                <h3 className="mt-6 text-lg font-medium text-white">Running AI Analysis Engine</h3>
                <p className="text-sm text-slate-500 mt-2">Processing log signatures, detecting anomalies, and computing risks...</p>
                <div className="w-64 mt-6 space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>Progress</span>
                        <span>72%</span>
                    </div>
                    <Progress value={72} className="h-1 bg-slate-800" />
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-950 p-4 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BrainCircuit className="w-6 h-6 text-purple-500" /> 
                        AI Insights & Recommendations
                    </h2>
                    <p className="text-xs text-slate-400">
                        Analysis for <span className="text-blue-400">{activeWell.name}</span> • Last run: Just now
                    </p>
                </div>
                <Button onClick={runAnalysis} variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800">
                    <RefreshCcw className="w-4 h-4 mr-2" /> Re-Analyze
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
                
                {/* Left Column: Summary & Anomalies */}
                <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
                    
                    {/* AI Summary Card */}
                    <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900 border-purple-500/30">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-purple-300 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Automated Interpretation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                {analysis.summary}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Anomalies List */}
                    <Card className="bg-slate-900 border-slate-800 flex-1">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-white text-sm">Detected Anomalies</CardTitle>
                                <Badge variant="secondary" className="bg-slate-800">{analysis.anomalies.length}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {analysis.anomalies.length > 0 ? (
                                analysis.anomalies.map((anomaly, idx) => (
                                    <AnomalyRow key={idx} anomaly={anomaly} />
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500/50" />
                                    <p>No significant anomalies detected.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Peer Comparison */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white text-sm">Peer Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-2xl font-bold text-white">#{analysis.comparison.rank}</div>
                                    <div className="text-xs text-slate-500">Rank in Project</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-emerald-400 flex items-center justify-end">
                                        {analysis.comparison.topPerformer.name} <ArrowUpRight className="w-3 h-3 ml-1" />
                                    </div>
                                    <div className="text-xs text-slate-500">Top Performer</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Avg Porosity</span>
                                    <span>vs Top: -{analysis.comparison.diffFromTop}</span>
                                </div>
                                <Progress value={(1 - Math.abs(parseFloat(analysis.comparison.diffFromTop)) * 2) * 100} className="h-1.5 bg-slate-800" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Insights, Recommendations, Risks */}
                <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
                    
                    <Tabs defaultValue="insights" className="flex-1 flex flex-col">
                        <TabsList className="bg-slate-900 border border-slate-800 w-full justify-start">
                            <TabsTrigger value="insights" className="data-[state=active]:bg-blue-600">
                                <Lightbulb className="w-4 h-4 mr-2" /> Insights
                            </TabsTrigger>
                            <TabsTrigger value="risks" className="data-[state=active]:bg-red-600">
                                <ShieldCheck className="w-4 h-4 mr-2" /> Risks & Uncertainty
                            </TabsTrigger>
                            <TabsTrigger value="optimization" className="data-[state=active]:bg-emerald-600">
                                <TrendingUp className="w-4 h-4 mr-2" /> Optimization
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="insights" className="flex-1 mt-4 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {analysis.insights.map((insight, idx) => (
                                    <InsightCard key={idx} insight={insight} />
                                ))}
                                {/* Fallback if empty */}
                                {analysis.insights.length === 0 && (
                                    <div className="col-span-2 p-12 text-center border border-dashed border-slate-800 rounded-lg text-slate-500">
                                        Running heuristics found no specific actionable insights. Try adding more log curves (DT, NPHI) for better analysis.
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="risks" className="flex-1 mt-4 overflow-y-auto">
                            <div className="space-y-4">
                                {analysis.risks.map((risk, idx) => (
                                    <Card key={idx} className="bg-slate-900 border-slate-800">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between">
                                                <CardTitle className="text-white text-base">{risk.area}</CardTitle>
                                                <Badge variant="outline" className={
                                                    risk.level === 'High' ? 'text-red-400 border-red-900 bg-red-900/20' : 'text-yellow-400 border-yellow-900 bg-yellow-900/20'
                                                }>
                                                    {risk.level} Risk
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-slate-500 text-xs uppercase mb-1">Impact</p>
                                                    <p className="text-slate-300">{risk.impact}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 text-xs uppercase mb-1">Probability</p>
                                                    <p className="text-white font-mono">{risk.prob}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 text-xs uppercase mb-1">Mitigation</p>
                                                    <p className="text-emerald-400">{risk.mitigation}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="optimization" className="flex-1 mt-4 overflow-y-auto">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Drilling & Completion Optimization</CardTitle>
                                    <CardDescription>AI-derived suggestions to improve operational efficiency.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                            <BarChart3 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium">Optimal Mud Weight Window</h4>
                                            <p className="text-sm text-slate-400 mt-1">Based on breakout analysis (if Caliper available), maintain MW between 10.5 - 11.2 ppg to minimize instability.</p>
                                        </div>
                                    </div>
                                    <Separator className="bg-slate-800" />
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium">Perforation Strategy</h4>
                                            <p className="text-sm text-slate-400 mt-1">High-permeability streaks detected at top of Zone A. Suggest delaying perforation in upper 20ft to delay water coning.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default AIInsightsPanel;