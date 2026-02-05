import React from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatCurrency = (value) => {
    if (!value && value !== 0) return 'N/A';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)} B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)} MM`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)} K`;
    return `$${value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
};

const KPICard = ({ title, value, color, id }) => (
    <div className={`bg-white/5 p-4 rounded-lg border-l-4 ${color}`}>
        <p className="text-sm text-lime-300">{title}</p>
        <p id={id} className="text-2xl font-bold text-white">{formatCurrency(value)}</p>
    </div>
);

const ChartCard = ({ title, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-xl"
    >
        <CardHeader>
            <CardTitle className="text-xl text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </motion.div>
);

const ResultsPanel = ({ results }) => {
    const hasBreakdownData = results.costBreakdown && results.costBreakdown.length > 0;
    const hasCurveData = results.dayByDayCurve && results.dayByDayCurve.length > 0;

    const chartLayout = {
        margin: { l: 60, r: 20, t: 40, b: 50 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e2e8f0' },
        xaxis: { gridcolor: 'rgba(255, 255, 255, 0.1)' },
        yaxis: { gridcolor: 'rgba(255, 255, 255, 0.1)' },
    };
    
    const pieLayout = {
        margin: { l: 20, r: 20, t: 20, b: 20 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e2e8f0' },
        legend: {
            orientation: 'h',
            y: -0.1
        }
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <KPICard id="p10-cost-display" title="P10 (Low Case)" value={results.p10} color="border-green-400" />
                    <KPICard id="p50-cost-display" title="P50 (Most Likely)" value={results.p50} color="border-cyan-400" />
                    <KPICard id="p90-cost-display" title="P90 (High Case)" value={results.p90} color="border-orange-400" />
                </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {hasBreakdownData && (
                    <ChartCard title="Cost Breakdown">
                        <Plot
                            data={[{
                                labels: results.costBreakdown.map(d => d.category),
                                values: results.costBreakdown.map(d => d.cost),
                                type: 'pie',
                                hole: .4,
                                textinfo: 'percent',
                                hoverinfo: 'label+value',
                                automargin: true,
                                marker: {
                                    colors: ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc', '#cffafe']
                                }
                            }]}
                            layout={pieLayout}
                            useResizeHandler={true}
                            style={{ width: '100%', height: '300px' }}
                            config={{ displayModeBar: false }}
                        />
                    </ChartCard>
                )}

                {hasCurveData && (
                     <ChartCard title="Day-by-Day Cumulative Cost Curve">
                        <Plot
                            data={[{
                                x: results.dayByDayCurve.map(d => d.day),
                                y: results.dayByDayCurve.map(d => d.cumulativeCost),
                                type: 'scatter',
                                mode: 'lines',
                                line: { color: '#0891b2' }
                            }]}
                            layout={{
                                ...chartLayout,
                                xaxis: { ...chartLayout.xaxis, title: 'Days' },
                                yaxis: { ...chartLayout.yaxis, title: 'Cumulative Cost (USD)' }
                            }}
                            useResizeHandler={true}
                            style={{ width: '100%', height: '300px' }}
                            config={{ displayModeBar: false }}
                        />
                    </ChartCard>
                )}
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-2">Assumptions & Notes</h3>
                <p className="text-sm text-lime-200">
                    This is a high-level, AFE-quality cost estimate. The AI suggestions are based on historical analog data and are not a guarantee of future costs.
                    P10/P90 values are statistical estimations based on a +/- 20% variance from the P50 and should be used for scenario planning. All costs are in USD.
                </p>
            </motion.div>
        </div>
    );
};

export default ResultsPanel;