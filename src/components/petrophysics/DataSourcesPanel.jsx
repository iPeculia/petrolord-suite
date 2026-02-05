import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { ExternalDataService } from '@/utils/externalDataApi';
import { 
    Globe, Database, TrendingUp, CloudRain, Activity, Server, 
    RefreshCw, Download, Key, CheckCircle, AlertTriangle, Clock,
    Layers, Search, Save
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const DataSourcesPanel = ({ petroState, onImportWell }) => {
    const { toast } = useToast();
    const [apiService] = useState(new ExternalDataService(toast));
    
    const [activeIntegration, setActiveIntegration] = useState('wells');
    const [loading, setLoading] = useState(false);
    const [lastSync, setLastSync] = useState(null);
    
    // Well Search State
    const [wellSource, setWellSource] = useState('usgs');
    const [searchQuery, setSearchQuery] = useState('');
    const [foundWells, setFoundWells] = useState([]);
    
    // Market Data State
    const [marketData, setMarketData] = useState(null);
    
    // API Keys State
    const [apiKeys, setApiKeys] = useState({
        usgs: '',
        generic_rest: '',
        market_alpha: '',
        weather_noaa: ''
    });

    // -- Handlers --

    const handleApiKeyChange = (service, value) => {
        setApiKeys(prev => ({ ...prev, [service]: value }));
        apiService.setApiKey(service, value);
    };

    const handleSearchWells = async () => {
        setLoading(true);
        try {
            const data = await apiService.fetchWellData(wellSource, { search: searchQuery });
            setFoundWells(data);
            setLastSync(new Date());
        } catch (error) {
            toast({ variant: "destructive", title: "Fetch Failed", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleImportWell = (well) => {
        // Convert external well format to internal format
        // In a real app, this would fetch the LAS file URL associated with the well record
        // Here we mock a file object to pass to the existing LAS loader
        
        toast({ title: "Importing Well...", description: `Fetching data for ${well.name}` });
        
        // Mocking the import process delay
        setTimeout(() => {
            // Create a dummy file object or struct that the main app can interpret or fetch
            // Since the main app expects a File object for LAS, we might need to adjust main app or mock it better.
            // For now, we'll trigger a toast saying we need the LAS file itself, or simulate creating a basic well struct.
            
            const dummyWellData = {
                id: crypto.randomUUID(),
                name: well.name,
                api: well.api,
                data: [], // Empty logs for now
                curveMap: {},
                depthRange: { min: 0, max: well.depth }
            };
            
            // We can't fully use onImportWell (addWellFromLAS) because it expects a File/Text.
            // We will simulate valid LAS content for a "Digital Import"
            const mockLasContent = `~Version
VERS. 2.0 : CWLS LOG ASCII STANDARD - VERSION 2.0
WRAP.  NO : One line per depth step
~Well
STRT.FT      0.0000 : START DEPTH
STOP.FT   ${well.depth}.0000 : STOP DEPTH
STEP.FT      0.5000 : STEP
NULL.      -999.2500 : NULL VALUE
COMP.      ${wellSource.toUpperCase()} : COMPANY
WELL.      ${well.name} : WELL
~Curve Information
DEPT.FT                 : Depth
GR  .GAPI               : Gamma Ray
~Ascii
0.0   45.5
0.5   46.2
1.0   48.1
`;
            const blob = new Blob([mockLasContent], { type: 'text/plain' });
            const file = new File([blob], `${well.name}.las`);
            onImportWell(file); // Reuse the existing LAS importer!
            
        }, 1000);
    };

    const handleFetchMarket = async () => {
        setLoading(true);
        try {
            const data = await apiService.fetchMarketData();
            setMarketData(data);
            setLastSync(new Date());
        } catch (error) {
            toast({ variant: "destructive", title: "Market Data Error", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    // -- Render Components --

    const renderStatusBadge = (configured) => (
        <Badge variant={configured ? "default" : "outline"} className={configured ? "bg-emerald-600" : "text-slate-500"}>
            {configured ? <><CheckCircle className="w-3 h-3 mr-1"/> Active</> : "Not Configured"}
        </Badge>
    );

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 overflow-hidden">
            {/* Sidebar: Integrations List */}
            <Card className="lg:col-span-3 h-full bg-slate-950 border-slate-800 flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Globe className="w-5 h-5 text-blue-400" /> Data Sources
                    </CardTitle>
                    <CardDescription className="text-slate-400">Manage external connections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 flex-1">
                    {[
                        { id: 'wells', label: 'Well Repositories', icon: Database, active: activeIntegration === 'wells', status: true },
                        { id: 'market', label: 'Market Data', icon: TrendingUp, active: activeIntegration === 'market', status: !!marketData },
                        { id: 'geology', label: 'Geologic Ref.', icon: Layers, active: activeIntegration === 'geology', status: false },
                        { id: 'weather', label: 'Weather/Env.', icon: CloudRain, active: activeIntegration === 'weather', status: false },
                        { id: 'seismic', label: 'Seismic Server', icon: Activity, active: activeIntegration === 'seismic', status: false },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveIntegration(item.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${
                                item.active 
                                    ? 'bg-blue-600/20 text-blue-300 border border-blue-600/50' 
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </div>
                            <div className={`w-2 h-2 rounded-full ${item.status ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                        </button>
                    ))}
                </CardContent>
                <CardFooter className="border-t border-slate-800 pt-4">
                    <div className="w-full space-y-2">
                        <div className="text-xs text-slate-500 flex items-center justify-between">
                            <span>Last Sync</span>
                            <span>{lastSync ? lastSync.toLocaleTimeString() : 'Never'}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-400" disabled={loading}>
                            <RefreshCw className={`w-3 h-3 mr-2 ${loading ? 'animate-spin' : ''}`} /> Sync All
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {/* Main Content Area */}
            <div className="lg:col-span-9 h-full flex flex-col min-h-0 gap-4">
                
                {/* -- WELL REPOSITORIES -- */}
                {activeIntegration === 'wells' && (
                    <div className="h-full flex flex-col gap-4">
                        <Card className="bg-slate-900 border-slate-800 flex-shrink-0">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-white">Public Well Data Import</CardTitle>
                                        <CardDescription>Search and import well headers and logs from government or commercial APIs.</CardDescription>
                                    </div>
                                    {renderStatusBadge(true)}
                                </div>
                            </CardHeader>
                            <CardContent className="flex gap-4 items-end border-b border-slate-800 pb-6">
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium text-slate-300">Source</label>
                                    <Select value={wellSource} onValueChange={setWellSource}>
                                        <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="usgs">USGS (United States Geological Survey)</SelectItem>
                                            <SelectItem value="nist">NIST WebBook</SelectItem>
                                            <SelectItem value="generic_rest">Custom REST API</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 flex-[2]">
                                    <label className="text-sm font-medium text-slate-300">Search Query</label>
                                    <Input 
                                        placeholder="Well Name, API Number, or Field..." 
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="bg-slate-950 border-slate-700"
                                    />
                                </div>
                                <Button onClick={handleSearchWells} disabled={loading} className="bg-blue-600 hover:bg-blue-500">
                                    {loading ? 'Searching...' : <><Search className="w-4 h-4 mr-2"/> Search</>}
                                </Button>
                            </CardContent>
                            {wellSource === 'generic_rest' && (
                                <div className="p-4 bg-slate-950/50 border-b border-slate-800">
                                    <label className="text-xs font-medium text-slate-500 mb-1 block">API Key (Bearer Token)</label>
                                    <div className="flex gap-2">
                                        <Input 
                                            type="password" 
                                            value={apiKeys.generic_rest} 
                                            onChange={e => handleApiKeyChange('generic_rest', e.target.value)}
                                            placeholder="Enter secure token..."
                                            className="bg-slate-900 border-slate-700 h-8 text-sm"
                                        />
                                        <Button size="sm" variant="ghost" className="h-8"><Save className="w-3 h-3"/></Button>
                                    </div>
                                </div>
                            )}
                        </Card>

                        <Card className="flex-1 bg-slate-900 border-slate-800 min-h-0 flex flex-col">
                            <CardHeader className="py-4"><CardTitle className="text-sm text-slate-300">Search Results</CardTitle></CardHeader>
                            <div className="flex-1 overflow-auto">
                                {foundWells.length > 0 ? (
                                    <Table>
                                        <TableHeader className="bg-slate-950 sticky top-0 z-10">
                                            <TableRow className="hover:bg-transparent border-slate-800">
                                                <TableHead className="text-slate-400">Well Name</TableHead>
                                                <TableHead className="text-slate-400">API Number</TableHead>
                                                <TableHead className="text-slate-400">Formation</TableHead>
                                                <TableHead className="text-slate-400">Total Depth</TableHead>
                                                <TableHead className="text-right text-slate-400">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {foundWells.map((well) => (
                                                <TableRow key={well.api} className="border-slate-800 hover:bg-slate-800/50">
                                                    <TableCell className="font-medium text-slate-200">{well.name}</TableCell>
                                                    <TableCell className="text-slate-400 font-mono text-xs">{well.api}</TableCell>
                                                    <TableCell className="text-slate-300">{well.formation}</TableCell>
                                                    <TableCell className="text-slate-300">{well.depth} ft</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button size="sm" variant="outline" className="h-8 border-blue-900/50 text-blue-400 hover:bg-blue-900/20" onClick={() => handleImportWell(well)}>
                                                            <Download className="w-3 h-3 mr-1" /> Import
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8">
                                        <Database className="w-12 h-12 mb-4 opacity-20" />
                                        <p>No wells found. Try adjusting your search terms.</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {/* -- MARKET DATA -- */}
                {activeIntegration === 'market' && (
                    <div className="h-full space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Commodity Prices</CardTitle>
                                    <CardDescription>Real-time market data for reserves estimation.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-amber-900/20 flex items-center justify-center text-amber-500 font-bold">OIL</div>
                                                <div>
                                                    <div className="text-sm text-slate-400">WTI Crude</div>
                                                    <div className="text-xs text-slate-600">NYMEX</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-white">${marketData?.oil.price || '---'}</div>
                                                <div className={`text-xs ${marketData?.oil.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {marketData?.oil.change > 0 ? '+' : ''}{marketData?.oil.change || '-.--'} Today
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-500 font-bold">GAS</div>
                                                <div>
                                                    <div className="text-sm text-slate-400">Henry Hub</div>
                                                    <div className="text-xs text-slate-600">Spot Price</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-white">${marketData?.gas.price || '---'}</div>
                                                <div className={`text-xs ${marketData?.gas.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {marketData?.gas.change > 0 ? '+' : ''}{marketData?.gas.change || '-.--'} Today
                                                </div>
                                            </div>
                                        </div>

                                        <Button onClick={handleFetchMarket} disabled={loading} className="w-full bg-slate-800 hover:bg-slate-700">
                                            {loading ? 'Updating...' : <><RefreshCw className="w-4 h-4 mr-2"/> Update Prices</>}
                                        </Button>
                                        
                                        {marketData && (
                                            <p className="text-[10px] text-center text-slate-600">
                                                Last Updated: {new Date(marketData.oil.updated).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Price Deck Configuration</CardTitle>
                                    <CardDescription>Configure sources for automated updates.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Primary Source</label>
                                        <Select defaultValue="alpha">
                                            <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="alpha">Alpha Vantage (Free Tier)</SelectItem>
                                                <SelectItem value="bloomberg">Bloomberg Terminal (API)</SelectItem>
                                                <SelectItem value="eia">EIA Open Data</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">API Key</label>
                                        <div className="flex gap-2">
                                            <Input 
                                                type="password" 
                                                value={apiKeys.market_alpha}
                                                onChange={e => handleApiKeyChange('market_alpha', e.target.value)}
                                                placeholder="Required for live updates..."
                                                className="bg-slate-950 border-slate-700"
                                            />
                                            <Button variant="secondary"><Key className="w-4 h-4"/></Button>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <Alert className="bg-blue-900/20 border-blue-900/50">
                                            <Clock className="w-4 h-4 text-blue-400" />
                                            <AlertTitle className="text-blue-300">Auto-Sync Enabled</AlertTitle>
                                            <AlertDescription className="text-blue-400/80 text-xs">
                                                Prices will update automatically every 24 hours for Reserves Calculation.
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* -- PLACEHOLDERS -- */}
                {['geology', 'weather', 'seismic'].includes(activeIntegration) && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-xl">
                        <Server className="w-16 h-16 mb-4 opacity-20" />
                        <h3 className="text-lg font-medium text-slate-300">Integration Module</h3>
                        <p className="text-sm max-w-md text-center mt-2">
                            This connector is ready to be configured. Please add an endpoint URL and authentication credentials to start syncing data.
                        </p>
                        <Button variant="outline" className="mt-6 border-slate-700">Configure Connection</Button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default DataSourcesPanel;