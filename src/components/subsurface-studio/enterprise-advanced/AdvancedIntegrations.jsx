import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link, Plug } from 'lucide-react';

const AdvancedIntegrations = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Link className="w-5 h-5 mr-2 text-pink-400" /> Enterprise Connectors
        </h3>
        <div className="grid grid-cols-3 gap-4">
            {['SAP', 'Salesforce', 'Snowflake', 'Databricks', 'OSDU', 'Petrel'].map((sys, i) => (
                <Card key={i} className="bg-slate-950 border-slate-800 hover:bg-slate-900 cursor-pointer group">
                    <CardContent className="p-4 text-center">
                        <Plug className="w-8 h-8 mx-auto text-slate-600 group-hover:text-pink-400 mb-2 transition-colors" />
                        <div className="text-sm font-bold text-slate-300">{sys}</div>
                        <div className="text-[10px] text-slate-500 mt-1">Disconnected</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);

export default AdvancedIntegrations;