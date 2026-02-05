import React from 'react';

const ReleaseNotes = () => (
    <div className="space-y-6">
        <h1>Release Notes</h1>
        
        <section>
            <h2 className="flex items-center gap-2">v2.1.0 <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Current</span></h2>
            <ul className="list-disc pl-6 mt-2 text-slate-400">
                <li>Added <strong>Polygon Clipping</strong> support for AOI-based calculations.</li>
                <li>Integrated <strong>PPFG Analyzer</strong> data import.</li>
                <li>New <strong>Surface Painting</strong> visualization modes.</li>
            </ul>
        </section>

        <section>
            <h2 className="text-slate-500">v2.0.0</h2>
            <ul className="list-disc pl-6 mt-2 text-slate-500">
                <li>Initial release of Deterministic Engine.</li>
                <li>Added Surface Import wizard.</li>
            </ul>
        </section>
    </div>
);

export default ReleaseNotes;