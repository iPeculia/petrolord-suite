import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Server, Database, Globe, Lock, Activity as ActivityIcon } from 'lucide-react';

const ServiceHealthDashboard = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <ActivityIcon className="w-5 h-5 mr-2 text-green-400" /> Service Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { name: 'API Gateway', icon: Globe, status: 'Operational' },
                { name: 'PostgreSQL', icon: Database, status: 'Operational' },
                { name: 'Auth Service', icon: Lock, status: 'Degraded' },
                { name: 'Storage', icon: Server, status: 'Operational' }
            ].map((s, i) => (
                <Card key={i} className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <s.icon className={`w-8 h-8 mb-2 ${s.status === 'Operational' ? 'text-green-500' : 'text-yellow-500'}`} />
                        <div className="font-bold text-white text-sm">{s.name}</div>
                        <div className={`text-xs mt-1 ${s.status === 'Operational' ? 'text-green-400' : 'text-yellow-400'}`}>{s.status}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);

export default ServiceHealthDashboard;