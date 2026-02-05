import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { calculateCorrelationQuality } from '@/utils/wellCorrelationAI';

const CorrelationQualityAssessment = ({ selectedWells, correlations, targetCurve = 'GR' }) => {
    
    const qualityMetrics = useMemo(() => {
        if (selectedWells.length < 2 || correlations.points.length === 0) return null;

        // Simple assessment: check quality between pairs connected by correlations
        // Assuming correlations structure from WellCorrelationView { points: [{wellId, topName, depth...}] }
        
        // Group points by correlation line (implicitly handled by data structure in view, but here we receive active drawing)
        // Let's assume 'correlations' passed here is the active drawing state or list of saved correlation lines
        
        // Mock quality calculation for demo visualization
        const score = 0.85; // Placeholder
        
        return {
            overallScore: score,
            details: [
                { name: 'Signal Similarity', score: 0.9, status: 'good' },
                { name: 'Thickness Consistency', score: 0.75, status: 'warning' },
                { name: 'Dip Angle', score: 0.95, status: 'good' }
            ]
        };
    }, [selectedWells, correlations, targetCurve]);

    if (!qualityMetrics) {
        return (
            <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-4 text-center text-xs text-slate-500 italic">
                    Add correlations to see quality metrics.
                </CardContent>
            </Card>
        );
    }

    const getStatusColor = (s) => {
        if (s >= 0.8) return 'text-green-400';
        if (s >= 0.6) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getProgressBarColor = (s) => {
        if (s >= 0.8) return 'bg-green-500';
        if (s >= 0.6) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <Activity className="w-4 h-4 mr-2 text-blue-400" /> Correlation QC
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center p-2 bg-slate-800 rounded-lg">
                    <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Confidence Score</div>
                    <div className={`text-2xl font-black ${getStatusColor(qualityMetrics.overallScore)}`}>
                        {(qualityMetrics.overallScore * 100).toFixed(0)}%
                    </div>
                </div>

                <div className="space-y-3">
                    {qualityMetrics.details.map((metric, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-300">{metric.name}</span>
                                <span className={getStatusColor(metric.score)}>
                                    {metric.status === 'good' ? <CheckCircle className="w-3 h-3 inline mr-1"/> : <AlertCircle className="w-3 h-3 inline mr-1"/>}
                                    {(metric.score * 100).toFixed(0)}%
                                </span>
                            </div>
                            <Progress value={metric.score * 100} className="h-1.5" indicatorClassName={getProgressBarColor(metric.score)} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default CorrelationQualityAssessment;