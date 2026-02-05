import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ArrowRightLeft, Clock, AlertCircle } from 'lucide-react';

const DataSyncManager = () => {
  const syncHistory = [
    { id: 1, type: 'Pull', source: 'Log Facies', item: 'Well-04 Facies', time: '2m ago', status: 'Success' },
    { id: 2, type: 'Push', source: 'EarthModel', item: 'Top Reservoir Grid', time: '15m ago', status: 'Success' },
    { id: 3, type: 'Push', source: 'Project Mgmt', item: 'QC Tasks (3)', time: '1h ago', status: 'Failed' },
    { id: 4, type: 'Pull', source: 'Log Facies', item: 'Well-09 Facies', time: '2h ago', status: 'Success' },
  ];

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4" /> Sync Manager
            </h3>
            <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700">
                <RefreshCw className="w-3 h-3 mr-2" /> Sync All Now
            </Button>
        </div>

        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="py-3 border-b border-slate-800">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xs font-medium text-slate-400">Recent Activity</CardTitle>
                    <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500">Auto-Sync On</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[200px]">
                    <div className="divide-y divide-slate-800">
                        {syncHistory.map((item) => (
                            <div key={item.id} className="p-3 flex items-center justify-between hover:bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-full ${
                                        item.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                        {item.type === 'Push' ? <ArrowRightLeft className="w-3 h-3 rotate-45" /> : <ArrowRightLeft className="w-3 h-3 -rotate-45" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-300">{item.type}: {item.item}</p>
                                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <span className="font-semibold">{item.source}</span> • {item.time}
                                        </p>
                                    </div>
                                </div>
                                {item.status === 'Failed' && (
                                    <div className="flex items-center gap-1 text-red-400 text-[10px]">
                                        <AlertCircle className="w-3 h-3" /> Retry
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    </div>
  );
};

export default DataSyncManager;