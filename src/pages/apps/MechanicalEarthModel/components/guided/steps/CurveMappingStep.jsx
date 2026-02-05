import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useGuidedMode } from '../../../contexts/GuidedModeContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CURVE_MNEMONICS, CURVE_ALIASES } from '../../../constants';
import { Loader2, CheckCircle, AlertTriangle, List, BrainCircuit, HelpCircle, FileSignature, Timer, ChevronLeft, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import CurveMapper from '../../CurveMapper';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const normalizeString = (str) => {
    if (!str) return '';
    return str.replace(/[\s_-]/g, '').toUpperCase();
};

const MappedCurveItem = ({ standard, result }) => {
    const getConfidenceColor = (confidence) => {
        switch (confidence) {
            case 'High': return 'bg-green-500/20 text-green-300';
            case 'Medium': return 'bg-yellow-500/20 text-yellow-300';
            case 'Low': return 'bg-orange-500/20 text-orange-300';
            default: return 'bg-slate-600';
        }
    };
    
    const getStrategyIcon = (strategy) => {
        switch (strategy) {
            case 'Exact Mnemonic Match':
            case 'Alias Match':
                return <FileSignature className="h-4 w-4" title={strategy} />;
            case 'Description Match':
                return <BrainCircuit className="h-4 w-4" title={strategy} />;
            default:
                return <HelpCircle className="h-4 w-4" title="Unknown Strategy" />;
        }
    };

    return (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 bg-slate-700/50 rounded-md text-sm"
    >
        <div className="flex justify-between items-center">
            <div className="font-semibold text-slate-200">{standard}</div>
            {result ? (
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-slate-400" title={result.strategy}>
                        {getStrategyIcon(result.strategy)}
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getConfidenceColor(result.confidence)}`}>
                        {result.confidence}
                    </span>
                    <span className="text-slate-100 font-mono w-24 text-right truncate">{result.curve}</span>
                </div>
            ) : (
                <span className="text-slate-500 font-mono">Not Found</span>
            )}
        </div>
        {result && result.stats && (
            <div className="text-xs text-slate-400 mt-1.5 flex justify-end gap-4 font-mono">
                <span>Min: {result.stats.min?.toFixed(2) ?? 'N/A'}</span>
                <span>Max: {result.stats.max?.toFixed(2) ?? 'N/A'}</span>
                <span>Mean: {result.stats.mean?.toFixed(2) ?? 'N/A'}</span>
            </div>
        )}
    </motion.div>
)};

const CurveMappingStep = () => {
    const { state, dispatch } = useGuidedMode();
    const { toast } = useToast();
    const { lasData, curveMapping } = state;
    const [status, setStatus] = useState('waiting'); // waiting, loading, success, error, manual, timeout
    const [progress, setProgress] = useState(0);
    const [mappedCurves, setMappedCurves] = useState({});
    const [missingRequired, setMissingRequired] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [currentProcessingCurve, setCurrentProcessingCurve] = useState('');
    
    const mappingTimeoutRef = useRef(null);
    const elapsedTimeRef = useRef(null);

    const runAutoMapping = useCallback(() => {
        if (!lasData || !lasData.curves || lasData.curves.length === 0) {
            setStatus('waiting');
            return;
        }

        setStatus('loading');
        setElapsedTime(0);
        setCurrentProcessingCurve('');
        
        const cleanup = () => {
            if (mappingTimeoutRef.current) clearTimeout(mappingTimeoutRef.current);
            if (elapsedTimeRef.current) clearInterval(elapsedTimeRef.current);
        };
        
        elapsedTimeRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
        mappingTimeoutRef.current = setTimeout(() => {
            setStatus('timeout');
            dispatch({ type: 'SET_VALIDATION', payload: { step: 2, isValid: false } });
        }, 30000);

        const processMapping = () => {
            const fileCurvesWithStats = lasData.curves.map(mnemonic => ({
                mnemonic,
                unit: lasData.header.CURVES?.[mnemonic]?.unit || '',
                description: lasData.header.CURVES?.[mnemonic]?.description || '',
                stats: lasData.stats[mnemonic]
            }));

            const mapped = {};
            const usedFileCurves = new Set();
            const totalCurvesToMap = CURVE_MNEMONICS.ALL_FOR_MAPPING.length;

            CURVE_MNEMONICS.ALL_FOR_MAPPING.forEach((stdCurve, index) => {
                setCurrentProcessingCurve(stdCurve.name);
                setProgress(((index + 1) / totalCurvesToMap) * 100);

                const findMatch = (stdMnemonic) => {
                     const normStdMnemonic = normalizeString(stdMnemonic);
                     for (const fileCurve of fileCurvesWithStats) {
                        if(usedFileCurves.has(fileCurve.mnemonic)) continue;
                        if(normalizeString(fileCurve.mnemonic) === normStdMnemonic) return { curve: fileCurve.mnemonic, confidence: 'High', strategy: 'Exact Mnemonic Match', stats: fileCurve.stats };
                     }
                     for (const fileCurve of fileCurvesWithStats) {
                        if(usedFileCurves.has(fileCurve.mnemonic)) continue;
                        const aliases = CURVE_ALIASES[stdMnemonic] || [];
                        for (const alias of aliases) {
                            if (normalizeString(fileCurve.mnemonic) === normalizeString(alias)) return { curve: fileCurve.mnemonic, confidence: 'High', strategy: 'Alias Match', stats: fileCurve.stats };
                        }
                     }
                     for (const fileCurve of fileCurvesWithStats) {
                        if(usedFileCurves.has(fileCurve.mnemonic)) continue;
                        const normDesc = normalizeString(fileCurve.description);
                        if(normDesc.includes(normStdMnemonic)) return { curve: fileCurve.mnemonic, confidence: 'Medium', strategy: 'Description Match', stats: fileCurve.stats };
                     }
                     return null;
                };

                const match = findMatch(stdCurve.mnemonic);
                if (match) {
                    mapped[stdCurve.mnemonic] = match;
                    usedFileCurves.add(match.curve);
                }
            });
            
            cleanup();
            setMappedCurves(mapped);
            
            const required = CURVE_MNEMONICS.REQUIRED;
            const missing = required.filter(curve => !mapped[curve]);
            
            const curveMapForState = Object.entries(mapped).reduce((acc, [key, val]) => {
                acc[key] = val.curve;
                return acc;
            }, {});
            
            dispatch({ type: 'SET_CURVE_MAPPING', payload: curveMapForState });

            if (missing.length > 0) {
                setMissingRequired(missing);
                setStatus('error');
                dispatch({ type: 'SET_VALIDATION', payload: { step: 2, isValid: false } });
            } else {
                setStatus('success');
                dispatch({ type: 'SET_VALIDATION', payload: { step: 2, isValid: true } });
            }
        };
        setTimeout(processMapping, 100);
        return cleanup;
    }, [lasData, dispatch]);

    useEffect(() => {
        runAutoMapping();
    }, [runAutoMapping]);

    const handleMapChange = useCallback((newCurveMap) => {
        dispatch({ type: 'SET_CURVE_MAPPING', payload: newCurveMap });
        const allRequiredMapped = CURVE_MNEMONICS.REQUIRED.every(rc => !!newCurveMap[rc]);
        if (state.validation[2] !== allRequiredMapped) {
            dispatch({ type: 'SET_VALIDATION', payload: { step: 2, isValid: allRequiredMapped } });
        }
        if(!allRequiredMapped){
            toast({ variant: 'destructive', title: 'Missing Required Curves', description: 'Please ensure all required curves are mapped.' });
        }
    }, [dispatch, state.validation, toast]);

    useEffect(() => {
        // Recalculate validation on load, in case we return to this step
        handleMapChange(curveMapping);
    }, []);

    const handlePrevious = () => {
        dispatch({ type: 'PREVIOUS_STEP' });
    };
    
    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    if (status === 'waiting' || !lasData) {
        return (
            <Card className="max-w-2xl mx-auto bg-slate-800 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Waiting for Data</CardTitle>
                    <CardDescription className="text-slate-400">Please upload a LAS file in the previous step to proceed with curve mapping.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const renderContent = () => {
        if (status === 'manual') {
            return (
                <div className="max-w-2xl mx-auto">
                     <Card className="bg-transparent border-none shadow-none text-center">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-white">Manual Curve Mapping</CardTitle>
                            <CardDescription className="text-slate-400">
                                Automatic mapping failed or requires review. Please map the curves manually. Required curves are marked with *.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <CurveMapper 
                        logs={lasData}
                        initialMap={curveMapping}
                        onMapChange={handleMapChange}
                    />
                </div>
            );
        }

        return (
            <Card className="max-w-2xl mx-auto bg-slate-800 border-slate-700">
                <CardHeader className="text-center">
                    {status === 'loading' && <Loader2 className="h-10 w-10 text-blue-400 animate-spin mx-auto mb-2" />}
                    {status === 'success' && <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-2" />}
                    {(status === 'error' || status === 'timeout') && <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-2" />}
                    
                    <CardTitle className="text-2xl font-bold text-white">
                        {status === 'loading' && "Auto-mapping Curves..."}
                        {status === 'success' && "Auto-mapping Complete!"}
                        {status === 'error' && "Mapping Incomplete"}
                        {status === 'timeout' && "Mapping Timed Out"}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                         {status === 'loading' && "Our AI is analyzing your file and mapping curves automatically."}
                         {status === 'success' && "All required curves successfully mapped."}
                         {status === 'error' && "Could not find all required curves. Please review the results."}
                         {status === 'timeout' && "The automatic mapping process took too long. You can try again or switch to manual mapping."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {status === 'loading' && (
                        <div className="space-y-3">
                            <Progress value={progress} className="w-full" />
                            <div className="flex justify-between items-center text-sm text-slate-400">
                                <span>Processing: <span className="font-semibold text-slate-300">{currentProcessingCurve}</span></span>
                                <span className="flex items-center gap-1.5"><Timer className="h-4 w-4" /> {elapsedTime}s</span>
                            </div>
                        </div>
                    )}
                    
                    {(status === 'success' || status === 'error') && (
                        <div className="space-y-3">
                             <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    <List className="mr-2 h-5 w-5" />
                                    Mapping Summary
                                </h3>
                                <Button variant="link" onClick={() => setStatus('manual')}>Edit Manually</Button>
                             </div>
                             {CURVE_MNEMONICS.ALL_FOR_MAPPING.map(std => (
                                <MappedCurveItem key={std.mnemonic} standard={std.name} result={mappedCurves[std.mnemonic]}/>
                             ))}
                        </div>
                    )}

                    {(status === 'error' || status === 'timeout') && (
                        <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-center space-y-3">
                            {status === 'error' && <p className="font-semibold text-red-300">Missing Required Curves: {missingRequired.join(', ')}</p>}
                            {status === 'timeout' && <p className="font-semibold text-red-300">Analysis timed out after {elapsedTime} seconds.</p>}
                            <p className="text-sm text-slate-300">Please provide a file with the required curves, or map them manually.</p>
                            <Button variant="outline" className="bg-slate-700 hover:bg-slate-600" onClick={() => setStatus('manual')}>
                                Switch to Manual Mapping
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full"
        >
            <div className="flex-grow">
                {renderContent()}
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-700 flex justify-between items-center max-w-2xl mx-auto w-full">
                <Button variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>
                <Button onClick={handleNext} disabled={!state.validation[2]}>
                    Next Step
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
};

export default CurveMappingStep;