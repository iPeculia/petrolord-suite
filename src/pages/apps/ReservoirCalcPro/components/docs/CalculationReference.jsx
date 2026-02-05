import React from 'react';

const CalculationReference = () => (
    <div className="space-y-6">
        <h1>Calculation Reference</h1>
        
        <section>
            <h2>Volumetrics Formulas</h2>
            <div className="bg-slate-900 p-4 rounded border border-slate-800 font-mono text-sm text-blue-300 space-y-2">
                <p>GRV = Area × Thickness</p>
                <p>NRV = GRV × Net_to_Gross</p>
                <p>HCPV = NRV × Porosity × (1 - Sw)</p>
                <p>STOOIP = (HCPV × Constant) / Bo</p>
                <p>GIIP = (HCPV × Constant) / Bg</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">*Constant = 7758 (Oil/Acres) or 43560 (Gas/Acres) for Field Units.</p>
        </section>
    </div>
);

export default CalculationReference;