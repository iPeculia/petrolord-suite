import React from 'react';

const FluidPropertiesGuide = () => (
    <div className="space-y-6">
        <h1>Fluid Properties</h1>
        
        <section>
            <h2>Fluid Types</h2>
            <p className="text-slate-400">Select from Oil, Gas, or Oil + Gas Cap.</p>
        </section>

        <section>
            <h2>Key Parameters</h2>
            <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="p-3 bg-slate-900 rounded">
                    <h3 className="text-white font-bold">FVF (Bo/Bg)</h3>
                    <p className="text-sm text-slate-400">Formation Volume Factor. Converts reservoir volumes to surface conditions.</p>
                </div>
                <div className="p-3 bg-slate-900 rounded">
                    <h3 className="text-white font-bold">Contacts</h3>
                    <p className="text-sm text-slate-400">OWC (Oil-Water) and GOC (Gas-Oil) depths define fluid columns.</p>
                </div>
            </div>
        </section>

        <section>
            <h2>Calculator</h2>
            <p className="text-slate-400">Use the built-in calculator (Calculator Icon) to estimate Bo from GOR, API Gravity, and Temperature using Standing's correlations.</p>
        </section>
    </div>
);

export default FluidPropertiesGuide;