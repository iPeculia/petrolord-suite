import React from 'react';
import ExcelLikeTable from '@/components/PetroleumEconomicsStudio/ExcelLikeTable';
import { usePetroleumEconomics } from '../contexts/PetroleumEconomicsContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const CostsTab = () => {
  const { costData, setCostData, modelSettings } = usePetroleumEconomics();

  // Columns for CAPEX/OPEX profiles (Yearly)
  // Note: This is a simplified view. Ideally, we have buckets.
  // For Phase 2, we will enable a simple yearly table for TOTAL CAPEX and TOTAL OPEX
  // or breakdown by categories if data structure allows.
  
  const capexColumns = [
    { key: 'year', title: 'Year', readOnly: true, width: '80px', type: 'number' },
    { key: 'drilling_capex', title: 'Drilling', width: '120px', type: 'number', formatter: v => v?.toLocaleString() },
    { key: 'facilities_capex', title: 'Facilities', width: '120px', type: 'number', formatter: v => v?.toLocaleString() },
    { key: 'abandonment_capex', title: 'Abandonment', width: '120px', type: 'number', formatter: v => v?.toLocaleString() },
    { key: 'other_capex', title: 'Other', width: '120px', type: 'number', formatter: v => v?.toLocaleString() },
    { key: 'notes', title: 'Notes', width: '200px' }
  ];

  const opexColumns = [
    { key: 'year', title: 'Year', readOnly: true, width: '80px', type: 'number' },
    { key: 'fixed_opex', title: 'Fixed ($/yr)', width: '120px', type: 'number', formatter: v => v?.toLocaleString() },
    { key: 'variable_oil', title: 'Var. Oil ($/bbl)', width: '120px', type: 'number', formatter: v => v?.toFixed(2) },
    { key: 'variable_gas', title: 'Var. Gas ($/Mcf)', width: '120px', type: 'number', formatter: v => v?.toFixed(2) },
    { key: 'variable_water', title: 'Water Disp. ($/bbl)', width: '120px', type: 'number', formatter: v => v?.toFixed(2) },
    { key: 'notes', title: 'Notes', width: '200px' }
  ];

  // Helper to ensure cost data rows exist for all model years
  // In a real app this would be more robust in the context/hook
  
  return (
    <div className="h-full flex flex-col space-y-4">
      <Tabs defaultValue="capex" className="flex-1 flex flex-col">
        <div className="flex justify-between px-1">
            <TabsList className="bg-slate-800">
                <TabsTrigger value="capex">Capital Expenditures (CAPEX)</TabsTrigger>
                <TabsTrigger value="opex">Operating Expenditures (OPEX)</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800">
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
            </div>
        </div>

        <Card className="flex-1 bg-slate-900 border-slate-800 mt-4 overflow-hidden relative">
            <TabsContent value="capex" className="absolute inset-0 p-4 mt-0">
                <ExcelLikeTable 
                    columns={capexColumns}
                    data={costData.capexProfile || []}
                    onDataChange={(newData) => setCostData(prev => ({ ...prev, capexProfile: newData }))}
                    rowKey="year"
                />
            </TabsContent>
            <TabsContent value="opex" className="absolute inset-0 p-4 mt-0">
                <ExcelLikeTable 
                    columns={opexColumns}
                    data={costData.opexProfile || []}
                    onDataChange={(newData) => setCostData(prev => ({ ...prev, opexProfile: newData }))}
                    rowKey="year"
                />
            </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default CostsTab;