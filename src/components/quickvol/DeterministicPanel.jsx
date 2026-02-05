import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calculator, Play, Upload, Layers, Map, Maximize, Ruler, PieChart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

import MapBasedInputPanel from './MapBasedInputPanel';
import LoadContourProjectModal from './LoadContourProjectModal';

const DeterministicPanel = ({ surfaceInputs, setSurfaceInputs, surfaces, setSurfaces, onRunMapCalc, mapResults, loading }) => {
    const { toast } = useToast();
    const [mapInputMethod, setMapInputMethod] = useState('top_base'); // 'top_base', 'thickness_only', 'area_thickness'
    const [unitSystem, setUnitSystem] = useState('field');
    const [phase, setPhase] = useState('oil');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const units = {
        depth: unitSystem === 'field' ? 'ft' : 'm',
        thickness: unitSystem === 'field' ? 'ft' : 'm',
        area: unitSystem === 'field' ? 'acres' : 'km²',
        volume: unitSystem === 'field' ? 'acre-ft' : 'm³',
        stooip_oil: unitSystem === 'field' ? 'STB' : 'm³',
        stooip_gas: unitSystem === 'field' ? 'SCF' : 'm³',
    };

    const handleSurfaceInputChange = (e) => {
        const { name, value } = e.target;
        setSurfaceInputs(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    const handleFileChange = (name, file) => {
        setSurfaceInputs(prev => ({ ...prev, [name]: file }));
    };

    const handleProjectLoad = (project) => {
        // Assume project contains contour data for top and base grids
        // For simplicity, we'll just set dummy files for now
        setSurfaceInputs(prev => ({
            ...prev,
            top_grid: { name: `${project.project_name}_top.json`, type: 'application/json' },
            base_grid: { name: `${project.project_name}_base.json`, type: 'application/json' },
            // Potentially set avg_thickness, porosity etc. if available from project
        }));
        setMapInputMethod('top_base'); // Switch to grid mode if project loads grids
        setIsModalOpen(false);
        // Display toast
        toast({
            title: "Project Loaded",
            description: `Contour project "${project.project_name}" loaded successfully.`,
        });
    };

    const formatNum = (n, unit = '') => {
        if (n === undefined || n === null) return '-';
        if (n === 0) return '0';
        // Use toLocaleString for general number formatting with commas
        const formatted = n.toLocaleString(undefined, { maximumFractionDigits: 2 });
        return `${formatted} ${unit}`;
    };

    return (
        <>
            <LoadContourProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectSelect={handleProjectLoad}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-hidden">
                {/* Input Panel */}
                <div className="lg:col-span-2 h-full overflow-y-auto pr-2">
                    <MapBasedInputPanel
                        formData={surfaceInputs}
                        handleInputChange={handleSurfaceInputChange}
                        handleFileChange={handleFileChange}
                        handleRun={onRunMapCalc}
                        loading={loading}
                        unitSystem={unitSystem}
                        setUnitSystem={setUnitSystem}
                        phase={phase}
                        setPhase={setPhase}
                        mapInputMethod={mapInputMethod}
                        setMapInputMethod={setMapInputMethod}
                        onProjectLoad={handleProjectLoad}
                    />
                </div>

                {/* Results and Options */}
                <div className="lg:col-span-1 h-full overflow-y-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                            <Calculator className="w-6 h-6 mr-3 text-cyan-300" /> Deterministic Results Pro
                        </h2>

                        {mapResults ? (
                            <div className="space-y-4">
                                {mapResults.bulk_rock_volume !== undefined && (
                                    <div>
                                        <p className="text-slate-300 font-semibold">Bulk Rock Volume ({units.volume}):</p>
                                        <p className="text-white text-xl font-bold">{formatNum(mapResults.bulk_rock_volume, units.volume)}</p>
                                    </div>
                                )}
                                {mapResults.pore_volume !== undefined && (
                                    <div>
                                        <p className="text-slate-300 font-semibold">Pore Volume ({units.volume}):</p>
                                        <p className="text-white text-xl font-bold">{formatNum(mapResults.pore_volume, units.volume)}</p>
                                    </div>
                                )}
                                {mapResults.stooip_oil !== undefined && (
                                    <div>
                                        <p className="text-slate-300 font-semibold">STOOIP Oil ({units.stooip_oil}):</p>
                                        <p className="text-white text-xl font-bold text-orange-400">{formatNum(mapResults.stooip_oil, units.stooip_oil)}</p>
                                    </div>
                                )}
                                {mapResults.stooip_gas !== undefined && (
                                    <div>
                                        <p className="text-slate-300 font-semibold">STOOIP Gas ({units.stooip_gas}):</p>
                                        <p className="text-white text-xl font-bold text-green-400">{formatNum(mapResults.stooip_gas, units.stooip_gas)}</p>
                                    </div>
                                )}
                                {mapResults.recoverable_oil !== undefined && (
                                    <div>
                                        <p className="text-slate-300 font-semibold">Recoverable Oil ({units.stooip_oil}):</p>
                                        <p className="text-white text-xl font-bold text-rose-400">{formatNum(mapResults.recoverable_oil, units.stooip_oil)}</p>
                                    </div>
                                )}
                                {mapResults.recoverable_gas !== undefined && (
                                    <div>
                                        <p className="text-slate-300 font-semibold">Recoverable Gas ({units.stooip_gas}):</p>
                                        <p className="text-white text-xl font-bold text-lime-400">{formatNum(mapResults.recoverable_gas, units.stooip_gas)}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Run a calculation to see results.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Additional Options Card (e.g., surfaces management) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <Layers className="w-5 h-5 mr-3 text-fuchsia-300" /> Surfaces Management Pro
                        </h3>
                        <div className="space-y-3">
                            {surfaces.length === 0 ? (
                                <p className="text-slate-400 text-sm">No surfaces loaded yet. Load grids above.</p>
                            ) : (
                                surfaces.map((s, index) => (
                                    <div key={index} className="flex justify-between items-center bg-white/5 p-2 rounded-md">
                                        <span className="text-sm">{s.name}</span>
                                        <Badge variant="outline" className="border-fuchsia-400/50 text-fuchsia-300">{s.type}</Badge>
                                    </div>
                                ))
                            )}
                            <Button variant="outline" className="w-full border-fuchsia-400/50 text-fuchsia-300 hover:bg-fuchsia-500/20">
                                <Layers className="w-4 h-4 mr-2" />
                                Manage Surfaces Pro
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default DeterministicPanel;