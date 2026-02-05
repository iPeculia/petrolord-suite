import React, { useState, useEffect } from 'react';
import { useStudio } from '@/contexts/StudioContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const wellTypes = ['OIL', 'GAS', 'WATER', 'INJECTOR', 'WATER_DISPOSAL', 'DRY', 'ABANDONED'];

const WellHeaderCard = ({ well }) => {
    const { setAllAssets } = useStudio();
    const { toast } = useToast();
    const [wellData, setWellData] = useState({
        name: well.name,
        well_type: well.meta?.well_type || 'OIL',
        well_color: well.meta?.well_color || '#D32F2F',
        location: well.meta?.location || [0, 0],
        kb: well.meta?.kb || 0,
    });
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setWellData({
            name: well.name,
            well_type: well.meta?.well_type || 'OIL',
            well_color: well.meta?.well_color || '#D32F2F',
            location: well.meta?.location || [0, 0],
            kb: well.meta?.kb || 0,
        });
        setIsDirty(false);
    }, [well]);

    const handleChange = (field, value) => {
        setWellData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleLocationChange = (index, value) => {
        const newLocation = [...wellData.location];
        newLocation[index] = parseFloat(value) || 0;
        handleChange('location', newLocation);
    };

    const handleSave = async () => {
        const updatedMeta = {
            ...well.meta,
            well_type: wellData.well_type,
            well_color: wellData.well_color,
            location: wellData.location,
            kb: parseFloat(wellData.kb),
        };

        const { data, error } = await supabase
            .from('ss_assets')
            .update({ name: wellData.name, meta: updatedMeta })
            .eq('id', well.id)
            .select()
            .single();

        if (error) {
            toast({ variant: 'destructive', title: 'Failed to update well', description: error.message });
        } else {
            setAllAssets(prev => prev.map(a => (a.id === well.id ? data : a)));
            toast({ title: 'Well updated successfully!' });
            setIsDirty(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Well Header</CardTitle>
                <CardDescription>Edit properties for {well.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="well-name">Well Name</Label>
                    <Input id="well-name" value={wellData.name} onChange={(e) => handleChange('name', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="well-type">Well Type</Label>
                        <Select value={wellData.well_type} onValueChange={(v) => handleChange('well_type', v)}>
                            <SelectTrigger id="well-type"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {wellTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="well-color">Symbol Color</Label>
                        <Input id="well-color" type="color" value={wellData.well_color} onChange={(e) => handleChange('well_color', e.target.value)} className="p-1 h-10" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="well-lat">Latitude (Y)</Label>
                        <Input id="well-lat" type="number" value={wellData.location[0]} onChange={(e) => handleLocationChange(0, e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="well-lon">Longitude (X)</Label>
                        <Input id="well-lon" type="number" value={wellData.location[1]} onChange={(e) => handleLocationChange(1, e.target.value)} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="well-kb">KB Elevation</Label>
                    <Input id="well-kb" type="number" value={wellData.kb} onChange={(e) => handleChange('kb', e.target.value)} />
                </div>
                {isDirty && (
                    <Button onClick={handleSave} className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default WellHeaderCard;