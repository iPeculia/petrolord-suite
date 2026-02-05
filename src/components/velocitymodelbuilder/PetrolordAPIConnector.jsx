import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Network, Shield, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

const PetrolordAPIConnector = () => {
  const connections = [
    { name: 'Log Facies Analysis', endpoint: 'api.petrolord.com/v1/facies', status: 'connected', latency: '45ms' },
    { name: 'EarthModel Studio', endpoint: 'api.petrolord.com/v2/ems', status: 'connected', latency: '120ms' },
    { name: 'Volumetrics Engine', endpoint: 'api.petrolord.com/v1/vols', status: 'error', latency: '-' },
    { name: 'Project Mgmt Pro', endpoint: 'api.petrolord.com/v1/pmp', status: 'connected', latency: '60ms' }
  ];

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Network className="w-4 h-4 text-blue-400" /> Petrolord API Gateway
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-400">API Token Status</Label>
                <Badge variant="outline" className="text-emerald-400 border-emerald-900 bg-emerald-900/10 text-[10px]">Valid</Badge>
            </div>
            <div className="flex gap-2">
                <Input type="password" value="**********************" className="h-8 bg-slate-950 border-slate-700 font-mono text-xs" readOnly />
                <Button variant="outline" size="sm" className="h-8 border-slate-700">
                    <RefreshCw className="w-3 h-3" />
                </Button>
            </div>
        </div>

        <div className="space-y-2">
            <Label className="text-xs text-slate-400">Service Endpoints</Label>
            <div className="space-y-2">
                {connections.map((conn, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded">
                        <div className="flex items-center gap-2">
                            {conn.status === 'connected' ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            ) : (
                                <XCircle className="w-3 h-3 text-red-500" />
                            )}
                            <span className="text-xs font-medium text-slate-300">{conn.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">{conn.latency}</span>
                            <Badge variant="secondary" className={`text-[10px] h-4 px-1 ${
                                conn.status === 'connected' ? 'bg-emerald-900/20 text-emerald-500' : 'bg-red-900/20 text-red-500'
                            }`}>
                                {conn.status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <Shield className="w-3 h-3" />
                <span>Protected by OAuth 2.0 & TLS 1.3</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetrolordAPIConnector;