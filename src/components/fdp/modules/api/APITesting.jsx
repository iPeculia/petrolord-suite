import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Play, RefreshCw } from 'lucide-react';
import { RestAPIService } from '@/services/api/RestAPIService';
import { GraphQLAPIService } from '@/services/api/GraphQLAPIService';

const APITesting = () => {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('/api/v1/fdp/fields/123');
    const [apiType, setApiType] = useState('rest');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        setLoading(true);
        setResponse(null);
        try {
            let res;
            if (apiType === 'rest') {
                // Extract ID for mock purposes
                const id = url.split('/').pop();
                res = await RestAPIService.getFieldData(id);
            } else {
                res = await GraphQLAPIService.executeQuery(url); // url used as query input here for simplicity
            }
            setResponse(JSON.stringify(res, null, 2));
        } catch (e) {
            setResponse(JSON.stringify({ error: e.message }, null, 2));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex gap-2">
                            <Select value={apiType} onValueChange={setApiType}>
                                <SelectTrigger className="w-[120px] bg-slate-800 border-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rest">REST</SelectItem>
                                    <SelectItem value="graphql">GraphQL</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            {apiType === 'rest' && (
                                <Select value={method} onValueChange={setMethod}>
                                    <SelectTrigger className="w-[100px] bg-slate-800 border-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            
                            <Input 
                                value={url} 
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder={apiType === 'rest' ? "Enter URL" : "Enter Query"}
                                className="bg-slate-800 border-slate-700 font-mono text-sm"
                            />
                            
                            <Button onClick={handleSend} disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[100px]">
                                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                                Send
                            </Button>
                        </div>

                        {apiType === 'graphql' && (
                            <Textarea 
                                placeholder="Query variables (JSON)"
                                className="bg-slate-950 border-slate-800 font-mono text-xs h-24"
                            />
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 flex-1">
                    <CardContent className="p-0">
                        <div className="bg-slate-950 p-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
                            Response Body
                        </div>
                        <div className="p-4 font-mono text-xs text-green-400 h-[400px] overflow-y-auto whitespace-pre-wrap">
                            {response || "// Send a request to see the response..."}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4">
                        <h3 className="text-sm font-bold text-white mb-2">Saved Requests</h3>
                        <div className="space-y-2">
                            <button onClick={() => { setApiType('rest'); setUrl('/api/v1/fdp/fields/123'); }} className="w-full text-left p-2 rounded hover:bg-slate-800 text-xs text-slate-300">
                                <span className="text-green-400 font-bold mr-2">GET</span> Field Details
                            </button>
                            <button onClick={() => { setApiType('graphql'); setUrl('query { getField(id: "123") { name reserves } }'); }} className="w-full text-left p-2 rounded hover:bg-slate-800 text-xs text-slate-300">
                                <span className="text-pink-400 font-bold mr-2">GQL</span> Fetch Reserves
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default APITesting;