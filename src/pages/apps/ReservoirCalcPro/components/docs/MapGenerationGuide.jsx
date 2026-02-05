import React from 'react';

const MapGenerationGuide = () => (
    <div className="space-y-6">
        <h1>Map Generation</h1>
        
        <section>
            <h2>Available Maps</h2>
            <p className="text-slate-400">Generate up to 13 distinct property maps based on input surfaces and parameters:</p>
            <ul className="grid grid-cols-2 gap-2 mt-2 text-sm text-slate-400">
                <li>Structure Map</li>
                <li>Gross Thickness</li>
                <li>Net Pay</li>
                <li>Porosity Distribution</li>
                <li>Water Saturation</li>
                <li>HCPV (Hydrocarbon Pore Volume)</li>
                <li>STOOIP Intensity</li>
                <li>GIIP Intensity</li>
            </ul>
        </section>

        <section>
            <h2>Workflow</h2>
            <ol className="list-decimal pl-6 text-slate-400">
                <li>Import Top Surface.</li>
                <li>Define Reservoir Parameters (Thickness, NTG, Phi, Sw).</li>
                <li>Go to <strong>Maps</strong> tab.</li>
                <li>Select desired map types.</li>
                <li>Click <strong>Generate</strong>. Maps appear in the Visualizer.</li>
            </ol>
        </section>
    </div>
);

export default MapGenerationGuide;