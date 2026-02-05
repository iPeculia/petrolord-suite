import React from 'react';

const PolygonGuide = () => (
    <div className="space-y-6">
        <h1>Polygons & Area of Interest (AOI)</h1>
        
        <section>
            <h2>Creating Polygons</h2>
            <p className="text-slate-400">Use the <strong>Polygons</strong> tab to manage shapes.</p>
            <ul className="list-disc pl-6 mt-2 text-slate-400">
                <li><strong>Draw:</strong> Click on the map to define vertices. Double-click to close.</li>
                <li><strong>Circle:</strong> Enter Center X/Y and Radius to generate a circular AOI.</li>
            </ul>
        </section>

        <section>
            <h2>AOI Clipping</h2>
            <p className="text-slate-400">
                Set a polygon as <strong>Active AOI</strong> to restrict all volume calculations to that specific area.
                This is useful for lease-based reserves or sector modeling.
            </p>
        </section>
    </div>
);

export default PolygonGuide;