import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code2, Terminal, Play } from 'lucide-react';

const ExtensionDeveloperTools = () => {
    return (
        <div className="h-full p-1 flex flex-col gap-4">
             <div className="flex justify-between items-center shrink-0">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <Code2 className="w-5 h-5 mr-2 text-slate-400" /> DevTools
                </h3>
                <Button size="sm" className="bg-slate-800 hover:bg-slate-700">
                    <Play className="w-4 h-4 mr-2 text-green-400" /> Run Script
                </Button>
            </div>

            <div className="flex-grow grid grid-rows-3 gap-4 min-h-0">
                <Card className="row-span-2 bg-slate-950 border-slate-800 flex flex-col">
                    <div className="bg-slate-900 p-2 border-b border-slate-800 text-xs text-slate-400 font-mono">extension.js</div>
                    <textarea 
                        className="flex-grow bg-slate-950 p-4 text-xs font-mono text-green-400 resize-none focus:outline-none"
                        defaultValue={`// EarthModel Studio Extension API v1.0
module.exports = {
    onLoad: (ctx) => {
        console.log("Extension loaded!");
        ctx.ui.showToast("Hello World");
    },
    
    registerCommands: (registry) => {
        registry.add("custom.command", () => {
            // Custom logic here
        });
    }
};`}
                    />
                </Card>
                
                <Card className="row-span-1 bg-slate-950 border-slate-800 flex flex-col">
                    <div className="bg-slate-900 p-2 border-b border-slate-800 text-xs text-slate-400 font-mono flex items-center gap-2">
                        <Terminal className="w-3 h-3" /> Console Output
                    </div>
                    <div className="flex-grow bg-black p-2 font-mono text-[10px] text-slate-400 overflow-y-auto">
                        <div>[System] Dev environment initialized.</div>
                        <div>[System] Ready for input.</div>
                        <div className="text-green-500">{`>`} _</div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ExtensionDeveloperTools;