import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, ArrowRightLeft, Check } from 'lucide-react';
import { earthModelIntegrationService } from '@/services/integrations/earthModelIntegrationService';
import { useToast } from '@/components/ui/use-toast';

const LogFaciesIntegration = () => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState([]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await earthModelIntegrationService.syncLogFacies();
      setSyncedData(result.items);
      toast({ title: "Sync Complete", description: "Facies data imported successfully." });
    } catch (e) {
      toast({ title: "Sync Failed", description: "Could not connect to Log Facies app.", variant: "destructive" });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="h-full p-6 flex flex-col gap-6 bg-slate-950">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-white">Log Facies Integration</CardTitle>
                <CardDescription>Import interpreted facies and well logs</CardDescription>
              </div>
            </div>
            <Button onClick={handleSync} disabled={isSyncing} className="bg-blue-600 hover:bg-blue-500">
              <ArrowRightLeft className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Data'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-800 bg-slate-950/50">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-900/50">
                  <TableHead className="text-slate-400">Well Name</TableHead>
                  <TableHead className="text-slate-400">Imported Logs</TableHead>
                  <TableHead className="text-slate-400">Facies Model</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-right text-slate-400">Last Sync</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syncedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No data synced yet. Click "Sync Data" to import from Log Facies App.
                    </TableCell>
                  </TableRow>
                ) : (
                  syncedData.map((item) => (
                    <TableRow key={item.id} className="border-slate-800 hover:bg-slate-900/50">
                      <TableCell className="font-medium text-slate-200">{item.well}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {item.logs.map(log => (
                            <Badge key={log} variant="secondary" className="text-[10px] bg-slate-800 text-slate-300">{log}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">{item.facies_model}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex w-fit items-center gap-1">
                          <Check className="w-3 h-3" /> Synced
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-slate-500 text-xs">
                        {new Date(item.synced_at).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Visualization Placeholder */}
      <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
        <Card className="bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-slate-300">Log Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-slate-950/30 m-4 rounded border border-slate-800 border-dashed text-slate-500 text-sm">
            Select a well to preview logs
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-slate-300">Facies Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-slate-950/30 m-4 rounded border border-slate-800 border-dashed text-slate-500 text-sm">
            Sync data to view statistics
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogFaciesIntegration;