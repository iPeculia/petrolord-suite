import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AuditTrailVelocity = () => {
  const logs = [
    { id: 1, time: '2024-03-15 14:35:22', user: 'Sarah Chen', action: 'Model Save', details: 'Saved version v2.1 with calibrated checkshots', ip: '192.168.1.45' },
    { id: 2, time: '2024-03-15 14:30:10', user: 'Sarah Chen', action: 'Parameter Update', details: 'Changed Layer 3 V0 from 2400 to 2450 m/s', ip: '192.168.1.45' },
    { id: 3, time: '2024-03-15 11:15:00', user: 'Mike Ross', action: 'Data Import', details: 'Imported Checkshots_Well04.csv', ip: '10.0.0.12' },
    { id: 4, time: '2024-03-14 16:20:55', user: 'System', action: 'Auto-Calculation', details: 'Scheduled background run completed', ip: 'Server-01' },
    { id: 5, time: '2024-03-14 09:00:12', user: 'Admin', action: 'Permission Change', details: 'Granted Write Access to Mike Ross', ip: '192.168.1.5' },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-400"/> Audit Trail & Compliance
        </CardTitle>
        <div className="flex gap-2">
            <div className="relative w-48">
                <Search className="absolute left-2 top-1.5 h-3 w-3 text-slate-500" />
                <Input placeholder="Search logs..." className="h-7 pl-7 bg-slate-950 border-slate-700 text-xs"/>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs border-slate-700 text-slate-300"><Download className="w-3 h-3 mr-1"/> Export</Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
            <table className="w-full text-xs text-left text-slate-400">
                <thead className="bg-slate-950 text-slate-300 uppercase sticky top-0 font-semibold">
                    <tr>
                        <th className="px-4 py-2 w-40">Timestamp</th>
                        <th className="px-4 py-2 w-32">User</th>
                        <th className="px-4 py-2 w-32">Action</th>
                        <th className="px-4 py-2">Details</th>
                        <th className="px-4 py-2 w-24 text-right">IP Addr</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {logs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-800/50">
                            <td className="px-4 py-2 font-mono text-[10px]">{log.time}</td>
                            <td className="px-4 py-2 text-slate-200">{log.user}</td>
                            <td className="px-4 py-2"><span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">{log.action}</span></td>
                            <td className="px-4 py-2">{log.details}</td>
                            <td className="px-4 py-2 text-right font-mono text-[10px] text-slate-500">{log.ip}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AuditTrailVelocity;