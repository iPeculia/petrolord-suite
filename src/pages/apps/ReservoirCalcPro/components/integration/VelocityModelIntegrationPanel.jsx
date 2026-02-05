import React from 'react';
import { Layers, Download } from 'lucide-react';
import CrossAppDataBrowser from './CrossAppDataBrowser';
import { VelocityModelDataAdapter } from '../../services/adapters/VelocityModelDataAdapter';
import { useReservoirCalc } from '../../contexts/ReservoirCalcContext';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const VelocityModelIntegrationPanel = () => {
    const { addSurface } = useReservoirCalc();
    const { toast } = useToast();

    const handleImport = (rawData) => {
        const adapted = VelocityModelDataAdapter.adapt(rawData);
        if (adapted && adapted.depthGrid) {
            // Convert to Surface object structure
            const surface = {
                id: uuidv4(),
                name: adapted.name,
                points: adapted.depthGrid, // Assuming grid is {x,y,z} array
                importedAt: new Date().toISOString(),
                source: 'VelocityModelBuilder'
            };
            addSurface(surface);
            toast({ title: "Surface Imported", description: `Loaded depth grid from ${adapted.name}` });
        } else {
            toast({ variant: "destructive", title: "Import Failed", description: "Incompatible data format." });
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Layers className="w-5 h-5" />
                <h3 className="font-bold">Velocity Model Builder</h3>
            </div>
            <div className="flex-1 min-h-0">
                <CrossAppDataBrowser 
                    filterApp="velocity-model-builder" 
                    onImport={handleImport}
                />
            </div>
        </div>
    );
};

export default VelocityModelIntegrationPanel;