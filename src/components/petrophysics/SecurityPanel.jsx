import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { 
    Shield, Lock, Unlock, Eye, EyeOff, FileText, Activity, 
    Globe, Smartphone, Key, History, ShieldAlert, CheckCircle, 
    AlertTriangle, RefreshCw, FileCheck, Server, UserCheck
} from 'lucide-react';
import { 
    generateEncryptionKey, exportKey, maskWellData, 
    getClassificatonBadgeColor, generateMockAuditLogs, complianceChecklist 
} from '@/utils/securityUtils';

const SecurityPanel = ({ petroState }) => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    
    // Security State
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [encryptionKey, setEncryptionKey] = useState(null);
    const [classification, setClassification] = useState('internal');
    const [maskingLevel, setMaskingLevel] = useState('none');
    const [auditLogs, setAuditLogs] = useState([]);
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState(30);
    
    useEffect(() => {
        setAuditLogs(generateMockAuditLogs(15));
    }, []);

    // -- Handlers --

    const handleEncryptProject = async () => {
        try {
            const key = await generateEncryptionKey();
            const exported = await exportKey(key);
            setEncryptionKey(exported);
            setIsEncrypted(true);
            toast({
                title: "Project Encrypted",
                description: "AES-256 encryption applied to all sensitive well data.",
                className: "bg-emerald-900 border-emerald-800 text-white"
            });
        } catch (err) {
            toast({ variant: "destructive", title: "Encryption Failed", description: err.message });
        }
    };

    const handleDecryptProject = () => {
        setIsEncrypted(false);
        setEncryptionKey(null);
        toast({ title: "Project Decrypted", description: "Data is now accessible in plain text." });
    };

    const handleExportAudit = () => {
        const content = "Timestamp,Actor,Action,IP,Status\n" + 
            auditLogs.map(l => `${l.timestamp},${l.actor},${l.action},${l.ip},${l.status}`).join("\n");
        
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast({ title: "Audit Log Exported", description: "CSV file downloaded successfully." });
    };

    const renderOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-500" /> Security Score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-white">92<span className="text-lg text-slate-500 font-normal">/100</span></div>
                    <div className="mt-2 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[92%]" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Excellent standing. MFA enabled.</p>
                </CardContent>
            </Card>
            
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-500" /> Encryption Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                        {isEncrypted ? 'AES-256' : 'Unencrypted'}
                        {isEncrypted && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        {isEncrypted ? 'Data at rest is secure.' : 'Recommendation: Enable encryption.'}
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-purple-500" /> Threat Monitor
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">0 Threats</div>
                    <p className="text-xs text-slate-500 mt-2">Last scan: 2 minutes ago</p>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6 p-4 overflow-hidden">
            {/* Sidebar Navigation */}
            <Card className="lg:w-64 flex-shrink-0 bg-slate-950 border-slate-800 h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-blue-400" /> Security
                    </CardTitle>
                    <CardDescription>Compliance Center</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 flex-1">
                    {[
                        { id: 'overview', label: 'Overview', icon: Activity },
                        { id: 'encryption', label: 'Data Encryption', icon: Lock },
                        { id: 'access', label: 'Access Control', icon: Key },
                        { id: 'privacy', label: 'Data Privacy', icon: EyeOff },
                        { id: 'compliance', label: 'Compliance', icon: FileCheck },
                        { id: 'audit', label: 'Audit Logs', icon: History },
                    ].map(item => (
                        <Button
                            key={item.id}
                            variant={activeTab === item.id ? "secondary" : "ghost"}
                            className={`w-full justify-start ${activeTab === item.id ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <item.icon className="w-4 h-4 mr-2" /> {item.label}
                        </Button>
                    ))}
                </CardContent>
                <CardFooter className="border-t border-slate-800 pt-4">
                    <div className="text-xs text-slate-500 w-full text-center">
                        Build 17.0.4 (Secure)
                    </div>
                </CardFooter>
            </Card>

            {/* Main Content */}
            <div className="flex-1 h-full min-w-0 overflow-y-auto scrollbar-hide">
                
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {renderOverview()}
                        
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Recent Security Events</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-800 hover:bg-transparent">
                                            <TableHead className="text-slate-400">Event</TableHead>
                                            <TableHead className="text-slate-400">Severity</TableHead>
                                            <TableHead className="text-slate-400 text-right">Time</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { event: "Failed Login Attempt (IP: 45.2.1.9)", severity: "Medium", time: "10m ago" },
                                            { event: "Project Exported: Wolfcamp A", severity: "Low", time: "1h ago" },
                                            { event: "Encryption Keys Rotated", severity: "Low", time: "2d ago" },
                                        ].map((e, i) => (
                                            <TableRow key={i} className="border-slate-800">
                                                <TableCell className="text-slate-300">{e.event}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={e.severity === 'Medium' ? 'text-amber-500 border-amber-500/50' : 'text-blue-500 border-blue-500/50'}>
                                                        {e.severity}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-slate-500">{e.time}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'encryption' && (
                    <div className="max-w-3xl space-y-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-blue-400" /> Data Encryption (AES-256)
                                </CardTitle>
                                <CardDescription>
                                    Manage end-to-end encryption for project data at rest.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                                    <div className="space-y-1">
                                        <div className="font-medium text-white">Project Encryption</div>
                                        <div className="text-sm text-slate-400">
                                            {isEncrypted 
                                                ? "Data is currently encrypted. Keys are managed securely." 
                                                : "Data is stored in plain text. Enable for compliance."}
                                        </div>
                                    </div>
                                    {isEncrypted ? (
                                        <Button variant="destructive" onClick={handleDecryptProject}>Decrypt</Button>
                                    ) : (
                                        <Button onClick={handleEncryptProject} className="bg-emerald-600 hover:bg-emerald-500">Encrypt Now</Button>
                                    )}
                                </div>

                                {isEncrypted && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Encryption Key (JWK)</label>
                                            <div className="flex gap-2">
                                                <Input readOnly value={encryptionKey || ''} className="bg-slate-950 border-slate-700 font-mono text-xs" />
                                                <Button variant="outline" onClick={() => {navigator.clipboard.writeText(encryptionKey); toast({title:"Copied"})}}>Copy</Button>
                                            </div>
                                            <p className="text-[10px] text-slate-500">
                                                Store this key securely. If lost, data cannot be recovered.
                                            </p>
                                        </div>
                                        
                                        <div className="pt-4 border-t border-slate-800">
                                            <h4 className="text-sm font-medium text-white mb-2">Key Management</h4>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="border-slate-700">Rotate Keys</Button>
                                                <Button variant="outline" size="sm" className="border-slate-700">Backup Keystore</Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'access' && (
                    <div className="max-w-3xl space-y-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Authentication & Sessions</CardTitle>
                                <CardDescription>Configure 2FA and session timeouts.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-medium text-white">Two-Factor Authentication (2FA)</div>
                                        <div className="text-xs text-slate-400">Require TOTP or SMS code for login.</div>
                                    </div>
                                    <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} />
                                </div>

                                {mfaEnabled && (
                                    <Alert className="bg-blue-900/20 border-blue-800 text-blue-200">
                                        <Smartphone className="w-4 h-4" />
                                        <AlertTitle>MFA Active</AlertTitle>
                                        <AlertDescription className="text-xs">
                                            Users will be prompted to set up their authenticator app on next login via Supabase Auth.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-300">Session Timeout (Minutes)</label>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="range" min="5" max="120" step="5" 
                                            value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}
                                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                        <span className="w-12 text-center font-mono text-slate-300">{sessionTimeout}m</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 pt-2">
                                    <label className="text-sm font-medium text-slate-300">Concurrent Sessions</label>
                                    <Select defaultValue="3">
                                        <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Strict (1 Device)</SelectItem>
                                            <SelectItem value="3">Standard (3 Devices)</SelectItem>
                                            <SelectItem value="unlimited">Unlimited</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Network Security</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">IP Whitelist (CIDR)</label>
                                    <Input placeholder="e.g. 192.168.1.0/24" className="bg-slate-950 border-slate-700 font-mono" />
                                    <p className="text-[10px] text-slate-500">Leave empty to allow all IPs.</p>
                                </div>
                                <Button variant="secondary" size="sm">Save Network Rules</Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'privacy' && (
                    <div className="max-w-4xl space-y-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Data Classification & Masking</CardTitle>
                                <CardDescription>Control data visibility based on sensitivity levels.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Project Classification</label>
                                            <Select value={classification} onValueChange={setClassification}>
                                                <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="public">Public (Open Data)</SelectItem>
                                                    <SelectItem value="internal">Internal (Company Only)</SelectItem>
                                                    <SelectItem value="confidential">Confidential (Team Only)</SelectItem>
                                                    <SelectItem value="restricted">Restricted (Legal Hold)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Masking Preview Mode</label>
                                            <Select value={maskingLevel} onValueChange={setMaskingLevel}>
                                                <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">No Masking (Clear)</SelectItem>
                                                    <SelectItem value="internal">Internal Obfuscation</SelectItem>
                                                    <SelectItem value="restricted">Full Anonymization</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                                        <div className="text-xs font-medium text-slate-500 uppercase mb-2">Live Preview</div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-400">Well Name:</span>
                                                <span className="text-sm text-white font-mono">
                                                    {maskingLevel === 'none' ? 'Permian Scout 1' : maskWellData({name:'Permian Scout 1', api:'42-301-34567'}, maskingLevel).name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-400">API Number:</span>
                                                <span className="text-sm text-white font-mono">
                                                    {maskingLevel === 'none' ? '42-301-34567' : maskWellData({name:'Permian Scout 1', api:'42-301-34567'}, maskingLevel).api}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-400">Operator:</span>
                                                <span className="text-sm text-white font-mono">
                                                    {maskingLevel === 'none' ? 'Chevron Corp.' : maskWellData({operator:'Chevron Corp.'}, maskingLevel).operator}
                                                </span>
                                            </div>
                                            <div className="mt-4 pt-2 border-t border-slate-800 flex justify-between items-center">
                                                <span className="text-xs text-slate-500">Effective Label:</span>
                                                <Badge variant="outline" className={getClassificatonBadgeColor(classification)}>
                                                    {classification.toUpperCase()}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-white">Audit Trail</h3>
                            <Button variant="outline" onClick={handleExportAudit} className="border-slate-700">
                                <FileText className="w-4 h-4 mr-2" /> Export CSV
                            </Button>
                        </div>
                        <Card className="bg-slate-900 border-slate-800">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-800 hover:bg-transparent">
                                        <TableHead className="text-slate-400">Timestamp</TableHead>
                                        <TableHead className="text-slate-400">Actor</TableHead>
                                        <TableHead className="text-slate-400">Action</TableHead>
                                        <TableHead className="text-slate-400">IP Address</TableHead>
                                        <TableHead className="text-slate-400">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {auditLogs.map((log) => (
                                        <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                                            <TableCell className="text-slate-400 text-xs font-mono">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-slate-300">{log.actor}</TableCell>
                                            <TableCell className="text-white font-medium">{log.action}</TableCell>
                                            <TableCell className="text-slate-400 text-xs font-mono">{log.ip}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={log.status === 'Success' ? 'text-emerald-500 border-emerald-500/30' : 'text-rose-500 border-rose-500/30'}>
                                                    {log.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                )}

                {activeTab === 'compliance' && (
                    <div className="max-w-4xl space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Regulatory Checklist</CardTitle>
                                    <CardDescription>GDPR / SOX / HIPAA Status</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {complianceChecklist.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-2 rounded bg-slate-950/50 border border-slate-800/50">
                                            <div className="flex items-center gap-3">
                                                {item.status ? <CheckCircle className="w-4 h-4 text-emerald-500"/> : <AlertTriangle className="w-4 h-4 text-amber-500"/>}
                                                <div>
                                                    <div className="text-sm text-white font-medium">{item.label}</div>
                                                    <div className="text-[10px] text-slate-500">{item.standard}</div>
                                                </div>
                                            </div>
                                            <Switch checked={item.status} disabled />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Data Retention Policy</CardTitle>
                                    <CardDescription>Automated archival rules.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Project Retention</label>
                                        <Select defaultValue="7y">
                                            <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1y">1 Year</SelectItem>
                                                <SelectItem value="7y">7 Years (Standard)</SelectItem>
                                                <SelectItem value="forever">Indefinite</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Log Retention</label>
                                        <Select defaultValue="90d">
                                            <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="30d">30 Days</SelectItem>
                                                <SelectItem value="90d">90 Days</SelectItem>
                                                <SelectItem value="1y">1 Year</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button className="w-full mt-4" variant="outline">Generate Compliance Report</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SecurityPanel;