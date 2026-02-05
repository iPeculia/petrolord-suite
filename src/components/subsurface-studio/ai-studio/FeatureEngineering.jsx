import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TableProperties } from 'lucide-react';

const FeatureEngineering = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <TableProperties className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Feature Store</h3>
            <p className="text-sm text-slate-500 mt-2">Manage engineered features and embeddings.</p>
            <div className="mt-4 text-xs font-mono text-slate-400 bg-slate-900 p-2 rounded inline-block">
                fs.get_feature("gamma_ray_normalized")
            </div>
        </CardContent>
    </Card>
);

export default FeatureEngineering;