import React from 'react';
import { Globe, Key, Copy, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const PublicAPIEndpoints = () => {
    return (
        <div className="grid grid-cols-1 gap-6 h-full">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Key className="w-4 h-4 text-yellow-400" /> API Credentials
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 uppercase font-bold">API Key</label>
                        <div className="flex gap-2">
                            <Input value="pl_live_8a92b3c7d..." type="password" readOnly className="bg-slate-950 border-slate-700 font-mono text-xs" />
                            <Button variant="outline" size="icon"><Eye className="w-4 h-4" /></Button>
                            <Button variant="outline" size="icon"><Copy className="w-4 h-4" /></Button>
                        </div>
                        <p className="text-[10px] text-slate-500">Rate Limit: 1000 req/hour</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Globe className="w-4 h-4 text-blue-400" /> Endpoint Documentation
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full p-4">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-900">POST</Badge>
                                    <code className="text-sm text-slate-200">/v1/facies/classify</code>
                                </div>
                                <p className="text-xs text-slate-400">Run classification on provided LAS data.</p>
                                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                                    <pre className="text-[10px] font-mono text-blue-300">
{`curl -X POST https://api.petrolord.com/v1/facies/classify \\
  -H "Authorization: Bearer pl_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "xgboost_v2",
    "curves": { "GR": [45, 50, ...], "RHOB": [2.4, ...] }
  }'`}
                                    </pre>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-900">GET</Badge>
                                    <code className="text-sm text-slate-200">/v1/projects/{`{id}`}/results</code>
                                </div>
                                <p className="text-xs text-slate-400">Retrieve stored results for a specific project.</p>
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

// Missing Badge import in this snippet, fixing it inline or assuming global UI components availability. 
// Adding simplistic Badge for standalone correctness in this block.
const Badge = ({children, className, variant}) => <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${className}`}>{children}</span>;

export default PublicAPIEndpoints;