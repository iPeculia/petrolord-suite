import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gauge, ArrowRight } from 'lucide-react';
import CrossAppDataBrowser from './CrossAppDataBrowser';
import { PPFGDataAdapter } from '../../services/adapters/PPFGDataAdapter';
import { useReservoirCalc } from '../../contexts/ReservoirCalcContext';
import { useToast } from '@/components/ui/use-toast';

const PPFGIntegrationPanel = () => {
    const { updateInputs } = useReservoirCalc();
    const { toast } = useToast();
    const [importedData, setImportedData] = useState(null);

    const handleImport = (rawData) => {
        const adapted = PPFGDataAdapter.adapt(rawData);
        if (adapted) {
            setImportedData(adapted);
            // Auto-apply known values if user confirms
        }
    };

    const applyData = () => {
        if (!importedData) return;
        
        const updates = {};
        let msg = [];

        if (importedData.owc) {
            updates.owc = importedData.owc;
            msg.push('OWC');
        }
        if (importedData.goc) {
            updates.goc = importedData.goc;
            msg.push('GOC');
        }
        // Could also map pressure gradients to hypothetical inputs if the app supported them
        
        updateInputs(updates);
        toast({ title: "Data Applied", description: `Updated: ${msg.join(', ')}` });
        setImportedData(null);
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Gauge className="w-5 h-5" />
                <h3 className="font-bold">PPFG Analyzer Integration</h3>
            </div>

            <div className="flex-1 min-h-0">
                <CrossAppDataBrowser 
                    filterApp="ppfg-analyzer" 
                    onImport={handleImport}
                />
            </div>

            {importedData && (
                <Card className="bg-amber-950/20 border-amber-900/50 mt-4">
                    <CardHeader className="p-3 pb-0">
                        <CardTitle className="text-sm text-amber-400">Preview Import</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-slate-400">Source:</div>
                            <div className="text-white">{importedData.name}</div>
                            <div className="text-slate-400">OWC:</div>
                            <div className="text-white">{importedData.owc || '-'}</div>
                            <div className="text-slate-400">GOC:</div>
                            <div className="text-white">{importedData.goc || '-'}</div>
                        </div>
                        <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700" onClick={applyData}>
                            Apply Values <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default PPFGIntegrationPanel;