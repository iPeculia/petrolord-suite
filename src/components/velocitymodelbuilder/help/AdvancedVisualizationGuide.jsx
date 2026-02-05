import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Box, Eye } from 'lucide-react';

const AdvancedVisualizationGuide = () => {
  return (
    <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Advanced Visualization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 flex gap-4">
                    <Box className="w-8 h-8 text-purple-400 flex-shrink-0" />
                    <div>
                        <h4 className="text-white font-medium mb-1">3D Velocity Cubes</h4>
                        <p className="text-sm text-slate-400">
                            Slice and dice your Vint or Vavg volumes in the 3D viewer. Use opacity rendering to isolate high-velocity salt bodies or low-velocity gas clouds.
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 flex gap-4">
                    <Eye className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    <div>
                        <h4 className="text-white font-medium mb-1">Residual Maps</h4>
                        <p className="text-sm text-slate-400">
                            Visualize the difference between your model and well tops (Z_model - Z_actual) as a heatmap to quickly identify outliers or regional trends.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default AdvancedVisualizationGuide;