import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const RiskAssessmentGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-yellow-400"/> Risk Assessment Workflows
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">Depth Uncertainty Risk</h3>
                <p className="text-sm text-slate-400">
                    The risk that the target structure is deeper or shallower than mapped.
                    <br/><strong>Quantification:</strong> Use the standard deviation of residuals at blind wells.
                </p>
            </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">Spill Point Risk</h3>
                <p className="text-sm text-slate-400">
                    Small depth errors can "open" a trap's spill point, destroying the prospect's volume.
                    <br/><strong>Workflow:</strong> Run P10/P50/P90 depth maps and checking spill point integrity on all cases.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskAssessmentGuide;