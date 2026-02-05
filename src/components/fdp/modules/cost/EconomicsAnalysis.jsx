import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateCashFlows, calculateNPV, calculateIRR, calculatePaybackPeriod } from '@/utils/fdp/costCalculations';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

const EconomicsAnalysis = ({ costItems, economicsSettings }) => {
    // Mock Data for demonstration if full model isn't connected yet
    const capex = costItems.filter(i => i.type === 'CAPEX').reduce((sum, i) => sum + (parseFloat(i.amount)||0), 0);
    const opex = costItems.filter(i => i.type === 'OPEX').reduce((sum, i) => sum + (parseFloat(i.amount)||0), 0);
    
    // Generate mock profile for visualization
    const productionProfile = [10, 25, 45, 50, 48, 42, 35, 30, 25, 20, 18, 15, 12, 10, 8, 6, 5, 4, 3, 2]; // kbpd
    const priceDeck = Array(20).fill({ oil_price_usd: 75 });
    
    const cashFlows = calculateCashFlows(capex, opex, productionProfile, priceDeck);
    const npv = calculateNPV(cashFlows);
    const irr = calculateIRR(cashFlows);
    const payback = calculatePaybackPeriod(cashFlows);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <div className="p-4 text-center">
                        <div className="text-xs text-slate-400 uppercase mb-1">NPV @ 10%</div>
                        <div className={`text-3xl font-bold ${npv >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${npv.toFixed(1)}M
                        </div>
                    </div>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <div className="p-4 text-center">
                        <div className="text-xs text-slate-400 uppercase mb-1">IRR</div>
                        <div className={`text-3xl font-bold ${irr >= 15 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {irr.toFixed(1)}%
                        </div>
                    </div>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <div className="p-4 text-center">
                        <div className="text-xs text-slate-400 uppercase mb-1">Payback Period</div>
                        <div className="text-3xl font-bold text-blue-400">
                            {payback ? `${payback.toFixed(1)} yrs` : '> 20 yrs'}
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white text-sm">Cash Flow Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={cashFlows}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="year" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
                                    labelStyle={{ color: '#94a3b8' }}
                                />
                                <Legend />
                                <Bar dataKey="netCashFlow" name="Net Cash Flow" fill="#3b82f6" barSize={20} />
                                <Line type="monotone" dataKey="cumulativeCashFlow" name="Cumulative CF" stroke="#10b981" strokeWidth={2} dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EconomicsAnalysis;