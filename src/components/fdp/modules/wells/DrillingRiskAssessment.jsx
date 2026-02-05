import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const DrillingRiskAssessment = () => {
    const risks = [
        { id: 1, hazard: 'Stuck Pipe', phase: '12.25" Section', prob: 'Medium', impact: 'High', mitigation: 'Optimize mud weight & hole cleaning' },
        { id: 2, hazard: 'Loss of Circulation', phase: 'Reservoir Section', prob: 'High', impact: 'Medium', mitigation: 'Have LCM pills ready' },
        { id: 3, hazard: 'Shale Instability', phase: 'Overburden', prob: 'Medium', impact: 'Medium', mitigation: 'Use inhibitive mud system' },
    ];

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                    Drilling Risks
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-800 text-slate-400">
                            <tr>
                                <th className="p-3">Hazard</th>
                                <th className="p-3">Phase</th>
                                <th className="p-3">Probability</th>
                                <th className="p-3">Impact</th>
                                <th className="p-3">Mitigation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {risks.map(risk => (
                                <tr key={risk.id} className="hover:bg-slate-800/30">
                                    <td className="p-3 text-white font-medium">{risk.hazard}</td>
                                    <td className="p-3 text-slate-400">{risk.phase}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${risk.prob === 'High' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                            {risk.prob}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${risk.impact === 'High' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                            {risk.impact}
                                        </span>
                                    </td>
                                    <td className="p-3 text-slate-300 text-xs">{risk.mitigation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default DrillingRiskAssessment;