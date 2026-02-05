import React from 'react';

const APIDocumentation = () => (
    <div className="space-y-6">
        <h1>API Documentation</h1>
        <p className="text-slate-400">ReservoirCalc Pro exposes a client-side API for interacting with other PetroLord modules.</p>
        
        <section>
            <h2>Shared Data Interface</h2>
            <pre className="bg-slate-950 p-4 rounded border border-slate-800 overflow-x-auto text-xs font-mono text-blue-300">
{`// Fetch active reservoir results
const results = await Petrolord.ReservoirCalc.getResults(projectId);

// Structure
{
  stooip: 15000000, // bbl
  grv: 45000,       // acre-ft
  unitSystem: 'field'
}`}
            </pre>
        </section>
    </div>
);

export default APIDocumentation;