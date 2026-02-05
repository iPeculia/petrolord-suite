import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Download, FileText, Layers } from 'lucide-react';
import { useReservoirCalc } from '../../contexts/ReservoirCalcContext';
import DeterministicSummaryTable from './DeterministicSummaryTable';
import { Badge } from '@/components/ui/badge';

const DeterministicResultsDisplay = () => {
    const { state } = useReservoirCalc();
    const results = state.results || {};
    const unit = results.volumeUnit || 'STB';
    const ft = results.fluidType || 'oil';
    
    const safeNum = (val) => (val ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

    const showOil = ft === 'oil' || ft === 'oil_gas';
    const showGas = ft === 'gas' || ft === 'oil_gas';

    return (
        <div className="h-full flex flex-col gap-6 p-4 overflow-y-auto">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {showOil && (
                    <Card className="p-6 bg-slate-900 border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10 text-9xl font-bold leading-none text-emerald-100 select-none">O</div>
                        <h3 className="text-sm uppercase text-emerald-500 font-bold mb-2">STOOIP</h3>
                        <div className="text-4xl font-bold text-white tracking-tight">
                            {safeNum(results.stooip)} <span className="text-lg text-slate-500 font-normal">{unit}</span>
                        </div>
                        <p className="text-slate-400 text-sm mt-2">Recoverable: {safeNum(results.recoverableOil)}</p>
                    </Card>
                )}
                
                {showGas && (
                    <Card className="p-6 bg-slate-900 border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10 text-9xl font-bold leading-none text-amber-100 select-none">G</div>
                        <h3 className="text-sm uppercase text-amber-500 font-bold mb-2">GIIP</h3>
                        <div className="text-4xl font-bold text-white tracking-tight">
                            {((results.giip || 0) / 1e9).toFixed(3)} <span className="text-lg text-slate-500 font-normal">B{state.unitSystem === 'field' ? 'scf' : 'sm³'}</span>
                        </div>
                        <p className="text-slate-400 text-sm mt-2">Recoverable: {((results.recoverableGas || 0) / 1e9).toFixed(3)} B</p>
                    </Card>
                )}
                
                <Card className="p-6 bg-slate-900 border-slate-800 flex flex-col justify-center gap-2">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-500 text-sm">Gross Vol:</span>
                        <span className="text-white font-mono">{safeNum(results.bulkVolume)} {state.results?.volUnit}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-500 text-sm">Net Vol:</span>
                        <span className="text-white font-mono">{safeNum(results.netVolume)} {state.results?.volUnit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">Pore Vol:</span>
                        <span className="text-white font-mono">{safeNum(results.poreVolumeRes)} {state.results?.resVolUnit}</span>
                    </div>
                </Card>
            </div>

            {/* Generated Maps Section */}
            {state.maps.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-400" /> Generated Maps ({state.maps.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {state.maps.map(m => (
                            <Badge key={m.id} variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-default">
                                {m.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Detailed Table */}
            <div className="flex-1 min-h-0">
                <h3 className="text-lg font-bold text-white mb-4">Comprehensive Report</h3>
                <DeterministicSummaryTable />
            </div>

            <div className="flex justify-end gap-4 mt-auto pt-4 border-t border-slate-800">
                <Button variant="outline" className="gap-2"><Save className="w-4 h-4"/> Save Project</Button>
                <Button variant="outline" className="gap-2"><Download className="w-4 h-4"/> Export CSV</Button>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700"><FileText className="w-4 h-4"/> Generate PDF Report</Button>
            </div>
        </div>
    );
};

export default DeterministicResultsDisplay;