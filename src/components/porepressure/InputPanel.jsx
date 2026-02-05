import React, { useState, useEffect, useMemo } from 'react';
    import {
      Accordion,
      AccordionContent,
      AccordionItem,
      AccordionTrigger,
    } from "@/components/ui/accordion";
    import { Button } from "@/components/ui/button";
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    } from "@/components/ui/select";
    import { Checkbox } from "@/components/ui/checkbox";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
    import { Info, RotateCcw, Loader2 } from "lucide-react";
    import NewWellDialog from './NewWellDialog';

    const defaultCoefficients = {
        Eaton_n: 1.2,
        Bowers_A: 0.8,
        Bowers_B: 0.9,
        Bowers_C: 0.7,
        NCT_depth_ft: 1000,
        NCT_value_ppg: 9.0,
    };

    const InputPanel = ({ wells, selectedWell, onWellChange, datasets, events, onAnalysis, isAnalyzing, onWellCreated, isCreatingWell, setIsCreatingWell, usingSampleData }) => {
        const [selectedDataset, setSelectedDataset] = useState('');
        const [methods, setMethods] = useState({
            Eaton_Sonic: true,
            Eaton_Resistivity: false,
            Bowers: false,
            dexp: false,
        });
        const [coefficients, setCoefficients] = useState(defaultCoefficients);
        const [filters, setFilters] = useState({ gr_max: '100', resample_step: '50' });
        const [units, setUnits] = useState('imperial');

        useEffect(() => {
          if (datasets.length > 0) {
            const defaultDataset = datasets[0].id;
            setSelectedDataset(defaultDataset);
          } else {
            setSelectedDataset('');
          }
        }, [datasets]);

        const handleMethodChange = (method) => {
            setMethods(prev => ({ ...prev, [method]: !prev[method] }));
        };

        const handleCoefficientChange = (param, value) => {
            setCoefficients(prev => ({ ...prev, [param]: parseFloat(value) || 0 }));
        };
        
        const handleFilterChange = (param, value) => {
            setFilters(prev => ({ ...prev, [param]: value }));
        };

        const handleResetCoefficients = () => {
            setCoefficients(defaultCoefficients);
        };

        const handleAnalyzeClick = () => {
            onAnalysis({
                dataset_id: selectedDataset,
                methods,
                coefficients,
                filters,
                units
            });
        };
        
        const isAnalysisDisabled = useMemo(() => {
          return !selectedDataset || Object.values(methods).every(v => !v) || isAnalyzing;
        }, [selectedDataset, methods, isAnalyzing]);

        return (
            <Card className="h-full overflow-y-auto">
                <CardHeader>
                    <CardTitle>Analysis Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="well-select">Well</Label>
                        <div className="flex gap-2">
                            <Select
                                id="well-select"
                                value={selectedWell?.id || ''}
                                onValueChange={(wellId) => onWellChange(wells.find(w => w.id === wellId))}
                                disabled={usingSampleData}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a well" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wells.map(well => (
                                        <SelectItem key={well.id} value={well.id}>{well.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {!usingSampleData && (
                                <NewWellDialog
                                    onWellCreated={onWellCreated}
                                    isOpen={isCreatingWell}
                                    setIsOpen={setIsCreatingWell}
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dataset-select">Dataset</Label>
                        <Select id="dataset-select" value={selectedDataset} onValueChange={setSelectedDataset}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a dataset" />
                            </SelectTrigger>
                            <SelectContent>
                                {datasets.map(dataset => (
                                    <SelectItem key={dataset.id} value={dataset.id}>{dataset.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Analysis Methods</AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-3">
                                {Object.keys(methods).map(method => (
                                    <div key={method} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={method}
                                            checked={methods[method]}
                                            onCheckedChange={() => handleMethodChange(method)}
                                        />
                                        <label htmlFor={method} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {method.replace('_', ' ')}
                                        </label>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Parameters</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-3">
                                <div className="flex justify-end">
                                    <Button variant="outline" size="sm" onClick={handleResetCoefficients}>
                                        <RotateCcw className="w-3 h-3 mr-2" />
                                        Reset
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                {Object.keys(coefficients).map(param => (
                                    <div key={param} className="space-y-1">
                                        <Label htmlFor={param} className="text-xs">{param.replace('_', ' ')}</Label>
                                        <Input
                                            id={param}
                                            type="number"
                                            value={coefficients[param]}
                                            onChange={(e) => handleCoefficientChange(param, e.target.value)}
                                            step={param === 'Eaton_n' ? 0.01 : 0.1}
                                        />
                                    </div>
                                ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Calibration & Filters</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-3">
                                 <div className="space-y-2">
                                    <Label>Tie Points (Events)</Label>
                                    <div className="p-3 bg-gray-100 rounded-md text-sm">
                                        {events.length > 0 ? `${events.length} events loaded for calibration.` : 'No events found for this well.'}
                                    </div>
                                </div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-1">
                                         <Label htmlFor="gr_max" className="text-xs">Shale GR Cutoff (API)</Label>
                                         <Input id="gr_max" value={filters.gr_max} onChange={e => handleFilterChange('gr_max', e.target.value)} />
                                     </div>
                                      <div className="space-y-1">
                                         <Label htmlFor="resample_step" className="text-xs">Resample Step ({units === 'imperial' ? 'ft' : 'm'})</Label>
                                         <Input id="resample_step" value={filters.resample_step} onChange={e => handleFilterChange('resample_step', e.target.value)} />
                                     </div>
                                 </div>
                                  <Button variant="outline" className="w-full" disabled>
                                    Auto-fit to Events (coming soon)
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Button onClick={handleAnalyzeClick} className="w-full" disabled={isAnalysisDisabled}>
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            'Run Analysis'
                        )}
                    </Button>
                </CardContent>
            </Card>
        );
    };

    export default InputPanel;