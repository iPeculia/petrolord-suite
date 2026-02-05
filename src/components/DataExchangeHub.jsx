import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Download, Search, Database, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIntegration } from '@/contexts/IntegrationContext';
import { formatDistanceToNow } from 'date-fns';

// This component can be dropped into any app to allow it to Import/Export data
const DataExchangeHub = ({ 
    mode = "import", // 'import' or 'export'
    currentData = null, // Required for export
    currentAppName = "", // Required for export
    onImport = () => {}, // Callback when data is selected for import
    categoryFilter = null // Optional: Pre-filter import list
}) => {
    const { publishData, searchSharedData, isPublishing, isFetching } = useIntegration();
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Export State
    const [exportName, setExportName] = useState("");
    const [exportCategory, setExportCategory] = useState(categoryFilter || "GENERAL");

    const loadData = async () => {
        const data = await searchSharedData({ category: categoryFilter === 'ALL' ? null : categoryFilter });
        setResults(data || []);
    };

    useEffect(() => {
        if (isOpen && mode === 'import') {
            loadData();
        }
    }, [isOpen, mode, categoryFilter]);

    const handlePublish = async () => {
        if (!exportName) return;
        await publishData({
            sourceAppId: currentAppName,
            sourceRecordId: crypto.randomUUID(), // In real app, this comes from saved project ID
            category: exportCategory,
            name: exportName,
            data: currentData
        });
        setIsOpen(false);
    };

    const filteredResults = results.filter(item => 
        item.data_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.well?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.reservoir?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={mode === 'export' ? "default" : "outline"} size="sm" className={mode === 'export' ? "bg-indigo-600 hover:bg-indigo-700" : "border-dashed"}>
                    {mode === 'export' ? <Share2 className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                    {mode === 'export' ? "Share Data" : "Import Data"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-slate-900 text-white border-slate-700">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-indigo-400" />
                        {mode === 'export' ? "Publish to Data Exchange" : "Import from Data Exchange"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {mode === 'export' 
                            ? "Make your analysis results available to other apps in the Petrolord Suite." 
                            : "Pull standardized data (PVT, Trajectories, Forecasts) from other applications."}
                    </DialogDescription>
                </DialogHeader>

                {mode === 'export' ? (
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Data Name</label>
                                <Input 
                                    value={exportName} 
                                    onChange={(e) => setExportName(e.target.value)} 
                                    placeholder="e.g., Final PVT Model - Well A-01"
                                    className="bg-slate-800 border-slate-600"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Category</label>
                                <Select value={exportCategory} onValueChange={setExportCategory}>
                                    <SelectTrigger className="bg-slate-800 border-slate-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PVT_MODEL">PVT Model</SelectItem>
                                        <SelectItem value="WELL_TRAJECTORY">Well Trajectory</SelectItem>
                                        <SelectItem value="PRODUCTION_FORECAST">Production Forecast</SelectItem>
                                        <SelectItem value="WELL_LOGS">Well Logs (Las)</SelectItem>
                                        <SelectItem value="GENERAL">General Data</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={handlePublish} disabled={isPublishing || !exportName} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            {isPublishing ? "Publishing..." : "Publish Data"}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search by name, well, or app..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 bg-slate-800 border-slate-600"
                                />
                            </div>
                            <Button variant="outline" size="icon" onClick={loadData} disabled={isFetching}>
                                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>

                        <ScrollArea className="h-[300px] pr-4">
                            {filteredResults.length === 0 ? (
                                <div className="text-center py-10 text-slate-500">
                                    <p>No shared data found matching your criteria.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredResults.map((item) => (
                                        <Card key={item.id} className="bg-slate-800 border-slate-700 hover:border-indigo-500 transition-colors cursor-pointer" onClick={() => { onImport(item.payload); setIsOpen(false); }}>
                                            <CardContent className="p-3 flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold text-white">{item.data_name}</h4>
                                                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">{item.source_app_id}</Badge>
                                                    </div>
                                                    <p className="text-xs text-slate-400">
                                                        {item.well ? `Well: ${item.well.name}` : ''} {item.reservoir ? ` • Res: ${item.reservoir.name}` : ''}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 mt-1">
                                                        Updated {formatDistanceToNow(new Date(item.created_at))} ago
                                                    </p>
                                                </div>
                                                <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30">
                                                    Select
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DataExchangeHub;