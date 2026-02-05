import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Database, BarChart3 } from 'lucide-react';

const PropertyModelingPanel = ({ onRunModel }) => {
    const [property, setProperty] = useState('porosity');
    const [method, setMethod] = useState('kriging');

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-purple-400">
                    <Database className="w-4 h-4 mr-2" /> Property Modeling
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Property Type</Label>
                    <Select value={property} onValueChange={setProperty}>
                        <SelectTrigger className="h-8 bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="porosity">Porosity (PHIE)</SelectItem>
                            <SelectItem value="permeability">Permeability (K)</SelectItem>
                            <SelectItem value="saturation">Water Saturation (Sw)</SelectItem>
                            <SelectItem value="facies">Facies Class</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Interpolation Method</Label>
                    <Select value={method} onValueChange={setMethod}>
                        <SelectTrigger className="h-8 bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="kriging">Kriging</SelectItem>
                            <SelectItem value="idw">Inverse Distance Weighting</SelectItem>
                            <SelectItem value="sgs">Sequential Gaussian Simulation</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-xs" size="sm" onClick={() => onRunModel(property, method)}>
                    <BarChart3 className="w-3 h-3 mr-2" /> Populate Grid
                </Button>
            </CardContent>
        </Card>
    );
};

export default PropertyModelingPanel;