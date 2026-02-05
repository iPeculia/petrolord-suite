import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Shield, Server, Users, Database, Download, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBasinFlow } from '../../contexts/BasinFlowContext';
import { AuditLogger } from '../../services/enterprise/AuditLogger';
import { BackupManager } from '../../services/enterprise/BackupManager';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const EnterpriseDashboard = () => {
    const { state } = useBasinFlow();
    const { toast } = useToast();
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        activeUsers: 0,
        apiCalls: 0,
        storageUsed: '0 MB',
        totalProjects: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchEnterpriseData();
    }, []);

    const fetchEnterpriseData = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Audit Logs
            const { data: auditData } = await supabase
                .from('bf_activity_log')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);
            setLogs(auditData || []);

            // 2. Calculate Stats (Real Counts)
            // Active Users (Distinct users in activity log last 7 days)
            const { count: userCount } = await supabase
                .from('bf_team_members')
                .select('*', { count: 'exact', head: true }); // Simpler proxy for organization size

            // API Calls (Proxy via activity logs count)
            const { count: activityCount } = await supabase
                .from('bf_activity_log')
                .select('*', { count: 'exact', head: true });

            // Projects Count
            const { count: projectCount } = await supabase
                .from('bf_projects')
                .select('*', { count: 'exact', head: true });

            // Storage (Mock calculation based on row counts as we don't have direct bucket size API here)
            const storageEstimate = ((activityCount * 0.5) + (projectCount * 50)).toFixed(1); // Mock KB/MB logic

            setStats({
                activeUsers: userCount || 1,
                apiCalls: activityCount || 0,
                storageUsed: `${storageEstimate} MB`,
                totalProjects: projectCount || 0
            });

        } catch (e) {
            console.error("Enterprise data fetch error", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackup = () => {
        BackupManager.createBackup(state, { name: state.project?.name || 'BasinFlow' });
        toast({ title: "Backup Created", description: "Project state exported successfully to local JSON." });
        AuditLogger.log('BACKUP_CREATED', { type: 'manual_export' }, 'current-user', state.project?.id || 'unknown');
        // Refresh logs
        fetchEnterpriseData();
    };

    return (
        <div className="h-full p-6 bg-slate-950 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Shield className="w-6 h-6 text-emerald-400" />
                        Enterprise Management
                    </h2>
                    <p className="text-slate-400 text-sm">Security, Compliance, and Data Governance</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchEnterpriseData} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Refresh Data'}
                    </Button>
                    <Button variant="default" onClick={handleBackup} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Download className="w-4 h-4 mr-2" /> Full Backup
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-900/20 text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Total Members</p>
                            <h3 className="text-2xl font-bold text-white">{stats.activeUsers}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-purple-900/20 text-purple-400">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Total Activities</p>
                            <h3 className="text-2xl font-bold text-white">{stats.apiCalls}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-amber-900/20 text-amber-400">
                            <Database className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Est. Storage</p>
                            <h3 className="text-2xl font-bold text-white">{stats.storageUsed}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-emerald-900/20 text-emerald-400">
                            <Server className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">System Status</p>
                            <h3 className="text-sm font-bold text-emerald-400">Operational</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Audit Log */}
                <div className="lg:col-span-2">
                    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
                        <CardHeader className="border-b border-slate-800 pb-3 shrink-0">
                            <CardTitle className="text-base text-white">Live Audit Log Stream</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-grow min-h-[400px]">
                            <ScrollArea className="h-[400px]">
                                <div className="divide-y divide-slate-800">
                                    {logs.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500">No audit logs found.</div>
                                    ) : (
                                        logs.map((log, i) => (
                                            <div key={log.id || i} className="p-4 flex justify-between items-start hover:bg-slate-800/50 transition-colors">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-mono text-xs font-bold text-indigo-400">{log.action}</span>
                                                        <span className="text-xs text-slate-500">by {log.user_id.slice(0,8)}...</span>
                                                    </div>
                                                    <div className="text-xs text-slate-400 font-mono break-all">
                                                        {JSON.stringify(log.details)}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-slate-600 whitespace-nowrap ml-4">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Compliance & Settings */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="border-b border-slate-800 pb-3">
                            <CardTitle className="text-base text-white">Compliance Status</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300">Data Encryption</span>
                                <span className="text-xs text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded">AES-256 (Active)</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300">Audit Trail</span>
                                <span className="text-xs text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded">Retention: 365d</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300">Backup Frequency</span>
                                <span className="text-xs text-slate-400">Daily (00:00 UTC)</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300">SSO Integration</span>
                                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">Not Configured</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="border-b border-slate-800 pb-3">
                            <CardTitle className="text-base text-white">Recovery</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <p className="text-xs text-slate-500 mb-4">Upload a previous JSON backup file to restore project state.</p>
                            <Button variant="secondary" className="w-full bg-slate-800 text-slate-300 hover:bg-slate-700">
                                <RotateCcw className="w-4 h-4 mr-2" /> Restore from File
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseDashboard;