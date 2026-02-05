import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, FileText } from 'lucide-react';

const AuditLogging = () => (
    <div className="h-full p-1 space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-slate-400" /> Global Audit Trail
            </h3>
            <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                <Input placeholder="Search user actions..." className="pl-8 bg-slate-900 border-slate-800 h-9 text-xs" />
            </div>
        </div>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-0 divide-y divide-slate-800">
                {[
                    { time: '2025-11-25 14:32:01', user: 'jane.doe@globalenergy.com', action: 'DELETE_PROJECT', resource: 'Proj-Alpha-2', ip: '192.168.1.42' },
                    { time: '2025-11-25 14:30:15', user: 'sysadmin', action: 'UPDATE_POLICY', resource: 'Retention-Policy-A', ip: '10.0.0.5' },
                    { time: '2025-11-25 14:28:44', user: 'bob.smith@northsea.com', action: 'EXPORT_DATA', resource: 'Well-Set-B', ip: '172.16.0.8' },
                    { time: '2025-11-25 14:15:22', user: 'jane.doe@globalenergy.com', action: 'LOGIN_SUCCESS', resource: 'Auth-Service', ip: '192.168.1.42' },
                ].map((log, i) => (
                    <div key={i} className="p-3 flex items-center justify-between text-xs hover:bg-slate-900/50">
                        <div className="w-32 font-mono text-slate-500">{log.time}</div>
                        <div className="w-48 text-cyan-400 truncate">{log.user}</div>
                        <div className="w-32 font-bold text-slate-300">{log.action}</div>
                        <div className="flex-grow text-slate-400">{log.resource}</div>
                        <div className="w-24 font-mono text-slate-600 text-right">{log.ip}</div>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
);

export default AuditLogging;