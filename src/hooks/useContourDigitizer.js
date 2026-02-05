import { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/customSupabaseClient';
import { exportToGeoJSON, exportToDXF, exportToCSV } from '@/utils/exportUtils';
import { generateGrid } from '@/utils/gridding';
import { useOpenCv } from '@/hooks/useOpenCv';
import { processImageWithOpenCv, dp } from '@/utils/digitizerOpenCv';
import { useIntegration } from '@/contexts/IntegrationContext';

const useContourDigitizer = (toast) => {
  const { dispatch } = useIntegration();
  const [state, setState] = useState({
    id: null,
    imageFile: null,
    imagePreview: null,
    imageDimensions: { width: 0, height: 0 },
    projectName: '',
    projects: [],
    controlPoints: [],
    geoTransform: null,
    pixelToWorld: null,
    layers: { contours: [], faults: [] },
    activeLayer: 'contours',
    drawMode: 'none',
    currentLine: [],
    gridCellSize: 50,
    griddingMethod: 'idw',
    results: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const imgCanvasRef = useRef(null);
  const ovrCanvasRef = useRef(null);
  const jobRef = useRef({ cancelled: false });
  const { isCvReady } = useOpenCv();

  const fetchProjects = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('contour_projects')
      .select('id, project_name, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error fetching projects', description: error.message, variant: 'destructive' });
    } else {
      setState(p => ({ ...p, projects: data || [] }));
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleFileUpload = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setState(p => ({
            ...p,
            id: null,
            imageFile: file,
            imagePreview: e.target.result,
            imageDimensions: { width: img.width, height: img.height },
            projectName: file.name.split('.').slice(0, -1).join('.'),
            controlPoints: [],
            geoTransform: null,
            pixelToWorld: null,
            layers: { contours: [], faults: [] },
            results: null,
          }));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleGeoref = useCallback(() => {
    const validPoints = state.controlPoints.filter(p => p.pixel[0] !== null && p.world[0] !== null && p.world[1] !== null);
    if (validPoints.length < 3) {
      toast({ title: 'Georeferencing Failed', description: 'At least 3 valid control points are required.', variant: 'destructive' });
      return;
    }
    
    const p1 = validPoints[0];
    const p2 = validPoints[1];
    
    const scaleX = (p2.world[0] - p1.world[0]) / (p2.pixel[0] - p1.pixel[0]);
    const scaleY = (p2.world[1] - p1.world[1]) / (p2.pixel[1] - p1.pixel[1]);
    const translateX = p1.world[0] - p1.pixel[0] * scaleX;
    const translateY = p1.world[1] - p1.pixel[1] * scaleY;

    const geoTransform = { a: scaleX, b: 0, c: translateX, d: 0, e: scaleY, f: translateY };
    
    const pixelToWorld = (px, py) => [
        geoTransform.a * px + geoTransform.c,
        geoTransform.e * py + geoTransform.f
    ];

    setState(p => ({ ...p, geoTransform, pixelToWorld }));
    toast({ title: 'Georeferencing Set', description: 'Transformation has been calculated.' });
  }, [state.controlPoints, toast]);

  const handleAutoTrace = useCallback(async (box) => {
    if (!state.imagePreview) {
      toast({ title: 'No Image', description: 'Please upload an image first.', variant: 'destructive' });
      return;
    }
    if (!isCvReady) {
      toast({ title: 'OpenCV Not Ready', description: 'The image processing library is still loading. Please wait.', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    jobRef.current.cancelled = false;
    
    try {
      const onProgress = (prog, text) => {
        setStatus(`${text} (${Math.round(prog)}%)`);
      };

      const imageElement = new Image();
      imageElement.src = state.imagePreview;
      await new Promise(resolve => imageElement.onload = resolve);
      
      const roiRect = { x1: box.startX, y1: box.startY, x2: box.startX + box.w, y2: box.startY + box.h };
      const settings = { TOL: 1.0 };

      const points = await processImageWithOpenCv(imageElement, roiRect, settings, jobRef, onProgress);
      if (!points || jobRef.current.cancelled) {
        if (!jobRef.current.cancelled) toast({ title: 'Trace Cancelled or Failed', variant: 'destructive' });
        return;
      }
      
      const simplifiedPoints = dp(points, 2);
      
      const newLines = [{
        id: uuidv4(),
        points: simplifiedPoints,
        value: null,
      }];

      setState(p => ({
        ...p,
        layers: {
          ...p.layers,
          [p.activeLayer]: [...p.layers[p.activeLayer], ...newLines],
        },
        drawMode: 'none',
      }));
      
      // Integration Event
      if (dispatch) {
          dispatch({
            type: 'BROADCAST_EVENT',
            payload: { 
                event: 'CONTOUR_DATA_ADDED', 
                app: 'contour-digitizer', 
                data: { count: newLines.length, layer: state.activeLayer }
            }
          });
      }
      
      toast({ title: 'AI Trace Complete', description: `${newLines.length} line was digitized.` });
    } catch (error) {
      toast({ title: 'AI Trace Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
      setStatus('');
    }
  }, [state.imagePreview, state.activeLayer, isCvReady, toast, dispatch]);

  const handleManualDraw = useCallback((points) => {
    if (points.length < 2) return;
    const newLine = { id: uuidv4(), points, value: null };
    setState(p => ({
      ...p,
      layers: {
        ...p.layers,
        [p.activeLayer]: [...p.layers[p.activeLayer], newLine],
      },
    }));
  }, [state.activeLayer]);

  const handleDeleteLine = useCallback((id) => {
    setState(p => ({
      ...p,
      layers: {
        contours: p.layers.contours.filter(l => l.id !== id),
        faults: p.layers.faults.filter(l => l.id !== id),
      },
    }));
  }, []);

  const handleSetLineValue = useCallback((id, value) => {
    const val = value === '' ? null : parseFloat(value);
    setState(p => ({
      ...p,
      layers: {
        contours: p.layers.contours.map(l => l.id === id ? { ...l, value: val } : l),
        faults: p.layers.faults.map(l => l.id === id ? { ...l, value: val } : l),
      },
    }));
  }, []);

  const handleGrid = useCallback(async () => {
    setIsProcessing(true);
    setStatus('Generating 3D grid...');
    try {
      const contourLines = state.layers.contours.filter(l => l.value !== null && l.points.length > 0);
      if (contourLines.length < 2) {
        toast({ title: 'Not enough data', description: 'Need at least 2 contours with depth values to generate a grid.', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }

      const allPoints = contourLines.flatMap(line =>
        line.points.map(p => ({ x: p[0], y: p[1], z: line.value }))
      );

      const grid = await generateGrid(
        allPoints,
        state.imageDimensions.width,
        state.imageDimensions.height,
        state.gridCellSize,
        state.griddingMethod,
        toast
      );
      
      if (grid) {
        setState(p => ({ ...p, results: { ...p.results, grid } }));
        
        if (dispatch) {
            dispatch({
                type: 'BROADCAST_EVENT',
                payload: { 
                    event: 'SURFACE_GRID_GENERATED', 
                    app: 'contour-digitizer', 
                    data: { 
                        projectName: state.projectName, 
                        gridDims: { rows: grid.y.length, cols: grid.x.length } 
                    }
                }
            });
        }
        
        toast({ title: 'Grid Generated', description: `3D surface grid created with ${state.griddingMethod.toUpperCase()}.` });
      }
    } catch (error) {
      toast({ title: 'Grid Generation Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
      setStatus('');
    }
  }, [state.layers.contours, state.imageDimensions, state.gridCellSize, state.griddingMethod, state.projectName, toast, dispatch]);

  const handleSaveProject = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Not logged in', description: 'You must be logged in to save projects.', variant: 'destructive' });
      return;
    }
    if (!state.projectName) {
      toast({ title: 'Project Name Required', description: 'Please enter a name for your project.', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    setStatus('Saving project...');

    try {
      let imageUrl = state.map_image_url || null;
      
      // Use pta-uploads bucket instead of contour-maps
      if (state.imageFile && !state.map_image_url) {
        const filePath = `contour_maps/${user.id}/${uuidv4()}_${state.imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('pta-uploads')
          .upload(filePath, state.imageFile);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage.from('pta-uploads').getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      const projectData = {
        user_id: user.id,
        project_name: state.projectName,
        map_name: state.imageFile?.name || 'Unknown Map',
        map_image_url: imageUrl,
        geo_points: state.controlPoints,
        contours: state.layers,
        grid_cell_size: state.gridCellSize,
        gridding_method: state.griddingMethod,
      };

      const { data: savedData, error } = await supabase
        .from('contour_projects')
        .upsert({ ...projectData, id: state.id }, { onConflict: 'id' })
        .select()
        .single();
        
      if (error) throw error;

      setState(p => ({...p, id: savedData.id, map_image_url: imageUrl}));
      
      // Notify integration provider
      if (dispatch) {
         dispatch({
            type: 'BROADCAST_EVENT',
            payload: { 
                event: 'PROJECT_SAVED', 
                app: 'contour-digitizer', 
                data: { id: savedData.id, name: savedData.project_name, type: 'contour' } 
            }
         });
      }

      toast({ title: 'Project Saved', description: `"${state.projectName}" has been saved.` });
      fetchProjects();
    } catch (error) {
      console.error("Save failed", error);
      toast({ title: 'Save Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
      setStatus('');
    }
  }, [state, toast, fetchProjects, dispatch]);

  const handleLoadProject = useCallback(async (projectId) => {
    setIsProcessing(true);
    setStatus('Loading project...');
    try {
      const { data, error } = await supabase.from('contour_projects').select('*').eq('id', projectId).single();
      if (error) throw error;

      setState(p => ({
        ...p,
        id: data.id,
        projectName: data.project_name,
        imagePreview: data.map_image_url,
        map_image_url: data.map_image_url,
        imageFile: null,
        controlPoints: data.geo_points || [],
        layers: data.contours || { contours: [], faults: [] },
        gridCellSize: data.grid_cell_size || 50,
        griddingMethod: data.gridding_method || 'idw',
        results: null,
      }));

      if (data.map_image_url) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          setState(p => ({ ...p, imageDimensions: { width: img.width, height: img.height } }));
        };
        img.onerror = () => {
             toast({ title: 'Image Load Error', description: 'Could not load map image. It may have been deleted.', variant: 'warning' });
        };
        img.src = data.map_image_url;
      }

      toast({ title: 'Project Loaded', description: `"${data.project_name}" is ready.` });
    } catch (error) {
      toast({ title: 'Load Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
      setStatus('');
    }
  }, [toast]);

  const handleExport = useCallback((format) => {
    const { layers, results, geoTransform, projectName } = state;
    try {
      if (format === 'geojson') {
        exportToGeoJSON(layers, geoTransform, projectName);
      } else if (format === 'dxf') {
        exportToDXF(layers, geoTransform, projectName);
      } else if (format === 'csv') {
        if (!results?.grid) {
          toast({ title: 'No Grid Data', description: 'Please generate the 3D grid first.', variant: 'destructive' });
          return;
        }
        exportToCSV(results.grid, projectName);
      }
      toast({ title: 'Export Successful', description: `Project exported as ${format.toUpperCase()}.` });
    } catch (error) {
      toast({ title: 'Export Failed', description: error.message, variant: 'destructive' });
    }
  }, [state, toast]);

  return {
    state,
    setState,
    imgCanvasRef,
    ovrCanvasRef,
    handleFileUpload,
    handleGeoref,
    handleAutoTrace,
    handleManualDraw,
    handleDeleteLine,
    handleSetLineValue,
    handleGrid,
    handleSaveProject,
    handleLoadProject,
    handleExport,
    isProcessing,
    status,
    isCvReady,
  };
};

export default useContourDigitizer;