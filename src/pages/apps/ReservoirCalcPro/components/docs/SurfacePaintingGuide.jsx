import React from 'react';

const SurfacePaintingGuide = () => (
    <div className="space-y-6">
        <h1>Surface Painting & Visualization</h1>
        
        <section>
            <h2>Visualization Modes</h2>
            <ul className="list-disc pl-6 text-slate-400">
                <li><strong>2D Contour:</strong> Top-down view with color-filled contours. Best for spotting trends.</li>
                <li><strong>3D Mesh:</strong> Interactive 3D surface. Best for structural understanding.</li>
            </ul>
        </section>

        <section>
            <h2>Styling</h2>
            <p className="text-slate-400">Maps use standard colormaps:</p>
            <ul className="list-disc pl-6 text-slate-400">
                <li><span className="text-emerald-400">Structure:</span> Earth Tones</li>
                <li><span className="text-blue-400">Saturation:</span> Blues/White</li>
                <li><span className="text-red-400">Net Pay:</span> Jet/Rainbow</li>
            </ul>
        </section>
    </div>
);

export default SurfacePaintingGuide;