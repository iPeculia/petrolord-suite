import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertTriangle, XCircle, ClipboardCheck } from 'lucide-react';

const QualityMetric = ({ label, score, status, description }) => {
    let color = "bg-slate-600";
    let Icon = AlertTriangle;
    let iconColor = "text-yellow-500";

    if (score >= 80) {
        color = "bg-green-500";
        Icon = CheckCircle2;
        iconColor = "text-green-500";
    } else if (score < 50) {
        color = "bg-red-500";
        Icon = XCircle;
        iconColor = "text-red-500";
    }

    return (
        <div className="space-y-1 mb-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Icon className={`w-3 h-3 ${iconColor}`} />
                    <span className="text-xs font-medium text-slate-200">{label}</span>
                </div>
                <span className="text-xs font-mono text-slate-400">{score}%</span>
            </div>
            <Progress value={score} className="h-1.5" indicatorClassName={color} />
            <p className="text-[10px] text-slate-500">{description}</p>
        </div>
    );
};

const SeismicQualityAssessment = ({ dataQuality = 85, interpQuality = 60, tieQuality = 72 }) => {
    return (
        <Card className="bg-slate-900 border-slate-800 shadow-none">
            <CardHeader className="pb-2 p-3">
                <CardTitle className="text-xs font-bold flex items-center text-teal-400 uppercase">
                    <ClipboardCheck className="w-3 h-3 mr-2" /> Quality Report
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
                <QualityMetric 
                    label="Data Signal-to-Noise" 
                    score={dataQuality} 
                    description="Good amplitude preservation. Low noise floor." 
                />
                <QualityMetric 
                    label="Horizon Continuity" 
                    score={interpQuality} 
                    description="Several gaps detected in main horizon. Suggest smoothing." 
                />
                <QualityMetric 
                    label="Well-Seismic Tie" 
                    score={tieQuality} 
                    description="Correlation coeff 0.72. Check bulk shift." 
                />
                
                <div className="mt-4 pt-3 border-t border-slate-800">
                    <div className="text-xs font-bold text-slate-300 mb-2">Suggestions</div>
                    <ul className="list-disc list-inside text-[10px] text-slate-400 space-y-1">
                        <li>Apply bandpass filter (10-60Hz) to reduce high-freq noise.</li>
                        <li>Refine Well A tie by applying +12ms shift.</li>
                        <li>Check polarity on Horizon B.</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

export default SeismicQualityAssessment;