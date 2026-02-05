import React from 'react';

const Glossary = () => (
    <div className="space-y-6">
        <h1>Glossary</h1>
        <dl className="space-y-4 text-slate-400">
            <dt className="text-white font-bold">AOI (Area of Interest)</dt>
            <dd>A polygon boundary defining the specific region of the reservoir to be included in volumetric calculations.</dd>
            
            <dt className="text-white font-bold">FVF (Formation Volume Factor)</dt>
            <dd>The ratio of the volume of fluid at reservoir conditions to the volume at standard surface conditions.</dd>

            <dt className="text-white font-bold">GRV (Gross Rock Volume)</dt>
            <dd>The total volume of rock between the top and base of the reservoir, above the hydrocarbon contact.</dd>

            <dt className="text-white font-bold">STOOIP</dt>
            <dd>Stock Tank Oil Originally In Place.</dd>
        </dl>
    </div>
);

export default Glossary;