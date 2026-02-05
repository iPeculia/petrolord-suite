import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Download, RefreshCw, Database } from 'lucide-react';
import { PetroLordIntegrationManager } from '../../services/PetroLordIntegrationManager';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const CrossAppDataBrowser = ({ onImport, filterApp }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    const loadData = async () => {
        setLoading(true);
        try {
            const items = await PetroLordIntegrationManager.fetchSharedData({ sourceApp: filterApp });
            setData(items || []);
        } catch (err) {
            console.error(err);
            toast({ variant: "destructive", title: "Fetch Failed", description: "Could not load shared data." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [filterApp]);

    const filteredData = data.filter(item => 
        item.data_name.toLowerCase().includes(search.toLowerCase()) ||
        item.data_category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <Input 
                        placeholder="Search shared data..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-8 bg-slate-900 border-slate-700"
                    />
                </div>
                <Button variant="outline" size="icon" onClick={loadData} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <ScrollArea className="flex-1 border border-slate-800 rounded-md bg-slate-900/50 p-2">
                {filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                        <Database className="h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm">No shared data found.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredData.map(item => (
                            <Card key={item.id} className="p-3 bg-slate-900 border-slate-800 flex items-center justify-between group hover:border-slate-600 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-medium text-white truncate">{item.data_name}</h4>
                                        <Badge variant="outline" className="text-[10px] h-5 px-1 bg-slate-800 border-slate-700 text-slate-400">
                                            {item.data_category}
                                        </Badge>
                                        <span className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate mt-1">
                                        Source: <span className="text-blue-400">{item.source_app_id}</span> • {item.description || 'No description'}
                                    </p>
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30"
                                    onClick={() => onImport(item)}
                                >
                                    <Download className="h-4 w-4 mr-2" /> Import
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default CrossAppDataBrowser;