import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Circle, Clock, AlertTriangle, ArrowRight, Activity, Layers, GitGraph, Database, Zap, FileText, BrainCircuit, Box, Component, Share2, Microscope } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const StatusIcon = ({ status }) => {
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'in-progress') return <Activity className="w-4 h-4 text-blue-400" />;
    if (status === 'planned') return <Circle className="w-4 h-4 text-slate-600" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
};

const PhaseCard = ({ title, progress, status, description, items }) => (
    <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-medium text-slate-200 flex items-center gap-2">
                        {title}
                        <Badge variant={status === 'completed' ? 'default' : 'secondary'} className={status === 'completed' ? 'bg-green-900 text-green-300' : status === 'in-progress' ? 'bg-blue-900 text-blue-300' : 'bg-slate-700 text-slate-300'}>
                            {status.toUpperCase()}
                        </Badge>
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <div className="text-2xl font-bold text-slate-200">{progress}%</div>
            </div>
            <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>
        <CardContent>
            <div className="space-y-2 mt-2">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                        <StatusIcon status={item.status} />
                        <span className={item.status === 'completed' ? 'text-slate-300' : ''}>{item.label}</span>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

const DevelopmentDashboard = () => {
    const phase1Items = [
        { label: '3D Visualization Environment', status: 'completed' },
        { label: 'Interactive Map View', status: 'completed' },
        { label: 'Project & Asset Management', status: 'completed' },
        { label: 'Data Import Wizards (LAS, SEG-Y)', status: 'completed' },
    ];

    const phase2Items = [
        { label: 'Advanced Cross Section Canvas', status: 'completed' },
        { label: 'Stratigraphic Analysis Panel', status: 'completed' },
        { label: 'Property Heatmaps & Interpolation', status: 'completed' },
        { label: 'Ecosystem Sync (Map <-> 3D <-> Section)', status: 'completed' },
    ];

    const phase3Items = [
        { label: 'Ghost Curve Matching', status: 'completed' },
        { label: 'Structural Flattening', status: 'completed' },
        { label: 'AI-Assisted Tops Picking', status: 'completed' },
        { label: 'Correlation Quality Assessment', status: 'completed' },
    ];

    const phase4Items = [
        { label: 'Seismic Attribute Engine (RMS, Env)', status: 'completed' },
        { label: 'Spectral Decomposition (Freq Analysis)', status: 'completed' },
        { label: 'Synthetic Seismogram (Well Tie)', status: 'completed' },
        { label: 'AI Horizon & Fault Tracking', status: 'completed' },
        { label: 'Interactive Seismic Interpretation', status: 'completed' },
    ];

    const phase5Items = [
        { label: '3D Fault Framework Builder', status: 'planned' },
        { label: 'Horizon Surface Modeling (Gridding)', status: 'planned' },
        { label: 'Structural Model Construction', status: 'planned' },
        { label: 'Volume Calculation (GRV)', status: 'planned' },
        { label: 'Geocellular Grid Generation', status: 'planned' },
    ];

    return (
        <div className="h-full w-full bg-slate-950 p-6 overflow-y-auto text-white font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Zap className="text-lime-400 fill-current" /> EarthModel Studio Roadmap
                        </h1>
                        <p className="text-slate-400 mt-1">Development progress, verification, and strategic planning.</p>
                    </div>
                    <div className="flex gap-4 text-right">
                        <div>
                            <div className="text-sm text-slate-500">Overall Progress</div>
                            <div className="text-2xl font-bold text-lime-400">80%</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-500">Current Phase</div>
                            <div className="text-2xl font-bold text-purple-400">Phase 5</div>
                        </div>
                    </div>
                </div>

                {/* Phases Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <PhaseCard 
                        title="Phase 1" 
                        progress={100} 
                        status="completed" 
                        description="Core Foundation"
                        items={phase1Items}
                    />
                    <PhaseCard 
                        title="Phase 2" 
                        progress={100} 
                        status="completed" 
                        description="Cross Section"
                        items={phase2Items}
                    />
                    <PhaseCard 
                        title="Phase 3" 
                        progress={100} 
                        status="completed" 
                        description="Well Correlation"
                        items={phase3Items}
                    />
                    <PhaseCard 
                        title="Phase 4" 
                        progress={100} 
                        status="completed" 
                        description="Seismic Analyzer"
                        items={phase4Items}
                    />
                    <PhaseCard 
                        title="Phase 5" 
                        progress={0} 
                        status="planned" 
                        description="Structural Fwk"
                        items={phase5Items}
                    />
                </div>

                {/* Detailed Report Tabs */}
                <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="bg-slate-900 border border-slate-700 w-full justify-start">
                        <TabsTrigger value="summary" className="data-[state=active]:bg-slate-800">Phase 4 Summary</TabsTrigger>
                        <TabsTrigger value="plan" className="data-[state=active]:bg-slate-800">Phase 5 Plan</TabsTrigger>
                        <TabsTrigger value="recs" className="data-[state=active]:bg-slate-800">Recommendations</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="mt-6 space-y-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-purple-400 flex items-center"><CheckCircle className="w-5 h-5 mr-2"/> Phase 4 Completion Report: Seismic Analyzer</CardTitle>
                                <CardDescription>Verification of Seismic Analysis & Interpretation Deliverables.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-semibold text-white mb-3 flex items-center"><Component className="w-4 h-4 mr-2 text-blue-400"/> Modules Delivered</h3>
                                        <ul className="space-y-2 text-sm text-slate-400">
                                            <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> SeismicAnalyzerView (Main Orchestrator)</li>
                                            <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> SeismicAttributeExtraction (RMS, Env, Freq)</li>
                                            <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> SeismicToWellTie (Synthetics & Wavelets)</li>
                                            <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> AI Horizon & Fault Tracking Tools</li>
                                            <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> Spectral Decomposition Analysis</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-3 flex items-center"><Share2 className="w-4 h-4 mr-2 text-orange-400"/> Ecosystem Integration</h3>
                                        <ul className="space-y-2 text-sm text-slate-400">
                                            <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> Selection Sync: 3D / Map / Section / Seismic</li>
                                            <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> Interpretation Database (Supabase Sync)</li>
                                            <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> Shared Color Palettes & Styles</li>
                                            <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> Cross-Module Export (GeoJSON, PNG)</li>
                                        </ul>
                                    </div>
                                </div>
                                <Separator className="bg-slate-800" />
                                <div>
                                    <h3 className="font-semibold text-white mb-2 flex items-center"><Microscope className="w-4 h-4 mr-2 text-teal-400"/> Technical Validation</h3>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div className="p-3 bg-slate-950 rounded border border-slate-800">
                                            <div className="text-slate-500">Attribute Computation</div>
                                            <div className="font-mono text-green-400">&lt; 150ms (Client-side)</div>
                                        </div>
                                        <div className="p-3 bg-slate-950 rounded border border-slate-800">
                                            <div className="text-slate-500">Canvas Rendering</div>
                                            <div className="font-mono text-green-400">60fps (Optimized Loop)</div>
                                        </div>
                                        <div className="p-3 bg-slate-950 rounded border border-slate-800">
                                            <div className="text-slate-500">Data Handling</div>
                                            <div className="font-mono text-yellow-400">Supports 2GB+ via Slicing</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="plan" className="mt-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-blue-400">Phase 5: Structural Framework Enhancement</CardTitle>
                                <CardDescription>Building robust 3D geological models from interpretations.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-900/20 p-3 rounded-full text-blue-400 font-bold">1</div>
                                        <div>
                                            <h4 className="text-white font-semibold">3D Fault Framework Builder</h4>
                                            <p className="text-sm text-slate-400 mt-1">
                                                Tools to connect fault sticks into fault planes, creating a sealed fault network.
                                                Essential for structural compartmentalization.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-900/20 p-3 rounded-full text-blue-400 font-bold">2</div>
                                        <div>
                                            <h4 className="text-white font-semibold">Horizon Surface Modeling (Gridding)</h4>
                                            <p className="text-sm text-slate-400 mt-1">
                                                Implement Kriging/Minimum Curvature algorithms to generate 3D surfaces from 2D seismic picks and well tops.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-900/20 p-3 rounded-full text-blue-400 font-bold">3</div>
                                        <div>
                                            <h4 className="text-white font-semibold">Structural Model Construction</h4>
                                            <p className="text-sm text-slate-400 mt-1">
                                                Combine faults and horizons to build a watertight structural model (Corner Point Gridding).
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-900/20 p-3 rounded-full text-blue-400 font-bold">4</div>
                                        <div>
                                            <h4 className="text-white font-semibold">Volumetrics & Export</h4>
                                            <p className="text-sm text-slate-400 mt-1">
                                                Calculate Gross Rock Volume (GRV) based on fluid contacts and structure. Export to RESQML.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="recs" className="mt-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-purple-400">Strategic Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    <li className="p-3 bg-slate-950/50 rounded border border-slate-800">
                                        <div className="font-semibold text-white mb-1 flex items-center"><Box className="w-4 h-4 mr-2 text-purple-400"/> WebGPU for Gridding</div>
                                        <p className="text-xs text-slate-400">
                                            Surface generation is computationally expensive. Move interpolation algorithms to WebGPU compute shaders for 100x speedup.
                                        </p>
                                    </li>
                                    <li className="p-3 bg-slate-950/50 rounded border border-slate-800">
                                        <div className="font-semibold text-white mb-1 flex items-center"><Database className="w-4 h-4 mr-2 text-yellow-400"/> Spatial Indexing</div>
                                        <p className="text-xs text-slate-400">
                                            Implement Quadtree/Octree indexing for massive point clouds (Seismic Picks) to maintain UI responsiveness during modeling.
                                        </p>
                                    </li>
                                    <li className="p-3 bg-slate-950/50 rounded border border-slate-800">
                                        <div className="font-semibold text-white mb-1 flex items-center"><BrainCircuit className="w-4 h-4 mr-2 text-blue-400"/> Automated Fault Correlation</div>
                                        <p className="text-xs text-slate-400">
                                            Use AI to suggest fault plane connections across multiple 2D slices, reducing manual stick correlation time.
                                        </p>
                                    </li>
                                    <li className="p-3 bg-slate-950/50 rounded border border-slate-800">
                                        <div className="font-semibold text-white mb-1 flex items-center"><FileText className="w-4 h-4 mr-2 text-green-400"/> RESQML Support</div>
                                        <p className="text-xs text-slate-400">
                                            Prioritize RESQML export format to ensure interoperability with industry-standard geomodeling packages (Petrel/RMS).
                                        </p>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    );
};

export default DevelopmentDashboard;