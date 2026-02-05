import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Paintbrush, Save, RotateCcw, Palette } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ThemeCustomizationPanel = () => {
    const { toast } = useToast();
    const [primaryColor, setPrimaryColor] = useState('#06b6d4');
    const [secondaryColor, setSecondaryColor] = useState('#64748b');
    const [radius, setRadius] = useState([0.5]);
    const [fontSize, setFontSize] = useState([14]);

    const handleSave = () => {
        toast({ title: "Theme Saved", description: "Your custom theme has been applied globally." });
        // In a real app, this would update a React Context or CSS variables
        document.documentElement.style.setProperty('--primary', primaryColor);
        document.documentElement.style.setProperty('--radius', `${radius[0]}rem`);
    };

    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <Palette className="w-5 h-5 mr-2 text-cyan-400" /> Theme Studio
                </h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setPrimaryColor('#06b6d4'); setRadius([0.5]); }}>
                        <RotateCcw className="w-4 h-4 mr-2" /> Reset
                    </Button>
                    <Button size="sm" onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700">
                        <Save className="w-4 h-4 mr-2" /> Save Theme
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-300">Color Palette</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-400">Primary Brand Color</Label>
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 rounded border border-slate-700" style={{ backgroundColor: primaryColor }}></div>
                                <Input 
                                    type="color" 
                                    value={primaryColor} 
                                    onChange={(e) => setPrimaryColor(e.target.value)} 
                                    className="w-24 h-8 p-1 bg-slate-900 border-slate-800" 
                                />
                                <span className="text-xs font-mono text-slate-500">{primaryColor}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-400">Secondary / Muted</Label>
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 rounded border border-slate-700" style={{ backgroundColor: secondaryColor }}></div>
                                <Input 
                                    type="color" 
                                    value={secondaryColor} 
                                    onChange={(e) => setSecondaryColor(e.target.value)} 
                                    className="w-24 h-8 p-1 bg-slate-900 border-slate-800" 
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-300">Typography & Shape</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs text-slate-400">
                                <Label>Border Radius</Label>
                                <span>{radius[0]} rem</span>
                            </div>
                            <Slider value={radius} onValueChange={setRadius} min={0} max={1.5} step={0.1} />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs text-slate-400">
                                <Label>Base Font Size</Label>
                                <span>{fontSize[0]} px</span>
                            </div>
                            <Slider value={fontSize} onValueChange={setFontSize} min={12} max={18} step={1} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-300">Live Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-6 rounded-lg border border-slate-800 bg-slate-900 flex flex-col gap-4" style={{ borderRadius: `${radius[0]}rem` }}>
                            <h4 className="text-lg font-bold text-white">Component Preview</h4>
                            <p className="text-slate-400 text-sm">This is how your UI elements will look.</p>
                            <div className="flex gap-4">
                                <Button style={{ backgroundColor: primaryColor, borderRadius: `${radius[0]}rem` }}>Primary Action</Button>
                                <Button variant="secondary" style={{ borderRadius: `${radius[0]}rem` }}>Secondary</Button>
                                <Button variant="outline" style={{ borderRadius: `${radius[0]}rem`, borderColor: primaryColor, color: primaryColor }}>Outline</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ThemeCustomizationPanel;