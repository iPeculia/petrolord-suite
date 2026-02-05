import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Database, FileOutput } from 'lucide-react';
import { exportData } from '@/utils/dataExporters';
import { formatResultsForExport } from '@/utils/dataFormatConverters';

const DataExportPanel = ({ data }) => {
    const [format, setFormat] = React.useState('CSV');

    const handleExport = () => {
        const formattedData = formatResultsForExport(data);
        exportData(format, formattedData, 'ppfg_results');
    };

    return (
        <div className="space-y-6 p-4 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-slate-200">Raw Data Export</h3>
            </div>

            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Export Format</Label>
                <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger className="bg-slate-950 border-slate-700 h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="CSV">CSV (Excel Compatible)</SelectItem>
                        <SelectItem value="LAS">LAS 2.0 (Well Logs)</SelectItem>
                        <SelectItem value="JSON">JSON (Raw Data)</SelectItem>
                        <SelectItem value="Excel">Excel Workbook (.xlsx)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                onClick={handleExport}
            >
                <FileOutput className="w-4 h-4 mr-2" /> Download Data
            </Button>
        </div>
    );
};

export default DataExportPanel;