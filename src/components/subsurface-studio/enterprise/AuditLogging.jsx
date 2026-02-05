import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Search, Download, Filter } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const AuditLogging = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        // Fetching from the provided audit_logs table
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (data) setLogs(data);
        setLoading(false);
    };

    return (
        <div className="space-y-4 h-full flex flex-col p-1">
            <div className="flex justify-between items-center shrink-0">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" /> System Audit Logs
                </h3>
                <div className="flex gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                        <Input 
                            placeholder="Search events..." 
                            className="pl-8 h-9 bg-slate-950 border-slate-800 text-xs"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2"/> Filter</Button>
                    <Button variant="outline" size="sm" className="h-9"><Download className="w-4 h-4 mr-2"/> Export CSV</Button>
                </div>
            </div>

            <Card className="bg-slate-950 border-slate-800 flex-grow overflow-hidden flex flex-col">
                <div className="overflow-y-auto flex-grow">
                    <Table>
                        <TableHeader className="sticky top-0 bg-slate-950 z-10">
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-xs w-[180px]">Timestamp</TableHead>
                                <TableHead className="text-xs w-[150px]">Actor ID</TableHead>
                                <TableHead className="text-xs">Action</TableHead>
                                <TableHead className="text-xs">Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={4} className="text-center py-10 text-slate-500">Loading audit trail...</TableCell></TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="text-center py-10 text-slate-500">No logs found.</TableCell></TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id} className="border-slate-800 hover:bg-slate-900/50 text-xs">
                                        <TableCell className="font-mono text-slate-400">
                                            {new Date(log.created_at).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="font-mono text-slate-500 truncate max-w-[150px]" title={log.actor_id}>
                                            {log.actor_id}
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-200">
                                            {log.action}
                                        </TableCell>
                                        <TableCell className="text-slate-400 truncate max-w-[300px]">
                                            {JSON.stringify(log.details)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
};

export default AuditLogging;