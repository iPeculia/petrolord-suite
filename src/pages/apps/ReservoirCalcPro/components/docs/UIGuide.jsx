import React from 'react';

const UIGuide = () => (
    <div className="space-y-6">
        <h1>User Interface Guide</h1>
        
        <section>
            <h2>Main Layout</h2>
            <p className="text-slate-400">The interface is divided into three main zones:</p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <li className="bg-slate-900 p-4 rounded border border-slate-800">
                    <strong className="text-blue-400 block mb-2">Left Panel (Inputs)</strong>
                    Configuration, Parameters, and Data Import.
                </li>
                <li className="bg-slate-900 p-4 rounded border border-slate-800">
                    <strong className="text-purple-400 block mb-2">Center/Right (Visuals)</strong>
                    Map Viewer, Cross-plots, and 3D Models.
                </li>
                <li className="bg-slate-900 p-4 rounded border border-slate-800">
                    <strong className="text-emerald-400 block mb-2">Bottom/Overlay (Results)</strong>
                    Calculation Summaries and Reporting.
                </li>
            </ul>
        </section>

        <section>
            <h2>Tab System</h2>
            <p className="text-slate-400">Navigate workflows using the top tabs in the Input Panel:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-400">
                <li><strong>Reservoir:</strong> Geometry, Surfaces, and Petrophysics.</li>
                <li><strong>Fluid:</strong> Oil/Gas properties, Contacts (OWC/GOC).</li>
                <li><strong>Maps:</strong> Map generation settings.</li>
                <li><strong>AOI:</strong> Polygon management and Area of Interest selection.</li>
                <li><strong>Integration:</strong> Connections to external apps (PPFG, Velocity).</li>
            </ul>
        </section>
    </div>
);

export default UIGuide;