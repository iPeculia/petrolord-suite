import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';

const MapCartographyControls = ({ mapSettings, setMapSettings, activeBaseMap, setActiveBaseMap }) => {
    // Robust checks
    if (!mapSettings || !setMapSettings) return null;

    const toggleSetting = (key) => {
        setMapSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Base Map Provider</Label>
                <Select value={activeBaseMap} onValueChange={setActiveBaseMap}>
                    <SelectTrigger className="h-8 bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="OSM">OpenStreetMap (Standard)</SelectItem>
                        <SelectItem value="Satellite">Satellite (Esri World Imagery)</SelectItem>
                        <SelectItem value="Dark">Dark Matter (CartoDB)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/50">
                <div className="flex items-center justify-between">
                    <Label htmlFor="show-grid" className="text-xs text-slate-300">Show Grid Lines</Label>
                    <Switch id="show-grid" checked={mapSettings.showGrid} onCheckedChange={() => toggleSetting('showGrid')} className="scale-75" />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="show-north" className="text-xs text-slate-300">North Arrow</Label>
                    <Switch id="show-north" checked={mapSettings.showNorth} onCheckedChange={() => toggleSetting('showNorth')} className="scale-75" />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="show-scale" className="text-xs text-slate-300">Scale Bar</Label>
                    <Switch id="show-scale" checked={mapSettings.showScale} onCheckedChange={() => toggleSetting('showScale')} className="scale-75" />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="show-labels" className="text-xs text-slate-300">Feature Labels</Label>
                    <Switch id="show-labels" checked={mapSettings.showLabels} onCheckedChange={() => toggleSetting('showLabels')} className="scale-75" />
                </div>
            </div>
        </div>
    );
};

export default MapCartographyControls;