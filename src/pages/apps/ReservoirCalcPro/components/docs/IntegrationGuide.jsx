import React from 'react';

const IntegrationGuide = () => (
    <div className="space-y-6">
        <h1>System Integration</h1>
        
        <section>
            <h2>PetroLord Ecosystem</h2>
            <p className="text-slate-400">ReservoirCalc Pro connects with other modules via the <strong>Integration Hub</strong>.</p>
        </section>

        <section>
            <h2>Supported Integrations</h2>
            <div className="space-y-4 mt-4">
                <div className="bg-slate-900 p-3 rounded">
                    <h3 className="text-white font-bold">PPFG Analyzer</h3>
                    <p className="text-sm text-slate-400">Import fluid contacts (OWC/GOC) derived from pressure gradients.</p>
                </div>
                <div className="bg-slate-900 p-3 rounded">
                    <h3 className="text-white font-bold">Velocity Model Builder</h3>
                    <p className="text-sm text-slate-400">Import depth-converted surfaces directly as structural grids.</p>
                </div>
            </div>
        </section>
    </div>
);

export default IntegrationGuide;