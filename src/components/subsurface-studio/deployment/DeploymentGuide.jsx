import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, Terminal, GitBranch, Globe } from 'lucide-react';

const DeploymentGuide = () => {
    return (
        <div className="h-full p-4 max-w-4xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                    <Rocket className="w-6 h-6 mr-2 text-orange-400" /> Deployment Guide
                </h2>
                <p className="text-slate-400 text-sm mt-1">Standard operating procedures for deploying EarthModel Studio.</p>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                <div className="space-y-6">
                    <Card className="bg-slate-950 border-slate-800">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <GitBranch className="w-5 h-5 mr-2 text-blue-400" /> 1. Version Control & Branching
                            </h3>
                            <div className="prose prose-invert text-sm text-slate-300">
                                <p>We follow a strict Git flow workflow:</p>
                                <ul className="list-disc pl-5 space-y-2 mt-2">
                                    <li><code className="bg-slate-900 px-1 py-0.5 rounded text-orange-300">main</code>: Production-ready code. Protected branch.</li>
                                    <li><code className="bg-slate-900 px-1 py-0.5 rounded text-blue-300">develop</code>: Integration branch for next release.</li>
                                    <li><code className="bg-slate-900 px-1 py-0.5 rounded text-green-300">feature/*</code>: Feature branches created from develop.</li>
                                    <li><code className="bg-slate-900 px-1 py-0.5 rounded text-red-300">hotfix/*</code>: Critical fixes for production.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-950 border-slate-800">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <Terminal className="w-5 h-5 mr-2 text-green-400" /> 2. Build Process
                            </h3>
                            <div className="bg-slate-900 p-4 rounded-md font-mono text-xs text-slate-300 border border-slate-800">
                                <div className="text-slate-500"># Install dependencies</div>
                                <div className="text-green-400">npm ci</div>
                                <br/>
                                <div className="text-slate-500"># Run test suite</div>
                                <div className="text-green-400">npm run test</div>
                                <br/>
                                <div className="text-slate-500"># Build for production</div>
                                <div className="text-green-400">npm run build</div>
                            </div>
                            <p className="text-sm text-slate-400 mt-4">
                                The build artifacts will be generated in the <code className="text-white">dist/</code> directory.
                                Ensure <code className="text-white">VITE_SUPABASE_URL</code> and <code className="text-white">VITE_SUPABASE_ANON_KEY</code> are set in the environment.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-950 border-slate-800">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <Globe className="w-5 h-5 mr-2 text-purple-400" /> 3. Hosting & CDN
                            </h3>
                            <div className="text-sm text-slate-300 space-y-4">
                                <p>
                                    The application is a Single Page Application (SPA) and should be served via a CDN-backed static host (e.g., Vercel, Netlify, AWS CloudFront + S3).
                                </p>
                                <div className="p-4 bg-yellow-900/10 border border-yellow-900/30 rounded text-yellow-200">
                                    <strong>Important:</strong> Configure rewrite rules to redirect all 404s to <code className="font-bold">index.html</code> to support client-side routing.
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </div>
    );
};

export default DeploymentGuide;