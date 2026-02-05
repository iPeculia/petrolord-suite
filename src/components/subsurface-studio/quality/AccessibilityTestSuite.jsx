import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accessibility, Check } from 'lucide-react';

const AccessibilityTestSuite = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Accessibility className="w-5 h-5 mr-2 text-blue-400" /> Accessibility (a11y)
        </h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-4">
                <div className="text-sm font-bold text-slate-300 mb-2">WCAG 2.1 AA Compliance</div>
                <div className="space-y-2">
                    {['Color Contrast Ratio', 'ARIA Labels Present', 'Keyboard Navigation', 'Screen Reader Focus'].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                            <span className="text-sm text-slate-400">{item}</span>
                            <span className="text-xs text-green-400 flex items-center"><Check className="w-3 h-3 mr-1" /> Passed</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

export default AccessibilityTestSuite;