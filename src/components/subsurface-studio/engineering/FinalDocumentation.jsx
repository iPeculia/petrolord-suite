import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';

const FinalDocumentation = () => (
    <ScrollArea className="h-full p-4 text-slate-300 text-sm leading-relaxed bg-slate-950 rounded-lg border border-slate-800">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-cyan-400" /> Engineering Handbook
            </h1>
            
            <section className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-3 border-b border-slate-800 pb-2">1. Architecture Overview</h2>
                <p className="mb-2">EarthModel Studio follows a modular React architecture powered by Vite. State management relies on React Context for localized state and Supabase Realtime for synchronized collaborative state.</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li><strong>Frontend:</strong> React 18, TailwindCSS, Radix UI, Deck.gl/Three.js for visualization.</li>
                    <li><strong>Backend:</strong> Supabase (PostgreSQL) for auth, data, and edge functions.</li>
                    <li><strong>Storage:</strong> Supabase Storage for large seismic volumes and well logs.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-3 border-b border-slate-800 pb-2">2. Deployment Strategy</h2>
                <p className="mb-2">Production builds are optimized using tree-shaking and code splitting.</p>
                <div className="bg-slate-900 p-3 rounded border border-slate-800 font-mono text-xs text-green-400 mb-2">
                    npm run build && npm run preview
                </div>
                <p>The CI/CD pipeline automatically runs linting (ESLint) and unit tests before attempting a build deployment.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-3 border-b border-slate-800 pb-2">3. Troubleshooting</h2>
                <p className="mb-2">Common issues and resolution paths:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li><strong>WebGL Context Lost:</strong> Usually due to high GPU memory pressure. The application auto-attempts context restoration.</li>
                    <li><strong>WebSocket Disconnect:</strong> The Realtime client implements exponential backoff for reconnection.</li>
                </ul>
            </section>
        </div>
    </ScrollArea>
);

export default FinalDocumentation;