import React from 'react';

const SurfaceImportGuide = () => (
    <div className="space-y-6">
        <h1>Surface Import Guide</h1>
        
        <section>
            <h2>Supported Formats</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
                <li><strong>GeoJSON (.json, .geojson):</strong> Standard web mapping format.</li>
                <li><strong>XYZ Text (.txt, .csv, .xyz):</strong> Space or comma delimited point clouds.</li>
                <li><strong>ZMAP+ (.dat):</strong> Standard industry grid format (ASCII).</li>
            </ul>
        </section>

        <section>
            <h2>Data Validation</h2>
            <p className="text-slate-400">The system automatically checks for:</p>
            <ul className="list-disc pl-6 text-slate-400">
                <li>Coordinate consistency (X/Y ranges)</li>
                <li>Z-value validity (removing nulls/-9999)</li>
                <li>Grid regularity (for map display)</li>
            </ul>
        </section>
    </div>
);

export default SurfaceImportGuide;