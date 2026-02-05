import React from 'react';

const InputMethodsGuide = () => (
    <div className="space-y-6">
        <h1>Input Methods</h1>
        
        <section>
            <h2>1. Simple (Area & Thickness)</h2>
            <p className="text-slate-400">Best for early exploration/quick look.</p>
            <code className="block bg-slate-900 p-2 rounded mt-2 text-sm">Volume = Area × Thickness × GRV_Factor</code>
        </section>

        <section>
            <h2>2. Surfaces (Top & Base)</h2>
            <p className="text-slate-400">Uses imported grids for precise volumetric integration.</p>
            <p className="text-slate-400 mt-2">Requires importing two surfaces: Top Structure and Base Structure.</p>
        </section>

        <section>
            <h2>3. Hybrid (Top & Constant Thickness)</h2>
            <p className="text-slate-400">Uses a Top Structure map and projects a constant thickness downwards.</p>
        </section>
    </div>
);

export default InputMethodsGuide;