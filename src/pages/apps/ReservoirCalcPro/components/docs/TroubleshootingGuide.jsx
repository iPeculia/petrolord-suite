import React from 'react';

const TroubleshootingGuide = () => (
    <div className="space-y-6">
        <h1>Troubleshooting</h1>
        
        <section>
            <h2>Common Issues</h2>
            <dl className="space-y-4 text-slate-400">
                <dt className="text-white font-bold">Calculations showing zero?</dt>
                <dd>Check if Surface Z-values are positive depth. Ensure fluid contacts (OWC) are deeper than the Top Structure.</dd>

                <dt className="text-white font-bold">Map not rendering?</dt>
                <dd>Ensure the imported surface has valid X, Y coordinates matching the project CRS. Try "Zoom to Extents".</dd>
                
                <dt className="text-white font-bold">Integration Import failed?</dt>
                <dd>Verify that the source app (e.g., PPFG) has published data to the Shared Data Registry.</dd>
            </dl>
        </section>
    </div>
);

export default TroubleshootingGuide;