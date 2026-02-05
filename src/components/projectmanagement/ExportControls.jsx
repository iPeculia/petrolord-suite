import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download } from 'lucide-react';
import { exportToExcel, exportToPdf } from '@/utils/exportUtils';

const ExportControls = ({ data, columns, fileName, title }) => {
  if (!data || data.length === 0) return null;

  const handleExportExcel = () => {
    const exportData = data.map(row => {
        const newRow = {};
        columns.forEach(col => {
            newRow[col.header] = row[col.accessor];
        });
        return newRow;
    });
    exportToExcel(exportData, fileName);
  };

  const handleExportPdf = () => {
    exportToPdf(columns, data, fileName, title);
  };

  return (
    <div className="flex justify-end mb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
          <DropdownMenuItem onSelect={handleExportExcel} className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">Export as Excel (.xlsx)</DropdownMenuItem>
          <DropdownMenuItem onSelect={handleExportPdf} className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">Export as PDF</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ExportControls;