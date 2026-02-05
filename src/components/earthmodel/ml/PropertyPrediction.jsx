import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, TrendingUp, Activity } from 'lucide-react';

const PropertyPrediction = () => {
  const [targetProperty, setTargetProperty] = useState('porosity');

  return (
    <div className="h-full p-6 bg-slate-950 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            Property Prediction
          </h1>
          <p className="text-slate-400">Predict continuous reservoir properties using regression models.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Config */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-1 h-fit">
          <CardHeader><CardTitle className="text-white text-base">Parameters</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Target Property</label>
              <Select value={targetProperty} onValueChange={setTargetProperty}>
                <SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="porosity">Porosity (PHI)</SelectItem>
                  <SelectItem value="permeability">Permeability (K)</SelectItem>
                  <SelectItem value="saturation">Water Saturation (Sw)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Model Type</label>
              <Select defaultValue="xgb">
                <SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="linear">Linear Regression</SelectItem>
                  <SelectItem value="xgb">XGBoost Regressor</SelectItem>
                  <SelectItem value="lstm">LSTM Network</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Train Regressor</Button>
          </CardContent>
        </Card>

        {/* Main Viz */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-3 flex flex-col h-full min-h-[500px]">
          <CardHeader>
            <CardTitle className="text-white text-base">Correlation Analysis</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500">
                <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
                <span>Predicted vs Measured</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500">
                <Activity className="w-8 h-8 mb-2 opacity-50" />
                <span>Residual Plot</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyPrediction;