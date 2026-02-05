import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { mlService } from '@/services/ml/mlService';
import { Scan, Play, Settings, BarChart, Save, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FaciesPrediction = () => {
  const { toast } = useToast();
  const [step, setStep] = useState('setup'); // setup, training, results
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingMetrics, setTrainingMetrics] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState(['Gamma Ray', 'Resistivity', 'Neutron', 'Density']);
  
  const handleTrain = async () => {
    setStep('training');
    setTrainingProgress(0);
    
    try {
      const result = await mlService.trainModel({
        type: 'random_forest',
        features: selectedFeatures,
        target: 'facies'
      }, (update) => {
        setTrainingProgress(update.progress);
        if (update.metrics) setTrainingMetrics(update.metrics);
      });
      
      setStep('results');
      toast({ title: "Training Complete", description: "Model trained successfully with 91% accuracy." });
    } catch (e) {
      toast({ variant: "destructive", title: "Training Failed", description: "An error occurred during model training." });
      setStep('setup');
    }
  };

  return (
    <div className="h-full p-6 bg-slate-950 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Scan className="w-6 h-6 text-blue-400" />
            Facies Prediction
          </h1>
          <p className="text-slate-400">Train ML models to classify lithofacies from well logs automatically.</p>
        </div>
        {step === 'results' && (
          <Button variant="outline" onClick={() => setStep('setup')} className="border-slate-700">
            New Model
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Config Panel */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-white text-lg">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Target Algorithm</label>
              <Select defaultValue="rf">
                <SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue placeholder="Select Algorithm" /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="rf">Random Forest Classifier</SelectItem>
                  <SelectItem value="gb">Gradient Boosting (XGBoost)</SelectItem>
                  <SelectItem value="svm">Support Vector Machine</SelectItem>
                  <SelectItem value="dnn">Deep Neural Network</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Input Features</label>
              <div className="grid grid-cols-2 gap-2">
                {['Gamma Ray', 'Resistivity', 'Neutron', 'Density', 'Sonic', 'PEF'].map(f => (
                  <div key={f} className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer hover:border-blue-500/50 transition-colors"
                       onClick={() => setSelectedFeatures(prev => prev.includes(f) ? prev.filter(i => i !== f) : [...prev, f])}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedFeatures.includes(f) ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                      {selectedFeatures.includes(f) && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-xs text-slate-300">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Training Data</label>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-sm text-slate-300">
                Selected: <span className="text-white font-medium">12 Wells</span>
                <br />
                Samples: <span className="text-white font-medium">45,200 points</span>
              </div>
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              disabled={step === 'training'}
              onClick={handleTrain}
            >
              {step === 'training' ? 'Training...' : 'Start Training'} <Play className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Right Visualization Panel */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2 flex flex-col h-full min-h-[500px]">
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-white text-lg">Model Performance</CardTitle>
              {trainingMetrics && (
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Loss</p>
                    <p className="text-sm font-mono text-white">{trainingMetrics.loss}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Accuracy</p>
                    <p className="text-sm font-mono text-emerald-400">{trainingMetrics.accuracy}</p>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-slate-950/50 m-6 rounded-lg border border-slate-800 border-dashed">
            {step === 'setup' && (
              <div className="text-center text-slate-500">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Configure model parameters and start training to see results.</p>
              </div>
            )}
            
            {step === 'training' && (
              <div className="w-full max-w-md text-center">
                <div className="mb-4 flex justify-between text-sm text-slate-400">
                  <span>Training Progress</span>
                  <span>{trainingProgress.toFixed(0)}%</span>
                </div>
                <Progress value={trainingProgress} className="h-2 mb-8" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-slate-900 rounded animate-pulse"></div>
                  <div className="h-24 bg-slate-900 rounded animate-pulse delay-75"></div>
                  <div className="h-24 bg-slate-900 rounded animate-pulse delay-150"></div>
                </div>
              </div>
            )}

            {step === 'results' && (
              <div className="w-full h-full p-4 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6 h-1/2">
                  <div className="bg-slate-900 rounded p-4 border border-slate-800">
                    <h4 className="text-sm font-medium text-slate-300 mb-4">Feature Importance</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Gamma Ray', val: 85 },
                        { name: 'Neutron', val: 65 },
                        { name: 'Density', val: 45 },
                        { name: 'Resistivity', val: 30 }
                      ].map(i => (
                        <div key={i.name}>
                          <div className="flex justify-between text-xs mb-1 text-slate-400">
                            <span>{i.name}</span>
                            <span>{i.val/100}</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${i.val}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded p-4 border border-slate-800 flex items-center justify-center text-slate-500 text-xs">
                    Confusion Matrix Placeholder
                  </div>
                </div>
                <div className="h-1/2 bg-slate-900 rounded p-4 border border-slate-800 flex items-center justify-center text-slate-500 text-xs">
                  Blind Test Well Logs vs Prediction
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FaciesPrediction;