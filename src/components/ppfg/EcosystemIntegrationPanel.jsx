import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, CheckCircle2, XCircle } from 'lucide-react';
import { INTEGRATION_TOOLS, testIntegrationConnection, exportToTool } from '@/utils/ecosystemIntegration';
import { useToast } from '@/components/ui/use-toast';

const EcosystemIntegrationPanel = ({ data }) => {
    const { toast } = useToast();
    const [statuses, setStatuses] = React.useState({});
    const [loading, setLoading] = React.useState({});

    const handleTest = async (toolId) => {
        setLoading(prev => ({ ...prev, [toolId]: true }));
        const result = await testIntegrationConnection(toolId);
        setStatuses(prev => ({ ...prev, [toolId]: result ? 'connected' : 'error' }));
        setLoading(prev => ({ ...prev, [toolId]: false }));
    };

    const handleExport = async (toolId) => {
        setLoading(prev => ({ ...prev, [toolId]: true }));
        await exportToTool(toolId, data);
        toast({ title: "Integration Success", description: `Data exported to ${toolId}` });
        setLoading(prev => ({ ...prev, [toolId]: false }));
    };

    return (
        <div className="h-full overflow-y-auto p-2 space-y-3">
            {INTEGRATION_TOOLS.map(tool => (
                <Card key={tool.id} className="p-3 bg-slate-900 border-slate-800 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-purple-400" />
                            <div>
                                <div className="text-sm font-bold text-slate-200">{tool.name}</div>
                                <div className="text-[10px] text-slate-500">{tool.description}</div>
                            </div>
                        </div>
                        {statuses[tool.id] === 'connected' && <Badge variant="outline" className="text-emerald-400 border-emerald-900 bg-emerald-900/20">Connected</Badge>}
                        {statuses[tool.id] === 'error' && <Badge variant="outline" className="text-red-400 border-red-900 bg-red-900/20">Error</Badge>}
                    </div>
                    
                    <div className="flex gap-2 mt-1">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs flex-1 border-slate-700"
                            onClick={() => handleTest(tool.id)}
                            disabled={loading[tool.id]}
                        >
                            {loading[tool.id] ? 'Testing...' : 'Test Connection'}
                        </Button>
                        <Button 
                            size="sm" 
                            className="h-7 text-xs flex-1 bg-purple-600 hover:bg-purple-500"
                            onClick={() => handleExport(tool.id)}
                            disabled={statuses[tool.id] !== 'connected' || loading[tool.id]}
                        >
                            Sync Data
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default EcosystemIntegrationPanel;