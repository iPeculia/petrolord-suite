import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarPlus as CalendarIcon, Save, X } from 'lucide-react';
import { differenceInDays } from 'date-fns';

const ScheduleForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        id: Date.now(),
        name: '',
        type: 'Engineering',
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
        duration: 0,
        progress: 0,
        description: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData });
        }
    }, [initialData]);

    useEffect(() => {
        // Auto calc duration
        if (formData.start && formData.end) {
            const start = new Date(formData.start);
            const end = new Date(formData.end);
            const diff = differenceInDays(end, start);
            if (diff >= 0) {
                setFormData(prev => ({ ...prev, duration: diff }));
            }
        }
    }, [formData.start, formData.end]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Card className="bg-slate-900 border-slate-800 max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-white flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-purple-400" />
                    {initialData ? 'Edit Activity' : 'New Activity'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Activity Name</Label>
                            <Input 
                                value={formData.name} 
                                onChange={(e) => handleChange('name', e.target.value)} 
                                placeholder="e.g., FEED Study"
                                required
                                className="bg-slate-800 border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select 
                                value={formData.type} 
                                onValueChange={(v) => handleChange('type', v)}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Procurement">Procurement</SelectItem>
                                    <SelectItem value="Fabrication">Fabrication</SelectItem>
                                    <SelectItem value="Drilling">Drilling</SelectItem>
                                    <SelectItem value="Installation">Installation</SelectItem>
                                    <SelectItem value="Commissioning">Commissioning</SelectItem>
                                    <SelectItem value="Milestone">Milestone</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input 
                                type="date"
                                value={formData.start} 
                                onChange={(e) => handleChange('start', e.target.value)} 
                                className="bg-slate-800 border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input 
                                type="date"
                                value={formData.end} 
                                onChange={(e) => handleChange('end', e.target.value)} 
                                className="bg-slate-800 border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Duration (Days)</Label>
                            <Input 
                                type="number"
                                value={formData.duration} 
                                readOnly
                                className="bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Progress (%)</Label>
                        <div className="flex items-center gap-4">
                            <Input 
                                type="range"
                                min="0"
                                max="100"
                                value={formData.progress}
                                onChange={(e) => handleChange('progress', parseInt(e.target.value))}
                                className="flex-1"
                            />
                            <span className="w-12 text-right font-mono text-white">{formData.progress}%</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-400 hover:text-white">
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                            <Save className="w-4 h-4 mr-2" /> Save Activity
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ScheduleForm;