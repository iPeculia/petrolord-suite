import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sliders } from 'lucide-react';

const FeatureEngineering = () => {
    return (
        <div className="space-y-4 h-full p-1">
            <Card className="bg-slate-950 border-slate-800">
                 <CardHeader>
                    <CardTitle className="text-sm flex items-center text-slate-200"><Sliders className="w-4 h-4 mr-2 text-pink-400"/> Feature Selection</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {['Gamma Ray (GR)', 'Resistivity (RT)', 'Density (RHOB)', 'Neutron Porosity (NPHI)', 'Acoustic (DT)', 'Vp/Vs Ratio', 'Poisson Ratio'].map((f, i) => (
                            <div key={i} className="flex items-center space-x-2">
                                <Checkbox id={`feat-${i}`} defaultChecked={i < 4} />
                                <Label htmlFor={`feat-${i}`} className="text-xs text-slate-300">{f}</Label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FeatureEngineering;