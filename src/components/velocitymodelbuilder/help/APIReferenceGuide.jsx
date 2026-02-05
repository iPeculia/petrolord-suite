import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Terminal } from 'lucide-react';

const CodeBlock = ({ code }) => (
    <div className="bg-slate-950 rounded-md border border-slate-800 p-3 relative group mt-2">
        <code className="text-xs font-mono text-blue-300 whitespace-pre-wrap">{code}</code>
        <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy className="w-3 h-3" />
        </Button>
    </div>
);

const APIReferenceGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Terminal className="w-5 h-5" /> API Reference</h2>
        <p className="text-sm text-slate-400">
            Automate velocity modeling tasks using our REST API. All requests must be authenticated via Bearer Token.
        </p>

        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4 space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-[10px] font-bold rounded border border-green-900">POST</span>
                        <code className="text-sm text-slate-200">/v1/velocity/convert</code>
                    </div>
                    <p className="text-xs text-slate-500">Convert Time/Depth pairs or arrays using a specific model.</p>
                    <CodeBlock code={`curl -X POST https://api.petrolord.com/v1/velocity/convert \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model_id": "vm_123",
    "data": [{"twt": 1500}, {"twt": 2000}],
    "domain": "time_to_depth"
  }'`} />
                </div>

                <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-[10px] font-bold rounded border border-blue-900">GET</span>
                        <code className="text-sm text-slate-200">/v1/projects/{'{id}'}/models</code>
                    </div>
                    <p className="text-xs text-slate-500">List all velocity models associated with a project.</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export default APIReferenceGuide;