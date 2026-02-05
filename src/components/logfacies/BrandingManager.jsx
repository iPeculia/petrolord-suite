import React from 'react';
import { Image, Palette, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BrandingManager = () => {
    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                    <Palette className="w-4 h-4 text-purple-400" /> Report Branding
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800/50 transition-colors h-32">
                        <Image className="w-8 h-8 text-slate-500 mb-2" />
                        <span className="text-xs text-slate-400">Click to upload PNG/SVG</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded bg-blue-600 border border-white/20"></div>
                            <Input className="bg-slate-950" defaultValue="#2563EB" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Secondary Color</Label>
                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded bg-slate-800 border border-white/20"></div>
                            <Input className="bg-slate-950" defaultValue="#1E293B" />
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full">Reset to Defaults</Button>
            </CardContent>
        </Card>
    );
};

export default BrandingManager;