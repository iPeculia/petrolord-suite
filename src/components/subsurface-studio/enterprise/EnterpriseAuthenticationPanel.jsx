import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Lock, Users, History, RefreshCw } from 'lucide-react';

const EnterpriseAuthenticationPanel = () => {
    const [ssoEnabled, setSsoEnabled] = useState(true);
    const [mfaEnforced, setMfaEnforced] = useState(false);

    const apiKeys = [
        { id: 1, name: 'Production API', prefix: 'pk_live_...', created: '2025-01-15', status: 'Active' },
        { id: 2, name: 'Dev Test', prefix: 'pk_test_...', created: '2025-10-20', status: 'Active' },
    ];

    return (
        <div className="space-y-6 h-full overflow-y-auto p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center text-slate-200">
                            <Shield className="w-5 h-5 mr-2 text-cyan-400" /> SSO & Identity
                        </CardTitle>
                        <CardDescription>Configure Single Sign-On and Identity Providers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 border border-slate-800 rounded-lg bg-slate-900/50">
                            <div className="space-y-0.5">
                                <Label className="text-base text-slate-200">SAML 2.0 Integration</Label>
                                <div className="text-xs text-slate-500">Allow users to sign in via corporate IdP (Okta, Azure AD)</div>
                            </div>
                            <Switch checked={ssoEnabled} onCheckedChange={setSsoEnabled} />
                        </div>
                        <div className="flex items-center justify-between p-3 border border-slate-800 rounded-lg bg-slate-900/50">
                            <div className="space-y-0.5">
                                <Label className="text-base text-slate-200">Enforce MFA</Label>
                                <div className="text-xs text-slate-500">Require 2FA for all non-SSO logins</div>
                            </div>
                            <Switch checked={mfaEnforced} onCheckedChange={setMfaEnforced} />
                        </div>
                        <div className="pt-2">
                            <Label className="text-xs text-slate-400 mb-2 block">IdP Metadata URL</Label>
                            <div className="flex gap-2">
                                <Input className="bg-slate-900 border-slate-800 text-xs" placeholder="https://idp.example.com/metadata.xml" disabled={!ssoEnabled} />
                                <Button size="sm" variant="outline" disabled={!ssoEnabled}>Verify</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center text-slate-200">
                            <Key className="w-5 h-5 mr-2 text-yellow-400" /> API Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="h-8 text-xs">Name</TableHead>
                                    <TableHead className="h-8 text-xs">Key Prefix</TableHead>
                                    <TableHead className="h-8 text-xs">Status</TableHead>
                                    <TableHead className="h-8 text-xs text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apiKeys.map(key => (
                                    <TableRow key={key.id} className="border-slate-800 hover:bg-slate-900/50">
                                        <TableCell className="py-2 font-medium text-slate-300">{key.name}</TableCell>
                                        <TableCell className="py-2 font-mono text-xs text-slate-500">{key.prefix}</TableCell>
                                        <TableCell className="py-2"><Badge variant="outline" className="text-green-400 border-green-900 bg-green-900/10 text-[10px]">{key.status}</Badge></TableCell>
                                        <TableCell className="py-2 text-right"><Button size="sm" variant="ghost" className="h-6 w-6 p-0"><RefreshCw className="w-3 h-3" /></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white text-xs">Generate New Key</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EnterpriseAuthenticationPanel;