import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Grid, Download } from 'lucide-react';

const StandardGridExporter = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Grid className="w-4 h-4 text-emerald-400" /> Generic Grid Export
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
         <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Output Format</Label>
                <Select defaultValue="geotiff">
                    <SelectTrigger className="h-8 bg-slate-950 border-slate-700 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="geotiff">GeoTIFF (32-bit Float)</SelectItem>
                        <SelectItem value="netcdf">NetCDF (CF-Compliant)</SelectItem>
                        <SelectItem value="hdf5">HDF5</SelectItem>
                        <SelectItem value="xyz">ASCII XYZ Grid</SelectItem>
                        <SelectItem value="zmap">ZMAP Plus</SelectItem>
                        <SelectItem value="cps3">CPS-3 ASCII</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Grid Resolution (m)</Label>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500">X Step</span>
                        <Input className="h-8 bg-slate-950 border-slate-700 text-xs" defaultValue="25.0" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500">Y Step</span>
                        <Input className="h-8 bg-slate-950 border-slate-700 text-xs" defaultValue="25.0" />
                    </div>
                </div>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="flex justify-between">
                    <span>CRS:</span>
                    <span className="text-emerald-400">EPSG:32631</span>
                </div>
                <div className="flex justify-between">
                    <span>Origin X:</span>
                    <span>452000</span>
                </div>
                <div className="flex justify-between">
                    <span>Origin Y:</span>
                    <span>6780000</span>
                </div>
            </div>
         </div>

         <div className="pt-2 border-t border-slate-800">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 h-9 text-xs">
                <Download className="w-3 h-3 mr-2" /> Export Grids
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StandardGridExporter;