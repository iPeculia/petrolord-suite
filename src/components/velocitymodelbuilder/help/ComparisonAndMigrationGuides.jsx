import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftRight } from 'lucide-react';

const ComparisonAndMigrationGuides = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" /> Migration & Comparison
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-white text-base">Migrating from Petrel</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-400 space-y-2">
                    <p>We support direct import of Petrel velocity functions (*.vf) and grid formats.</p>
                    <p><strong>Key difference:</strong> We use dynamic "On-the-fly" modeling rather than static pillar grids, allowing for faster updates when new wells are added.</p>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-white text-base">Migrating from Kingdom</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-400 space-y-2">
                    <p>Simply export your TD charts as CSV and grids as ZMap. Our "Smart Curve Detector" will auto-identify the relevant columns.</p>
                    <p><strong>Note:</strong> Ensure your Kingdom project CRS matches the Petrolord project CRS to avoid XY shifts.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default ComparisonAndMigrationGuides;