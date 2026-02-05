import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const UIComponentLibrary = () => {
    return (
        <div className="p-8 bg-slate-950 min-h-screen text-slate-200 space-y-8">
            <h1 className="text-3xl font-bold mb-8">Design System & Component Library</h1>
            
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-lime-400">Typography</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4 space-y-2">
                            <h1 className="text-4xl font-bold">Heading 1</h1>
                            <h2 className="text-3xl font-bold">Heading 2</h2>
                            <h3 className="text-2xl font-semibold">Heading 3</h3>
                            <p className="text-base text-slate-400">Body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <p className="text-sm text-slate-500">Small text / Metadata</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-blue-400">Buttons</h2>
                <div className="flex flex-wrap gap-4">
                    <Button>Default Button</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-purple-400">Form Elements</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Input Field</label>
                        <Input placeholder="Placeholder text..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Switch Toggle</label>
                        <div className="flex items-center gap-2">
                            <Switch id="demo-switch" />
                            <label htmlFor="demo-switch" className="text-sm text-slate-400">Enable Feature</label>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Slider</label>
                        <Slider defaultValue={[50]} max={100} step={1} />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-amber-400">Status Indicators</h2>
                <div className="flex gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Error</Badge>
                    <Badge variant="outline" className="text-green-400 border-green-800 bg-green-900/20">Success</Badge>
                    <Badge variant="outline" className="text-blue-400 border-blue-800 bg-blue-900/20">Processing</Badge>
                </div>
            </section>
        </div>
    );
};

export default UIComponentLibrary;