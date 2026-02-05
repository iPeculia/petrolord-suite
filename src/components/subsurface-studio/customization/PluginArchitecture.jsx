import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Blocks, Download, Trash2, Settings, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PluginArchitecture = () => {
    const { toast } = useToast();
    const [plugins, setPlugins] = useState([
        { id: 1, name: 'Seismic Attribute Library', version: '2.1.0', author: 'CoreLab', enabled: true, status: 'Active' },
        { id: 2, name: 'Python Bridge v3', version: '3.0.1', author: 'OpenSource', enabled: true, status: 'Active' },
        { id: 3, name: 'Legacy LAS Importer', version: '1.0.5', author: 'Internal', enabled: false, status: 'Disabled' },
    ]);

    const togglePlugin = (id) => {
        setPlugins(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled, status: !p.enabled ? 'Active' : 'Disabled' } : p));
        toast({ title: "Plugin Status Updated" });
    };

    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <Blocks className="w-5 h-5 mr-2 text-purple-400" /> Plugin Manager
                </h3>
                <Button className="bg-purple-600 hover:bg-purple-700 text-xs">
                    <Download className="w-4 h-4 mr-2" /> Install New Plugin
                </Button>
            </div>

            <div className="space-y-3">
                {plugins.map(plugin => (
                    <Card key={plugin.id} className="bg-slate-950 border-slate-800 hover:border-slate-700 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded bg-slate-900 ${plugin.enabled ? 'text-purple-400' : 'text-slate-600'}`}>
                                    <Blocks className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-200 flex items-center gap-2">
                                        {plugin.name}
                                        <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500">v{plugin.version}</Badge>
                                    </div>
                                    <div className="text-xs text-slate-500">By {plugin.author}</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs ${plugin.enabled ? 'text-green-500' : 'text-slate-500'}`}>
                                        {plugin.status}
                                    </span>
                                    <Switch checked={plugin.enabled} onCheckedChange={() => togglePlugin(plugin.id)} />
                                </div>
                                <div className="h-8 w-[1px] bg-slate-800"></div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" className="h-8 w-8"><Settings className="w-4 h-4 text-slate-400" /></Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PluginArchitecture;