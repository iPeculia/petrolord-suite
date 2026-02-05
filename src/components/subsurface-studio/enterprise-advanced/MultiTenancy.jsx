import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Settings, Database, Users } from 'lucide-react';

const MultiTenancy = () => {
    const tenants = [
        { name: 'Global Energy Corp', id: 'tnt_001', users: 1204, status: 'Active', region: 'US-East' },
        { name: 'North Sea Drilling', id: 'tnt_002', users: 450, status: 'Active', region: 'EU-West' },
        { name: 'Pacific GeoServices', id: 'tnt_003', users: 85, status: 'Suspended', region: 'AP-Southeast' },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-400" /> Tenant Management
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {tenants.map((t, i) => (
                    <Card key={i} className="bg-slate-950 border-slate-800">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-blue-900/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                                    {t.name.substring(0,2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-200">{t.name}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                                        <span className="flex items-center"><Users className="w-3 h-3 mr-1"/> {t.users} Users</span>
                                        <span className="flex items-center"><Database className="w-3 h-3 mr-1"/> {t.region}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${t.status === 'Active' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                                    {t.status}
                                </div>
                                <Button size="sm" variant="outline"><Settings className="w-4 h-4"/></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default MultiTenancy;