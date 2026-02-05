import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const PortfolioRiskDashboard = ({ portfolioRisk }) => {
    if (!portfolioRisk) return null;

    const { summary, wellRisks } = portfolioRisk;
    const highRisk = wellRisks.filter(r => r.riskLevel === 'High').length;
    const medRisk = wellRisks.filter(r => r.riskLevel === 'Medium').length;
    const lowRisk = wellRisks.filter(r => r.riskLevel === 'Low').length;

    const data = [
        { name: 'High Risk', value: highRisk, color: '#ef4444' },
        { name: 'Medium Risk', value: medRisk, color: '#eab308' },
        { name: 'Low Risk', value: lowRisk, color: '#10b981' },
    ].filter(d => d.value > 0);

    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between shrink-0">
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Contingency</h4>
                    <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                        ${(summary.totalContingencyCost / 1000000).toFixed(1)}M
                    </div>
                </div>
                <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] border-b border-slate-800/50 pb-1">
                        <span className="text-slate-500">Wells</span>
                        <span className="text-slate-200 font-mono">{summary.totalWells}</span>
                    </div>
                    <div className="flex justify-between text-[10px] pt-1">
                        <span className="text-slate-500">High Risk %</span>
                        <span className="text-red-400 font-mono">{summary.highRiskPercentage.toFixed(0)}%</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex-1 relative min-h-[150px]">
                <h4 className="absolute top-2 left-2 text-[10px] font-bold text-slate-500 uppercase z-10">Risk Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="55%"
                            innerRadius={35}
                            outerRadius={55}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Legend verticalAlign="bottom" height={24} iconSize={8} wrapperStyle={{fontSize: '10px'}} />
                        <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px', borderRadius: '4px' }}
                            itemStyle={{ color: '#e2e8f0' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PortfolioRiskDashboard;