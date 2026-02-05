import React from 'react';
import { Printer, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PrintOptimization = () => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                    <Printer className="w-4 h-4 mr-2" /> Report
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-200 w-56">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem onClick={handlePrint} className="cursor-pointer hover:bg-slate-800">
                    <Printer className="w-4 h-4 mr-2" /> Print View
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-slate-800">
                    <FileText className="w-4 h-4 mr-2" /> Generate PDF Report
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-slate-800">
                    <Download className="w-4 h-4 mr-2" /> Export Plots (PNG)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PrintOptimization;