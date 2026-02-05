import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const CustomizationDocumentation = () => (
    <ScrollArea className="h-full p-4 text-slate-300 text-sm leading-relaxed bg-slate-950 rounded-lg border border-slate-800">
        <h1 className="text-2xl font-bold text-white mb-4">Customization & Extensibility Guide</h1>
        
        <p className="mb-4">EarthModel Studio is built to be extended. Use this guide to understand how to safely modify the platform's behavior and appearance.</p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">1. Themes</h3>
        <p>Themes control the global CSS variables. Changing the 'Primary Color' updates all buttons, active states, and highlights instantly.</p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">2. Plugin Architecture</h3>
        <p>Plugins are isolated JavaScript modules that can interact with the Studio Context. Use the Developer Tools panel to test your scripts before packaging them.</p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3. Workflows</h3>
        <p>The Workflow Builder allows you to chain actions together. Triggers can be system events (e.g., 'File Uploaded') or manual invocations.</p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4. API Access</h3>
        <p>Generate API keys to access your data programmatically. Ensure you scope your keys correctly (Read-Only vs Full Access) for security.</p>
    </ScrollArea>
);

export default CustomizationDocumentation;