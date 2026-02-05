import React from 'react';
import { Terminal, Copy, Key, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const VelocityModelAPIEndpoint = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <Card className="bg-slate-900 border-slate-800 flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Terminal className="w-5 h-5 text-emerald-400"/> API Integration</CardTitle>
                <CardDescription>Connect external apps via REST API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Endpoint URL</label>
                    <div className="flex gap-2">
                        <Input readOnly value="https://api.petrolord.com/v1/velocity/build_model" className="bg-slate-950 border-slate-800 font-mono text-xs text-blue-400" />
                        <Button variant="ghost" size="icon"><Copy className="w-4 h-4"/></Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Authentication</label>
                    <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Key className="w-4 h-4 text-amber-400" />
                            <span>API Key: pk_live_****************</span>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-xs">Regenerate</Button>
                    </div>
                </div>

                <div className="p-4 bg-emerald-900/10 border border-emerald-900/30 rounded-lg">
                    <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center"><ShieldCheck className="w-4 h-4 mr-2"/> Enterprise Security</h4>
                    <p className="text-xs text-emerald-200/70">All API requests are logged in the Audit Trail. Rate limits apply based on organization tier.</p>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 flex flex-col">
            <CardHeader>
                <CardTitle className="text-sm">Request Body Builder</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 bg-slate-950 p-0 overflow-hidden relative font-mono text-xs">
                <Tabs defaultValue="json" className="h-full flex flex-col">
                    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
                        <TabsList className="h-6 bg-slate-800">
                            <TabsTrigger value="json" className="text-[10px] h-5">JSON</TabsTrigger>
                            <TabsTrigger value="python" className="text-[10px] h-5">Python</TabsTrigger>
                            <TabsTrigger value="curl" className="text-[10px] h-5">cURL</TabsTrigger>
                        </TabsList>
                        <Button size="sm" className="h-6 text-[10px] bg-blue-600 hover:bg-blue-500">Test Request</Button>
                    </div>
                    <TabsContent value="json" className="p-4 text-slate-300 overflow-auto mt-0">
                        <pre>{`{
  "project_id": "proj_12345",
  "method": "layer_cake",
  "layers": [
    {
      "name": "Water",
      "bottom_depth": 1500,
      "velocity": 1480
    },
    {
      "name": "Overburden",
      "bottom_depth": 3000,
      "v0": 1800,
      "k": 0.6
    }
  ],
  "calibration": {
    "wells": ["w1", "w2"],
    "tolerance_ms": 5
  }
}`}</pre>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
};

export default VelocityModelAPIEndpoint;