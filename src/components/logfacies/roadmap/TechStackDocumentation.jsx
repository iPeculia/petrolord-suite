import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Server, Globe, Code } from 'lucide-react';

const TechStackDocumentation = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-400">
                        <Globe className="w-5 h-5" /> Frontend Core
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-sm font-bold text-white mb-2">React 18.2 & Vite</h4>
                        <p className="text-xs text-slate-400 mb-2">High-performance component-based UI with fast build times.</p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Hooks</Badge>
                            <Badge variant="outline">Context API</Badge>
                            <Badge variant="outline">Lazy Loading</Badge>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-2">Styling & UI</h4>
                        <p className="text-xs text-slate-400 mb-2">Utility-first CSS with accessible component primitives.</p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">TailwindCSS</Badge>
                            <Badge variant="outline">shadcn/ui</Badge>
                            <Badge variant="outline">Radix UI</Badge>
                            <Badge variant="outline">Lucide Icons</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-400">
                        <Layers className="w-5 h-5" /> Visualization Engine
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-sm font-bold text-white mb-2">Plotly.js & Recharts</h4>
                        <p className="text-xs text-slate-400 mb-2">Scientific plotting for well logs, crossplots, and histograms.</p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">WebGL</Badge>
                            <Badge variant="outline">Interactive Zoom</Badge>
                            <Badge variant="outline">SVG Exports</Badge>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-2">React Flow</h4>
                        <p className="text-xs text-slate-400 mb-2">Node-based diagrams for workflow building and dependency graphs.</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-400">
                        <Server className="w-5 h-5" /> Backend & Infrastructure
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-sm font-bold text-white mb-2">Supabase</h4>
                        <p className="text-xs text-slate-400 mb-2">PostgreSQL database, Authentication, and Storage.</p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Postgres</Badge>
                            <Badge variant="outline">Row Level Security</Badge>
                            <Badge variant="outline">Realtime</Badge>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-2">Edge Functions</h4>
                        <p className="text-xs text-slate-400 mb-2">Serverless compute for ML inference and heavy calculations.</p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Deno</Badge>
                            <Badge variant="outline">Python/TensorFlow</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-400">
                        <Code className="w-5 h-5" /> Data Processing
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-sm font-bold text-white mb-2">Client-Side Parsing</h4>
                        <p className="text-xs text-slate-400 mb-2">Efficient file handling in browser for immediate feedback.</p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Web Workers</Badge>
                            <Badge variant="outline">JSZip</Badge>
                            <Badge variant="outline">PapaParse</Badge>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-2">ML Libraries</h4>
                        <p className="text-xs text-slate-400 mb-2">Browser-based machine learning capabilities.</p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Simple-Statistics</Badge>
                            <Badge variant="outline">TensorFlow.js (Planned)</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TechStackDocumentation;