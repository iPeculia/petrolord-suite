import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network } from 'lucide-react';

const EnterpriseIntegration = () => {
    const connectors = [
        { name: 'SAP ERP', status: 'Connected', type: 'Financial' },
        { name: 'Salesforce', status: 'Connected', type: 'CRM' },
        { name: 'SharePoint', status: 'Syncing', type: 'DMS' },
        { name: 'OSDU Data Platform', status: 'Connected', type: 'Data Lake' },
    ];

    return (
        <div className="space-y-4 h-full p-1">
            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center text-slate-200"><Network className="w-4 h-4 mr-2 text-cyan-400"/> Enterprise Connectors</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {connectors.map((c) => (
                            <div key={c.name} className="p-4 bg-slate-900 rounded border border-slate-800 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold text-slate-200">{c.name}</div>
                                    <div className="text-[10px] text-slate-500">{c.type}</div>
                                </div>
                                <Badge variant="outline" className={c.status === 'Connected' ? 'text-green-400 border-green-900' : 'text-blue-400 border-blue-900'}>
                                    {c.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EnterpriseIntegration;