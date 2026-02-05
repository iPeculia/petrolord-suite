import React from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

const templates = [
  {
    id: 't1',
    name: "Vertical Well - Rotary",
    description: "Standard assembly for vertical drilling",
    drillPipe: { size: 5.0, grade: 'E-75', weight: 19.5 },
    hwdp: { size: 5.0, weight: 49.5, count: 2 },
    drillCollars: { od: 6.75, weight: 147, count: 4 },
    toolJoints: { od: 6.5, length: 0.5 },
    rpm: { min: 100, max: 150 }
  },
  {
    id: 't2',
    name: "Deviated Well - Rotary",
    description: "Stiff assembly for build sections",
    drillPipe: { size: 5.0, grade: 'S-135', weight: 19.5 },
    hwdp: { size: 5.0, weight: 49.5, count: 6 },
    drillCollars: { od: 6.75, weight: 147, count: 6 },
    toolJoints: { od: 6.5, length: 0.5 },
    rpm: { min: 80, max: 120 }
  },
  {
    id: 't3',
    name: "High Angle - Sliding",
    description: "Steerable motor assembly",
    drillPipe: { size: 5.0, grade: 'S-135', weight: 19.5 },
    hwdp: { size: 5.0, weight: 49.5, count: 12 },
    drillCollars: { od: 6.5, weight: 100, count: 2 }, // Reduced collars
    toolJoints: { od: 6.375, length: 0.5 },
    rpm: { min: 30, max: 60 } // Top drive rpm
  },
  {
    id: 't4',
    name: "Horizontal - Rotary",
    description: "Rotary steerable system (RSS)",
    drillPipe: { size: 5.0, grade: 'S-135', weight: 19.5 },
    hwdp: { size: 5.0, weight: 49.5, count: 15 },
    drillCollars: { od: 6.75, weight: 147, count: 0 }, // Often fewer collars
    toolJoints: { od: 6.625, length: 0.5 },
    rpm: { min: 80, max: 140 }
  }
];

const BHATemplates = () => {
  const { operationParams, applyBHATemplate } = useCasingWearAnalyzer();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {templates.map((template) => {
        const isActive = operationParams.bhaName === template.name;
        return (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all border ${
              isActive 
                ? 'bg-amber-500/10 border-amber-500' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-600'
            }`}
            onClick={() => applyBHATemplate(template)}
          >
            <CardContent className="p-4 relative">
              {isActive && (
                <div className="absolute top-2 right-2 text-amber-500">
                  <Check className="w-4 h-4" />
                </div>
              )}
              <div className="font-bold text-sm text-slate-200 mb-1">{template.name}</div>
              <div className="text-xs text-slate-500 mb-3">{template.description}</div>
              <div className="space-y-1 text-[10px] text-slate-400">
                <div className="flex justify-between">
                  <span>DP:</span>
                  <span className="text-slate-300">{template.drillPipe.size}" {template.drillPipe.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span>HWDP:</span>
                  <span className="text-slate-300">{template.hwdp.count} jts</span>
                </div>
                <div className="flex justify-between">
                  <span>Collars:</span>
                  <span className="text-slate-300">{template.drillCollars.count} jts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BHATemplates;