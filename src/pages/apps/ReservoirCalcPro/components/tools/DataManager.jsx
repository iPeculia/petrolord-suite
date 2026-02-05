import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Server, Link2 } from 'lucide-react';

const DataManager = () => {
    return (
        <div className="h-full flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">Data Manager</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-base flex items-center gap-2">
                            <Database className="w-4 h-4 text-blue-400" /> Database Connections
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 mb-4">Manage connections to external SQL databases or cloud storage.</p>
                        <div className="p-3 bg-slate-950 rounded border border-slate-800 text-sm text-slate-500 text-center italic">
                            No active connections
                        </div>
                    </CardContent>
                </Card>
                 <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-base flex items-center gap-2">
                            <Server className="w-4 h-4 text-purple-400" /> Parameter Libraries
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 mb-4">Edit default fluid properties and rock type libraries.</p>
                        <div className="p-3 bg-slate-950 rounded border border-slate-800 text-sm text-slate-500 text-center italic">
                            Standard Library (Read-only)
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DataManager;