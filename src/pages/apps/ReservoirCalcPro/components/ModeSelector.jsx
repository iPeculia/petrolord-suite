import React from 'react';
import { useReservoirCalc } from '../contexts/ReservoirCalcContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Sliders, LayoutDashboard, ArrowRight, CheckCircle2 } from 'lucide-react';

const ModeSelector = () => {
    const { setMode } = useReservoirCalc();

    const modes = [
        {
            id: 'guided',
            title: 'Guided Mode',
            icon: BookOpen,
            description: 'Step-by-step wizard for standard volumetric calculations. Best for new users or quick estimates.',
            features: ['Wizard Interface', 'Auto-QC checks', 'Simplified Inputs', 'Standard Report'],
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20'
        },
        {
            id: 'expert',
            title: 'Expert Mode',
            icon: Sliders,
            description: 'Full control over all parameters with advanced sensitivity analysis and probabilistic options.',
            features: ['Single-page Interface', 'Monte Carlo Simulation', 'Advanced Sensitivity', 'Custom Equations'],
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20'
        },
        {
            id: 'pro-dashboard',
            title: 'Pro Dashboard',
            icon: LayoutDashboard,
            description: 'Comprehensive project management, batch processing, and multi-scenario comparison.',
            features: ['Project Management', 'Batch Processing', 'Scenario Comparison', 'Team Collaboration'],
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20'
        }
    ];

    return (
        <div className="h-full overflow-y-auto p-8 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
            <div className="text-center max-w-2xl mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Welcome to ReservoirCalc Pro</h2>
                <p className="text-lg text-slate-400">Select your preferred workflow to begin. You can switch modes at any time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                {modes.map((mode) => (
                    <Card 
                        key={mode.id} 
                        className={`bg-slate-900/50 border-slate-800 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col h-full`}
                        onClick={() => setMode(mode.id)}
                    >
                        <CardHeader>
                            <div className={`w-14 h-14 rounded-xl ${mode.bgColor} ${mode.color} flex items-center justify-center mb-4`}>
                                <mode.icon className="w-8 h-8" />
                            </div>
                            <CardTitle className="text-2xl text-white">{mode.title}</CardTitle>
                            <CardDescription className="text-slate-400 text-base min-h-[60px]">
                                {mode.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-3">
                                {mode.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                        <CheckCircle2 className={`w-4 h-4 ${mode.color}`} />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-6 border-t border-slate-800/50">
                            <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white gap-2 group">
                                Select Mode <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ModeSelector;