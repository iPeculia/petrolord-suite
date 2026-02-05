import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { AlertCircle, CheckCircle, HelpCircle, TrendingDown, TrendingUp, XCircle } from 'lucide-react';

    const ResultsPanel = ({ results, isLoading, onGenerateReport }) => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (!results) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                    <HelpCircle className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-semibold">No Analysis Run</h3>
                    <p>Run an analysis from the input panel to see the results here.</p>
                </div>
            );
        }

        const renderSafetyFactor = (sf, designFactor, label) => {
            const isPass = sf >= designFactor;
            const Icon = isPass ? CheckCircle : XCircle;
            const color = isPass ? 'text-green-400' : 'text-red-400';

            return (
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center">
                        <Icon className={`h-5 w-5 mr-3 ${color}`} />
                        <span className="font-medium">{label}</span>
                    </div>
                    <div className="text-right">
                        <span className={`font-bold text-lg ${color}`}>{sf.toFixed(2)}</span>
                        <span className="text-xs text-gray-400"> / {designFactor}</span>
                    </div>
                </div>
            );
        };

        const renderValue = (value, unit, label, Icon) => (
            <div className="flex items-start p-3 bg-gray-800 rounded-lg">
                {Icon && <Icon className="h-5 w-5 mr-3 mt-1 text-blue-400" />}
                <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="font-semibold text-lg">{value.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm text-gray-300">{unit}</span></p>
                </div>
            </div>
        );

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="bg-gray-800/50 border-gray-700 text-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Analysis Results</CardTitle>
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-bold ${results.status === 'Pass' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {results.status === 'Pass' ? <CheckCircle className="h-4 w-4 mr-2" /> : <AlertCircle className="h-4 w-4 mr-2" />}
                            Status: {results.status}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-3 text-blue-300">Safety Factors</h4>
                            <div className="space-y-2">
                                {renderSafetyFactor(results.safety_factors.collapse, results.design_factors.collapse, 'Collapse')}
                                {renderSafetyFactor(results.safety_factors.burst, results.design_factors.burst, 'Burst')}
                                {renderSafetyFactor(results.safety_factors.tension, results.design_factors.tension, 'Tension')}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-3 text-blue-300">Loads at Shoe ({results.shoe_depth_m}m)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {renderValue(results.loads.collapse_load_psi, 'psi', 'Collapse Load', TrendingDown)}
                                {renderValue(results.loads.burst_load_psi, 'psi', 'Burst Load', TrendingUp)}
                                {renderValue(results.loads.tension_load_lbf, 'lbf', 'Tension Load', TrendingDown)}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-3 text-blue-300">Capacities</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {renderValue(results.capacities.collapse_psi, `psi (${results.capacities.collapse_regime})`, 'Collapse Capacity')}
                                {renderValue(results.capacities.burst_psi, 'psi', 'Burst Capacity')}
                                {renderValue(results.capacities.tension_lbf, 'lbf', 'Tension Capacity')}
                            </div>
                        </div>
                        
                        {results.calc_run_id && (
                            <div className="pt-4 border-t border-gray-700">
                                <Button onClick={() => onGenerateReport(results.calc_run_id)} className="w-full">
                                    Generate PDF Report
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    export default ResultsPanel;