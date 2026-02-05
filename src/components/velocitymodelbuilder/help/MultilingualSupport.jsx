import React from 'react';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const MultilingualSupport = () => {
  return (
    <div className="flex items-center gap-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-8 text-xs">
                    <Globe className="w-3 h-3 mr-2" /> English (US)
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-300">
                <DropdownMenuItem className="text-xs hover:bg-slate-800 cursor-pointer">Español (Spanish)</DropdownMenuItem>
                <DropdownMenuItem className="text-xs hover:bg-slate-800 cursor-pointer">Français (French)</DropdownMenuItem>
                <DropdownMenuItem className="text-xs hover:bg-slate-800 cursor-pointer">Português (Portuguese)</DropdownMenuItem>
                <DropdownMenuItem className="text-xs hover:bg-slate-800 cursor-pointer">Bahasa Indonesia</DropdownMenuItem>
                <DropdownMenuItem className="text-xs hover:bg-slate-800 cursor-pointer">العربية (Arabic)</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
};

export default MultilingualSupport;