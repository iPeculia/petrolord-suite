import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle2, AlertTriangle, PieChart } from 'lucide-react';
import { calculateCompleteness, validateFDPData } from '@/utils/fdp/fdpCalculations';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-400 uppercase">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
        </CardContent>
    </Card>
);

const FDPGenerationOverview = ({ state }) => {
    const completeness = calculateCompleteness(state);
    const validation = validateFDPData(state);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    title="Completeness" 
                    value={`${completeness.score}%`} 
                    icon={PieChart} 
                    colorClass="bg-blue-500" 
                />
                <StatCard 
                    title="Data Quality" 
                    value={validation.isValid ? "Ready" : "Needs Review"} 
                    icon={validation.isValid ? CheckCircle2 : AlertTriangle} 
                    colorClass={validation.isValid ? "bg-green-500" : "bg-yellow-500"} 
                />
                <StatCard 
                    title="Document Status" 
                    value="Draft" 
                    icon={FileText} 
                    colorClass="bg-purple-500" 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h4 className="text-sm font-bold text-white mb-4">Module Status</h4>
                        <div className="space-y-3">
                            {completeness.breakdown.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-300">{item.module}</span>
                                    {item.valid ? (
                                        <span className="flex items-center text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded"><CheckCircle2 className="w-3 h-3 mr-1"/> Complete</span>
                                    ) : (
                                        <span className="flex items-center text-slate-500 text-xs bg-slate-800 px-2 py-1 rounded">Pending</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h4 className="text-sm font-bold text-white mb-4">Validation Summary</h4>
                        {validation.errors.length === 0 && validation.warnings.length === 0 ? (
                            <div className="text-center py-8 text-green-400">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>All checks passed.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {validation.errors.map((err, i) => (
                                    <div key={i} className="flex items-start gap-2 text-red-400 text-xs bg-red-950/30 p-2 rounded">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {err}
                                    </div>
                                ))}
                                {validation.warnings.map((warn, i) => (
                                    <div key={i} className="flex items-start gap-2 text-yellow-400 text-xs bg-yellow-950/30 p-2 rounded">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {warn}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FDPGenerationOverview;