import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Trash2, Eye, Layers, Download, Check, AlertCircle, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { processGridFile } from '@/utils/quickvolCalculations';
import { generateGrid } from '@/utils/gridding';
import LoadContourProjectModal from './LoadContourProjectModal';

const SurfaceManager = ({ surfaces, setSurfaces }) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
  };

  const processFiles = async (files) => {
    setLoading(true);
    try {
      for (const file of files) {
        const grid = await processGridFile(file);
        addSurface({
          name: file.name.split('.')[0],
          source: 'upload',
          format: file.name.split('.').pop().toUpperCase(),
          grid: grid,
          quality: 'Good', // Placeholder for validation logic
          timestamp: new Date().toISOString()
        });
      }
      toast({ title: "Surfaces Uploaded", description: `Successfully processed ${files.length} file(s).` });
    } catch (error) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleImportProject = async (project) => {
    setLoading(true);
    try {
      // Regenerate grid from contours (simplified assumption: project has contours)
      // In a real app, we might fetch the raw points or saved grid JSON
      if (!project.contours || (!project.contours.contours?.length && !project.contours.faults?.length)) {
         throw new Error("Project has no contour data.");
      }
      
      // Flatten contours to points for gridding
      const points = [];
      project.contours.contours.forEach(line => {
         if (line.value !== null) {
             line.points.forEach(pt => points.push({ x: pt[0], y: pt[1], z: line.value }));
         }
      });

      if (points.length < 3) throw new Error("Insufficient data points in project to generate grid.");

      // Assume a default size or use project metadata if available
      // Ideally we map pixels to world coordinates if georeferenced, but for now we use raw values
      const width = 1000; // arbitrary default canvas width reference
      const height = 1000;
      const cellSize = project.grid_cell_size || 20;
      
      const grid = await generateGrid(points, width, height, cellSize, project.gridding_method || 'idw', toast);
      
      if (grid) {
          // Transform simple x,y,z arrays to the structure QuickVol expects
           const gridObj = {
              metadata: {
                  width: grid.x.length,
                  height: grid.y.length,
                  x0: grid.x[0],
                  y0: grid.y[0],
                  dx: cellSize,
                  dy: cellSize,
                  nodata_value: null
              },
              data: grid.z.flat() // Flatten 2D array to 1D
          };

          addSurface({
              name: project.project_name,
              source: 'petrolord_import',
              format: 'PROJECT',
              grid: gridObj,
              quality: 'Imported',
              timestamp: new Date().toISOString()
          });
          toast({ title: "Import Successful", description: `Imported grid from ${project.project_name}` });
      }
    } catch (error) {
      toast({ title: "Import Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addSurface = (surface) => {
    setSurfaces(prev => [...prev, { ...surface, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const deleteSurface = (id) => {
    setSurfaces(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <LoadContourProjectModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onProjectSelect={handleImportProject} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Area */}
        <Card className={`col-span-2 border-2 border-dashed transition-colors ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 bg-slate-900/50'}`}>
          <div 
            className="h-48 flex flex-col items-center justify-center text-slate-400 cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('surface-upload').click()}
          >
            <input type="file" id="surface-upload" multiple className="hidden" accept=".csv,.txt,.dat,.grd,.json" onChange={handleFileInput} />
            {loading ? (
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-2"></div>
                    <p>Processing Grid...</p>
                </div>
            ) : (
                <>
                    <Upload className="w-10 h-10 mb-4 text-slate-500" />
                    <p className="text-lg font-medium text-slate-300">Drop surface files here or click to upload</p>
                    <p className="text-sm text-slate-500 mt-1">Supports ASCII Grid, ZMAP, CSV, JSON</p>
                </>
            )}
          </div>
        </Card>

        {/* Integration Panel */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Import Surface</CardTitle>
            <CardDescription>From Petrolord Suite</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Button variant="outline" className="w-full justify-start" onClick={() => setIsImportModalOpen(true)}>
                <Layers className="w-4 h-4 mr-2 text-lime-400" />
                Contour Digitizer Project
             </Button>
             <Button variant="outline" className="w-full justify-start" disabled>
                <Grid className="w-4 h-4 mr-2 text-blue-400" />
                Subsurface Studio (Coming Soon)
             </Button>
          </CardContent>
        </Card>
      </div>

      {/* Surface List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle>Surface Library</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border border-slate-800 overflow-hidden">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="bg-slate-950 text-slate-300 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Format</th>
                            <th className="px-4 py-3">Source</th>
                            <th className="px-4 py-3">Grid Dims</th>
                            <th className="px-4 py-3">Quality</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {surfaces.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8 text-slate-500">No surfaces loaded.</td></tr>
                        ) : (
                            surfaces.map(surface => (
                                <tr key={surface.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-400" />
                                        {surface.name}
                                    </td>
                                    <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{surface.format}</Badge></td>
                                    <td className="px-4 py-3 capitalize">{surface.source}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{surface.grid.metadata.width}x{surface.grid.metadata.height}</td>
                                    <td className="px-4 py-3">
                                        <span className="flex items-center text-green-400 text-xs"><Check className="w-3 h-3 mr-1" /> Verified</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white"><Eye className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => deleteSurface(surface.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurfaceManager;