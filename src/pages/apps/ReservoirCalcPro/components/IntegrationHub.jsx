import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Network, Database, Share2, RefreshCcw } from 'lucide-react';
import PPFGIntegrationPanel from './integration/PPFGIntegrationPanel';
import VelocityModelIntegrationPanel from './integration/VelocityModelIntegrationPanel';
import CrossAppDataBrowser from './integration/CrossAppDataBrowser';
import { Button } from '@/components/ui/button';
import { useReservoirCalc } from '../contexts/ReservoirCalcContext';
import { SharedDataLayer } from '../services/SharedDataLayer';
import { useToast } from '@/components/ui/use-toast';

const IntegrationHub = () => {
    const { state } = useReservoirCalc();
    const { toast } = useToast();

    const handleShareResults = async () => {
        if (!state.results) {
            toast({ variant: "destructive", title: "No Results", description: "Run calculation first." });
            return;
        }
        try {
            await SharedDataLayer.shareResult(
                `${state.reservoirName} Results`, 
                state.results, 
                state.projectId // Assuming we had projectId in state, else generic
            );
            toast({ title: "Results Shared", description: "Available to other PetroLord apps." });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Share Failed", description: error.message });
        }
    };

    return (
        <div className="h-full bg-slate-950 p-4 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Network className="w-5 h-5 text-indigo-400" /> Data Exchange Hub
                </h3>
                <Button size="sm" variant="outline" onClick={handleShareResults} className="gap-2 border-indigo-500/30 text-indigo-400 hover:bg-indigo-950/30">
                    <Share2 className="w-4 h-4" /> Share Current Results
                </Button>
            </div>

            <Tabs defaultValue="browse" className="flex-1 flex flex-col">
                <TabsList className="w-full grid grid-cols-3 bg-slate-900">
                    <TabsTrigger value="browse">Browse All</TabsTrigger>
                    <TabsTrigger value="ppfg">PPFG</TabsTrigger>
                    <TabsTrigger value="velocity">Velocity</TabsTrigger>
                </TabsList>

                <div className="flex-1 mt-4 bg-slate-900/50 rounded-lg border border-slate-800 p-4 overflow-hidden">
                    <TabsContent value="browse" className="h-full mt-0">
                        <CrossAppDataBrowser onImport={(item) => console.log("Generic import", item)} />
                    </TabsContent>
                    
                    <TabsContent value="ppfg" className="h-full mt-0">
                        <PPFGIntegrationPanel />
                    </TabsContent>
                    
                    <TabsContent value="velocity" className="h-full mt-0">
                        <VelocityModelIntegrationPanel />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default IntegrationHub;