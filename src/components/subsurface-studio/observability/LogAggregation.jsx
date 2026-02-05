import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, FileText } from 'lucide-react';

const LogAggregation = () => {
    const logs = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        level: i % 5 === 0 ? 'ERROR' : i % 3 === 0 ? 'WARN' : 'INFO',
        service: i % 2 === 0 ? 'api-gateway' : 'auth-service',
        message: i % 5 === 0 ? 'Connection timeout waiting for database pool' : 'Request processed successfully in 45ms'
    }));

    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-slate-400" /> Log Explorer
                </h3>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <Input placeholder="Search logs (Lucene syntax)..." className="pl-8 bg-slate-900 border-slate-800 h-9 text-xs" />
                </div>
            </div>

            <Card className="bg-slate-950 border-slate-800 flex-grow">
                <CardContent className="p-0">
                    <ScrollArea className="h-[500px]">
                        <div className="divide-y divide-slate-900">
                            {logs.map(log => (
                                <div key={log.id} className="p-2 hover:bg-slate-900/50 font-mono text-[10px] flex gap-4">
                                    <span className="text-slate-500 whitespace-nowrap">{log.timestamp}</span>
                                    <span className={`w-12 font-bold ${log.level === 'ERROR' ? 'text-red-500' : log.level === 'WARN' ? 'text-yellow-500' : 'text-blue-500'}`}>{log.level}</span>
                                    <span className="text-purple-400 w-24 whitespace-nowrap">{log.service}</span>
                                    <span className="text-slate-300">{log.message}</span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export default LogAggregation;