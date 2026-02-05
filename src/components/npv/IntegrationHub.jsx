import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Database, Link, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const IntegrationHub = ({ onImport }) => {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(null);

  const sources = [
    { id: 'mbal', name: 'Material Balance', type: 'Reservoir', status: 'connected', lastSync: '10 mins ago', data: 'Production Profiles' },
    { id: 'dca', name: 'Decline Curve Analysis', type: 'Reservoir', status: 'connected', lastSync: '2 hours ago', data: 'Production Forecasts' },
    { id: 'afe', name: 'AFE Cost Control', type: 'Economics', status: 'connected', lastSync: '1 hour ago', data: 'CAPEX / OPEX' },
    { id: 'pm', name: 'Project Management Pro', type: 'Planning', status: 'disconnected', lastSync: 'Never', data: 'Schedule / Risk' },
  ];

  const handleSync = (id) => {
      setSyncing(id);
      setTimeout(() => {
          setSyncing(null);
          toast({ title: "Sync Complete", description: `Data imported successfully from ${sources.find(s => s.id === id).name}.` });
          // Mock data import
          if(onImport) onImport(id);
      }, 1500);
  };

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map(source => (
                <Card key={source.id} className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${source.status === 'connected' ? 'bg-blue-900/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                                <Database className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-white">{source.name}</h4>
                                <p className="text-xs text-slate-400">{source.type} • {source.data}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {source.status === 'connected' ? (
                                <Badge variant="outline" className="border-green-500 text-green-500 bg-green-500/10 text-[10px]">Live</Badge>
                            ) : (
                                <Badge variant="outline" className="border-slate-600 text-slate-500 text-[10px]">Offline</Badge>
                            )}
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                                onClick={() => handleSync(source.id)}
                                disabled={syncing === source.id}
                            >
                                <RefreshCw className={`w-4 h-4 ${syncing === source.id ? 'animate-spin text-blue-400' : ''}`} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
        
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-300">Data Lineage & Audit</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-slate-800"><TableHead className="text-xs">Source</TableHead><TableHead className="text-xs">Data Type</TableHead><TableHead className="text-xs">Timestamp</TableHead><TableHead className="text-xs text-right">Status</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="border-b-slate-800 hover:bg-slate-800/50">
                            <TableCell className="text-xs font-medium">Material Balance</TableCell>
                            <TableCell className="text-xs text-slate-400">Oil Profile Update</TableCell>
                            <TableCell className="text-xs text-slate-500">Today, 10:42 AM</TableCell>
                            <TableCell className="text-right"><CheckCircle className="w-3 h-3 text-green-500 inline" /></TableCell>
                        </TableRow>
                        <TableRow className="border-b-slate-800 hover:bg-slate-800/50">
                            <TableCell className="text-xs font-medium">AFE Manager</TableCell>
                            <TableCell className="text-xs text-slate-400">CAPEX Revision (Rig)</TableCell>
                            <TableCell className="text-xs text-slate-500">Today, 09:15 AM</TableCell>
                            <TableCell className="text-right"><CheckCircle className="w-3 h-3 text-green-500 inline" /></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
};

export default IntegrationHub;