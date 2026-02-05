import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Search, Filter, FileJson } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const EditHistoryAuditTrail = () => {
  const logs = [
    { id: 1, time: '14:35:22', date: 'Today', user: 'Sarah Chen', action: 'UPDATE', target: 'Layer 3 (Reservoir)', details: 'V0 changed: 2400 → 2450 m/s', type: 'param' },
    { id: 2, time: '14:30:10', date: 'Today', user: 'Sarah Chen', action: 'IMPORT', target: 'Well-04', details: 'Imported checkshot survey CSV', type: 'data' },
    { id: 3, time: '11:15:00', date: 'Today', user: 'Mike Ross', action: 'CREATE', target: 'Scenario B', details: 'Created branch from v2.0', type: 'system' },
    { id: 4, time: '16:20:55', date: 'Yesterday', user: 'System', action: 'AUTO', target: 'QC Checks', details: 'Background validation passed', type: 'system' },
    { id: 5, time: '09:00:12', date: 'Yesterday', user: 'Admin', action: 'GRANT', target: 'Permissions', details: 'Mike Ross added as Editor', type: 'security' },
  ];

  const getTypeColor = (type) => {
      switch(type) {
          case 'param': return 'text-blue-400 border-blue-900 bg-blue-900/20';
          case 'data': return 'text-emerald-400 border-emerald-900 bg-emerald-900/20';
          case 'security': return 'text-red-400 border-red-900 bg-red-900/20';
          default: return 'text-slate-400 border-slate-800 bg-slate-800';
      }
  }

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400"/> Detailed Edit Log
        </CardTitle>
        <div className="flex gap-2">
            <div className="relative w-40">
                <Search className="absolute left-2 top-1.5 h-3 w-3 text-slate-500" />
                <Input placeholder="Filter..." className="h-7 pl-7 bg-slate-950 border-slate-700 text-xs"/>
            </div>
            <Button variant="outline" size="icon" className="h-7 w-7 border-slate-700 text-slate-400"><Filter className="w-3 h-3"/></Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
            <table className="w-full text-xs text-left text-slate-400">
                <thead className="bg-slate-950 text-slate-300 uppercase sticky top-0 z-10 font-semibold">
                    <tr>
                        <th className="px-4 py-2 w-32">Time</th>
                        <th className="px-4 py-2 w-32">User</th>
                        <th className="px-4 py-2 w-24">Action</th>
                        <th className="px-4 py-2 w-40">Target</th>
                        <th className="px-4 py-2">Change Details</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {logs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-800/50 group">
                            <td className="px-4 py-2 font-mono text-[10px]">
                                <div className="text-slate-300">{log.time}</div>
                                <div className="text-slate-600">{log.date}</div>
                            </td>
                            <td className="px-4 py-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[9px] text-slate-300 font-bold">
                                        {log.user.charAt(0)}
                                    </div>
                                    {log.user}
                                </div>
                            </td>
                            <td className="px-4 py-2">
                                <Badge variant="outline" className={`text-[9px] border h-4 px-1 ${getTypeColor(log.type)}`}>
                                    {log.action}
                                </Badge>
                            </td>
                            <td className="px-4 py-2 font-medium text-slate-300">{log.target}</td>
                            <td className="px-4 py-2 text-slate-400">
                                {log.details}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EditHistoryAuditTrail;