import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const APIDocumentationViewer = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            <Card className="bg-slate-900 border-slate-800 md:col-span-1">
                <CardContent className="p-0">
                    <ScrollArea className="h-full p-4">
                        <h3 className="text-sm font-bold text-white mb-4">Table of Contents</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <div className="text-slate-400 font-medium mb-2">REST API</div>
                                <ul className="space-y-2 border-l border-slate-800 ml-1 pl-3">
                                    <li className="text-blue-400 cursor-pointer">Authentication</li>
                                    <li className="text-slate-500 hover:text-slate-300 cursor-pointer">Fields Endpoint</li>
                                    <li className="text-slate-500 hover:text-slate-300 cursor-pointer">Wells Endpoint</li>
                                    <li className="text-slate-500 hover:text-slate-300 cursor-pointer">Production Data</li>
                                </ul>
                            </div>
                            <div>
                                <div className="text-slate-400 font-medium mb-2">GraphQL API</div>
                                <ul className="space-y-2 border-l border-slate-800 ml-1 pl-3">
                                    <li className="text-slate-500 hover:text-slate-300 cursor-pointer">Schema Reference</li>
                                    <li className="text-slate-500 hover:text-slate-300 cursor-pointer">Queries</li>
                                    <li className="text-slate-500 hover:text-slate-300 cursor-pointer">Mutations</li>
                                </ul>
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 md:col-span-3">
                <CardContent className="p-8 overflow-y-auto h-full">
                    <h1 className="text-3xl font-bold text-white mb-6">API Authentication</h1>
                    <p className="text-slate-400 mb-6">
                        All API requests must be authenticated using a Bearer Token in the HTTP Header.
                    </p>
                    
                    <div className="bg-slate-950 p-4 rounded border border-slate-800 mb-8">
                        <code className="text-sm font-mono text-green-400">Authorization: Bearer &lt;your_api_token&gt;</code>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-4">Rate Limiting</h2>
                    <p className="text-slate-400 mb-4">
                        The standard tier allows for 100 requests per minute. Exceeding this limit will result in a <code>429 Too Many Requests</code> response.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default APIDocumentationViewer;