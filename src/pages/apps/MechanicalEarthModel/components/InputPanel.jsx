import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Check, Cloud, RefreshCw } from 'lucide-react';
import FileUploader from './FileUploader';
import CurveMapper from './CurveMapper';
import UnitConverter from './UnitConverter';
import DataQC from './DataQC';
import MechanicalPropertiesForm from './MechanicalPropertiesForm';
import PressureInputForm from './PressureInputForm';
import { useMEMState } from '../hooks/useMEMState';
import { useDataSync } from '../hooks/useDataSync';
import { useToast } from '@/components/ui/use-toast';

const InputPanel = ({ onCalculate }) => {
    const { state, dispatch } = useMEMState();
    const { toast } = useToast();
    const { saveWellLogData, syncStatus } = useDataSync(state, dispatch);
    const [activeTab, setActiveTab] = useState('data');

    const { logs, curveMap, unitSystem } = state.inputs;

    // Auto-save when inputs change
    useEffect(() => {
        if (state.projectId && logs) {
            saveWellLogData({ wellName: 'DefaultWell', logData: logs, curveMap });
        }
    }, [logs, curveMap, state.projectId]);


    const handleFileParsed = (parsedData) => {
        dispatch({ type: 'SET_INPUT_DATA', payload: { logs: parsedData } });
        if (!state.projectId) {
            toast({ title: 'Project not saved', description: 'Create or load a project to save your work.'});
        }
    };
    
    const handleCurveMapChange = (newCurveMap) => {
        dispatch({ type: 'SET_CURVE_MAP', payload: newCurveMap });
    };

    const handleUnitSystemChange = (newUnitSystem) => {
        dispatch({ type: 'SET_UNIT_SYSTEM', payload: newUnitSystem });
    };

    const SyncIndicator = () => {
        const icons = {
            idle: <Cloud className="w-4 h-4 text-slate-500" />,
            saving: <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />,
            success: <Check className="w-4 h-4 text-green-400" />,
        };
        const text = {
            idle: "Changes saved locally",
            saving: "Saving to cloud...",
            success: "All changes saved",
        }
        return (
            <div className="flex items-center gap-2 text-xs text-slate-400">
                {icons[syncStatus]}
                <span>{text[syncStatus]}</span>
            </div>
        )
    };

    return (
        <div className="h-full flex flex-col bg-slate-900 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Inputs & Settings</h2>
                {state.projectId && <SyncIndicator />}
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="data">Data</TabsTrigger>
                    <TabsTrigger value="params">Params</TabsTrigger>
                    <TabsTrigger value="qc">QC</TabsTrigger>
                </TabsList>

                <TabsContent value="data" className="flex-grow mt-4 space-y-4">
                    <FileUploader onFileParsed={handleFileParsed} />
                    {logs && <CurveMapper logs={logs} onMapChange={handleCurveMapChange} initialMap={state.inputs.curveMap} />}
                    <UnitConverter onUnitChange={handleUnitSystemChange} currentSystem={unitSystem} />
                </TabsContent>
                
                <TabsContent value="params" className="flex-grow mt-4 space-y-4">
                    <MechanicalPropertiesForm />
                    <PressureInputForm />
                </TabsContent>

                <TabsContent value="qc" className="flex-grow mt-4">
                    <DataQC logs={logs} />
                </TabsContent>
            </Tabs>

            <div className="mt-auto pt-4 border-t border-slate-800">
                <Button onClick={onCalculate} className="w-full bg-blue-600 hover:bg-blue-500">
                    <Play className="mr-2 h-4 w-4" /> Run Calculation
                </Button>
            </div>
        </div>
    );
};

export default InputPanel;