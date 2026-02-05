import React, { useState, useEffect } from 'react';
import { usePetroleumEconomics } from '../contexts/PetroleumEconomicsContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Share2, RefreshCw, Send, History, DollarSign, PieChart, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const IntegrationTab = () => {
  const { 
    activeScenario, 
    sendToFDP, 
    sendToAFE, 
    fdpSnapshots, 
    afeBudgets, 
    fetchFDPSnapshots,
    fetchAFEBudgets,
    currentModel,
    saving 
  } = usePetroleumEconomics();

  const [activeTab, setActiveTab] = useState('fdp');

  // Refresh lists on load
  useEffect(() => {
      if (currentModel) {
          fetchFDPSnapshots(currentModel.id);
          fetchAFEBudgets(currentModel.id);
      }
  }, [currentModel]);

  if (!activeScenario) {
      return (
          <div className="flex h-full items-center justify-center p-8 bg-slate-950">
              <div className="text-center space-y-4">
                  <div className="bg-slate-900 p-4 rounded-full w-fit mx-auto">
                      <Share2 className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300">No Scenario Selected</h3>
                  <p className="text-slate-500">Please load a scenario to enable integrations.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full space-y-6 max-w-6xl mx-auto w-full pb-10">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-blue-400" />
                    Connect & Integrate
                </h2>
                <p className="text-sm text-slate-400 mt-1">Push approved economic models to downstream planning and cost control systems.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => { fetchFDPSnapshots(currentModel.id); fetchAFEBudgets(currentModel.id); }} className="border-slate-700 bg-slate-800 hover:bg-slate-700">
                    <RefreshCw className="w-4 h-4 mr-2" /> Sync Status
                </Button>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="bg-slate-900 border border-slate-800 w-fit">
                <TabsTrigger value="fdp" className="gap-2">
                    <PieChart className="w-4 h-4" /> FDP Accelerator
                </TabsTrigger>
                <TabsTrigger value="afe" className="gap-2">
                    <DollarSign className="w-4 h-4" /> AFE & Cost Control
                </TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-4">
                {/* --- FDP Integration --- */}
                <TabsContent value="fdp" className="space-y-6 m-0">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-base text-slate-200">Field Development Plan Integration</CardTitle>
                            <CardDescription>Send economic snapshot including production profiles, cashflow models, and KPIs to the FDP Accelerator for final reporting.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                                <div>
                                    <div className="font-medium text-slate-200">Ready to Send: {activeScenario.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">Includes all assumption sets, yearly profiles, and sensitivity results.</div>
                                </div>
                                <Button onClick={() => sendToFDP(activeScenario.id)} disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                                    {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                    Send Snapshot
                                </Button>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                                    <History className="w-4 h-4" /> Transmission History
                                </h4>
                                <div className="rounded-md border border-slate-800 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-950">
                                            <TableRow className="border-slate-800 hover:bg-transparent">
                                                <TableHead className="text-slate-400">Date Sent</TableHead>
                                                <TableHead className="text-slate-400">Scenario</TableHead>
                                                <TableHead className="text-slate-400">Status</TableHead>
                                                <TableHead className="text-right text-slate-400">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {fdpSnapshots.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center text-slate-500 italic">
                                                        No snapshots sent yet.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                fdpSnapshots.map((snap) => (
                                                    <TableRow key={snap.id} className="border-slate-800 hover:bg-slate-800/50">
                                                        <TableCell className="text-slate-300">{format(new Date(snap.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
                                                        <TableCell className="text-slate-300">{snap.snapshot_data?.metadata?.scenario || 'Unknown'}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className={cn("capitalize", 
                                                                snap.status === 'received' ? "text-emerald-400 border-emerald-900 bg-emerald-950/30" : 
                                                                "text-blue-400 border-blue-900 bg-blue-950/30"
                                                            )}>
                                                                {snap.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm" className="h-7 text-xs hover:text-white">View Details</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- AFE Integration --- */}
                <TabsContent value="afe" className="space-y-6 m-0">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-base text-slate-200">AFE & Cost Control Sync</CardTitle>
                            <CardDescription>Generate preliminary budget line items from the economic CAPEX profile to initialize Authorization for Expenditure (AFE) workflows.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                                <div>
                                    <div className="font-medium text-slate-200">Generate Budget: {activeScenario.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">Extracts CAPEX items by year and category. Existing drafts for this scenario will be overwritten.</div>
                                </div>
                                <Button onClick={() => sendToAFE(activeScenario.id)} disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white">
                                    {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                    Push to AFE
                                </Button>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" /> Active Budget Items
                                </h4>
                                <div className="rounded-md border border-slate-800 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-950">
                                            <TableRow className="border-slate-800 hover:bg-transparent">
                                                <TableHead className="text-slate-400">Year</TableHead>
                                                <TableHead className="text-slate-400">Category</TableHead>
                                                <TableHead className="text-right text-slate-400">Amount ($MM)</TableHead>
                                                <TableHead className="text-center text-slate-400">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {afeBudgets.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center text-slate-500 italic">
                                                        No budget items synced for this model.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                afeBudgets.map((item) => (
                                                    <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50">
                                                        <TableCell className="text-slate-300 font-mono">{item.year}</TableCell>
                                                        <TableCell className="text-slate-300">{item.category}</TableCell>
                                                        <TableCell className="text-right text-emerald-400 font-mono">{(item.amount / 1000000).toFixed(2)}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="outline" className={cn("capitalize text-[10px]", 
                                                                item.status === 'approved' ? "text-emerald-400 border-emerald-900 bg-emerald-950/30" : 
                                                                "text-slate-400 border-slate-700 bg-slate-800/50"
                                                            )}>
                                                                {item.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </div>
        </Tabs>
    </div>
  );
};

export default IntegrationTab;