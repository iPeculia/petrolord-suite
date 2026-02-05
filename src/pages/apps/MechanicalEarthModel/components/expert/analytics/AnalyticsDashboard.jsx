import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, FileText, CheckCircle, BarChart2, Lightbulb, GitCompareArrows } from 'lucide-react';
import { useAnalytics } from '../../../contexts/AnalyticsContext';

const StatCard = ({ title, value, unit, icon, color }) => (
    <Card className={`bg-slate-800/50 border-slate-700`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
            {React.cloneElement(icon, { className: `h-4 w-4 text-slate-400 ${color}` })}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-white">{value}</div>
            <p className="text-xs text-slate-500">{unit}</p>
        </CardContent>
    </Card>
);

const AnalyticsDashboard = () => {
    const { state } = useAnalytics();
    
    // Placeholder data - replace with actual data from state.calculationResults
    const quickStats = {
        maxStress: '8530 psi',
        minMudWeight: '9.8 ppg',
        maxMudWeight: '12.1 ppg',
        stressRegime: 'Normal Faulting',
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Max Effective Stress" value="8,530" unit="psi at 9500 ft" icon={<TrendingUp />} />
                <StatCard title="Min Mud Weight" value="9.8" unit="ppg" icon={<BarChart2 />} />
                <StatCard title="Max Mud Weight" value="12.1" unit="ppg" icon={<BarChart2 />} />
                <StatCard title="Dominant Stress Regime" value="Normal" unit="Faulting" icon={<FileText />} />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-green-400" /> Calculation Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-300">The 1D Mechanical Earth Model calculation completed successfully. The analysis covered a depth range from the surface to the specified total depth, processing all available log curves to derive geomechanical properties and stress profiles.</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center"><Lightbulb className="w-5 h-5 mr-2 text-yellow-400" /> Key Findings</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ul className="list-disc list-inside text-slate-300 space-y-1">
                            <li>Significant increase in pore pressure below 8000 ft.</li>
                            <li>Narrow mud weight window between 9200-9800 ft.</li>
                            <li>Potential for wellbore instability in shale-rich intervals.</li>
                        </ul>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center"><GitCompareArrows className="w-5 h-5 mr-2 text-blue-400" /> Next Steps & Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-300">Review the detailed <span className="font-bold">Results Visualization</span> to understand stress and pressure profiles. Use the <span className="font-bold">Comparison Tools</span> to run sensitivity analyses on key parameters like Poisson's Ratio or Friction Angle. Assess high-risk zones using the <span className="font-bold">Risk Assessment</span> panel.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;