import { useState, useRef, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { autoDigitizeSafe } from '@/lib/autoDigitizeSafe';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const STORAGE_KEY = 'log_digitizer_settings';

const initialState = {
  projectId: null,
  projectName: '',
  fileName: null,
  imageUrl: null,
  imagePath: null,
  calibration: {
    img_width: 0,
    img_height: 0,
    depth_top_pixel: '',
    depth_bottom_pixel: '',
    depth_top_value: '',
    depth_bottom_value: '',
    depth_unit: 'ft',
    x_left_pixel: '',
    x_right_pixel: '',
    x_min: '',
    x_max: '',
    x_scale: 'linear',
  },
  currentTrack: { name: 'GR', unit: 'gAPI', color: '#00FF00' },
  simplifyEpsilon: 1.0,
  curves: [],
  points: [],
  status: 'Ready. Load an image or project to start.',
  progress: 0,
  roi: null,
  pickingFor: null,
  view: { x: 0, y: 0, scale: 1 },
  manualMode: false,
};

const useLogDigitizer = (toast) => {
  const { user } = useAuth();
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedProjects, setSavedProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const imgCanvasRef = useRef(null);
  const ovrCanvasRef = useRef(null);
  const zoomCanvasRef = useRef(null);
  const cancelToken = useRef({ cancel: false });

  // Load local settings on mount (as fallback/preference)
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const { simplifyEpsilon } = JSON.parse(savedSettings);
        setState(prev => ({
          ...prev,
          simplifyEpsilon: simplifyEpsilon || 1.0,
        }));
      }
    } catch (e) {
      console.error("Failed to load settings from localStorage", e);
    }
  }, []);

  // Fetch projects from Supabase
  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setIsLoadingProjects(true);
    try {
      const { data, error } = await supabase
        .from('log_digitizer_projects')
        .select('id, project_name, updated_at')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      setSavedProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({ title: 'Error', description: 'Failed to load saved projects.', variant: 'destructive' });
    } finally {
      setIsLoadingProjects(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Handle Loading a Project
  const loadProject = useCallback(async (project) => {
    setIsProcessing(true);
    setState(prev => ({ ...prev, status: `Loading project: ${project.project_name}...` }));
    try {
        // Fetch full details
        const { data: fullProject, error } = await supabase
            .from('log_digitizer_projects')
            .select('*')
            .eq('id', project.id)
            .single();
        
        if (error) throw error;

        let imageUrl = null;
        if (fullProject.image_path) {
            const { data: downloadData, error: downloadError } = await supabase
                .storage
                .from('pta-uploads') // Using general uploads bucket
                .download(fullProject.image_path);
            
            if (downloadError) throw downloadError;
            imageUrl = URL.createObjectURL(downloadData);
        }

        // Load image to get dimensions and set view
        const image = new Image();
        image.onload = () => {
            const { width, height } = image;
             // Calculate fit-to-screen scale if possible, or just default
            setState(prev => ({
                ...initialState,
                projectId: fullProject.id,
                projectName: fullProject.project_name,
                fileName: fullProject.project_name, // Approximate
                imageUrl,
                imagePath: fullProject.image_path,
                calibration: fullProject.calibration || initialState.calibration,
                curves: fullProject.curves || [],
                simplifyEpsilon: prev.simplifyEpsilon, // Keep user pref
                status: 'Project loaded successfully.',
                view: { x: 0, y: 0, scale: 0.5 } // Reset view roughly
            }));
            setIsProcessing(false);
            toast({ title: 'Project Loaded', description: `Loaded ${fullProject.project_name}` });
        };
        if (imageUrl) {
             image.src = imageUrl;
        } else {
             // No image? Weird state but handle it
             setIsProcessing(false);
        }

    } catch (error) {
        console.error("Load project failed:", error);
        toast({ title: 'Load Failed', description: error.message, variant: 'destructive' });
        setIsProcessing(false);
    }
  }, [toast]);

  // Handle Saving a Project
  const saveProject = useCallback(async (name) => {
    if (!user) return;
    if (!state.imageUrl && !state.imagePath) {
        toast({ title: "Error", description: "No image to save.", variant: 'destructive' });
        return;
    }
    
    setIsProcessing(true);
    setState(prev => ({ ...prev, status: 'Saving project...' }));

    try {
        let imagePath = state.imagePath;

        // Upload image if it's new (blob url) and not yet uploaded
        if (!imagePath && state.imageUrl && state.imageUrl.startsWith('blob:')) {
            const response = await fetch(state.imageUrl);
            const blob = await response.blob();
            const fileName = `digitizer/${user.id}/${Date.now()}_${state.fileName || 'log_image'}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('pta-uploads')
                .upload(fileName, blob);
            
            if (uploadError) throw uploadError;
            imagePath = fileName;
        }

        const payload = {
            user_id: user.id,
            project_name: name,
            image_path: imagePath,
            calibration: state.calibration,
            curves: state.curves,
            updated_at: new Date().toISOString()
        };

        let result;
        if (state.projectId) {
            // Update
            const { data, error } = await supabase
                .from('log_digitizer_projects')
                .update(payload)
                .eq('id', state.projectId)
                .select()
                .single();
            if(error) throw error;
            result = data;
        } else {
            // Insert
            const { data, error } = await supabase
                .from('log_digitizer_projects')
                .insert([payload])
                .select()
                .single();
             if(error) throw error;
             result = data;
        }

        setState(prev => ({ 
            ...prev, 
            projectId: result.id, 
            projectName: result.project_name, 
            imagePath: result.image_path,
            status: 'Project saved.' 
        }));
        
        toast({ title: 'Success', description: 'Project saved successfully.' });
        fetchProjects();

    } catch (error) {
        console.error("Save project failed:", error);
        toast({ title: 'Save Failed', description: error.message, variant: 'destructive' });
    } finally {
        setIsProcessing(false);
    }
  }, [user, state, toast, fetchProjects]);

  const deleteProject = useCallback(async (id) => {
      try {
          const { error } = await supabase.from('log_digitizer_projects').delete().eq('id', id);
          if (error) throw error;
          toast({ title: "Project Deleted" });
          fetchProjects();
          if (state.projectId === id) {
              // Reset if current project deleted
               setState(initialState);
          }
      } catch (e) {
          toast({ title: "Error", description: e.message, variant: "destructive" });
      }
  }, [state.projectId, toast, fetchProjects]);


  const handleFileUpload = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;
    setIsProcessing(true);
    setState(prev => ({ ...prev, status: 'Loading image...', fileName: file.name }));

    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const { width, height } = image;
      const canvas = imgCanvasRef.current;
      if (!canvas) return;
      
      const container = canvas.parentElement;
      const scale = Math.min(container.clientWidth / width, container.clientHeight / height, 1);
      
      setState(prev => ({
        ...initialState,
        fileName: file.name,
        imageUrl,
        calibration: { ...initialState.calibration, img_width: width, img_height: height },
        view: { x: (container.clientWidth - width * scale) / 2, y: (container.clientHeight - height * scale) / 2, scale: scale },
        status: 'Load complete. Please calibrate.',
        progress: 0,
        // Reset project specific
        projectId: null,
        imagePath: null
      }));
      toast({ title: 'Upload Successful', description: 'Image is ready for calibration.' });
      setIsProcessing(false);
    };
    image.onerror = () => {
      toast({ title: 'Image Load Failed', description: 'Could not load the selected file.', variant: 'destructive' });
      setIsProcessing(false);
    };
    image.src = imageUrl;
  }, [toast]);

  // Existing curve handlers...
  const handleSavePoints = useCallback(async () => {
    if (state.points.length < 2) {
      toast({ title: 'Cannot Save', description: 'At least 2 points must be digitized.', variant: 'destructive' });
      return;
    }
    // Don't save to DB yet, just to local state. User must click "Save Project" to persist.
    const newCurve = {
      id: uuidv4(),
      name: state.currentTrack.name,
      unit: state.currentTrack.unit,
      color: state.currentTrack.color,
      points_px: state.points,
      point_count: state.points.length,
    };

    setState(prev => ({
      ...prev,
      curves: [...prev.curves, newCurve],
      points: [],
      status: 'Curve added to session.',
    }));

    toast({ title: 'Curve Added', description: `${state.currentTrack.name} added. Don't forget to Save Project.` });
  }, [state, toast]);

  const handleDeleteCurve = useCallback(async (curveId) => {
    setState(prev => ({
      ...prev,
      curves: prev.curves.filter(c => c.id !== curveId),
      status: 'Curve deleted from session.',
    }));
  }, []);

  const handleExport = useCallback(async (format) => {
      if (state.curves.length === 0) {
        toast({ title: 'Export Failed', description: 'No curves to export.', variant: 'destructive' });
        return null;
      }
      setIsProcessing(true);
      setState(prev => ({ ...prev, status: `Exporting to ${format.toUpperCase()}...` }));
  
      const { calibration, curves, fileName } = state;
      const { depth_top_pixel, depth_bottom_pixel, depth_top_value, depth_bottom_value, x_left_pixel, x_right_pixel, x_min, x_max, x_scale } = calibration;
  
      const transformPoint = (px, py) => {
        // Basic linear interpolation for depth
        const depth = depth_top_value + (py - depth_top_pixel) * (depth_bottom_value - depth_top_value) / (depth_bottom_pixel - depth_top_pixel);
        let value;
        if (x_scale === 'log10') {
          const log_x_min = Math.log10(x_min);
          const log_x_max = Math.log10(x_max);
          const log_val = log_x_min + (px - x_left_pixel) * (log_x_max - log_x_min) / (x_right_pixel - x_left_pixel);
          value = Math.pow(10, log_val);
        } else {
          value = x_min + (px - x_left_pixel) * (x_max - x_min) / (x_right_pixel - x_left_pixel);
        }
        return { depth, value };
      };
  
      let output = '';
      const download_filename = `${(state.projectName || fileName || 'log').replace(/\s+/g, '_')}.${format}`;
  
      if (format === 'csv') {
        const headers = ['DEPTH', ...curves.map(c => c.name)];
        output += headers.join(',') + '\n';
        
        // We need to resample curves to a common depth step or just union all depths.
        // For simplicity in this audit fix, we will just dump points or do a simple union.
        // Better approach: Union all unique depths, sort, then lookup values (sparse).
        const allDepths = new Set();
        const curveData = new Map(curves.map(c => [c.name, new Map()]));
  
        curves.forEach(curve => {
          const dataMap = curveData.get(curve.name);
          curve.points_px.forEach(([px, py]) => {
            const { depth, value } = transformPoint(px, py);
            const roundedDepth = parseFloat(depth.toFixed(2));
            allDepths.add(roundedDepth);
            dataMap.set(roundedDepth, value.toFixed(4));
          });
        });
  
        const sortedDepths = Array.from(allDepths).sort((a, b) => a - b);
        sortedDepths.forEach(depth => {
          const row = [depth.toFixed(2)];
          curves.forEach(curve => {
            row.push(curveData.get(curve.name).get(depth) || '');
          });
          output += row.join(',') + '\n';
        });
  
      } else if (format === 'las') {
        // Basic LAS 2.0 Writer
        output += `~VERSION INFORMATION\nVERS. 2.0: CWLS LOG ASCII STANDARD - VERSION 2.0\nWRAP. NO: ONE LINE PER DEPTH STEP\n~WELL INFORMATION\n#MNEM.UNIT      DATA                                    DESCRIPTION\n#----.----      ----------------------------------------  -------------------------------\nSTRT.M         ${calibration.depth_top_value?.toFixed(4) || 0}                               : START DEPTH\nSTOP.M         ${calibration.depth_bottom_value?.toFixed(4) || 0}                               : STOP DEPTH\nSTEP.M         0.0000                                  : STEP\nNULL.          -999.25                                 : NULL VALUE\nWELL.          ${state.projectName || 'UNKNOWN'}                                 : WELL\n~CURVE INFORMATION\n#MNEM.UNIT      API CODE                                DESCRIPTION\n#----.----      ----------------------------------------  -------------------------------\nDEPT.${calibration.depth_unit?.toUpperCase() || 'M'}                                                  : 1  DEPTH\n`;
        curves.forEach(c => {
          output += `${c.name}.${c.unit}                                                 :    ${c.name}\n`;
        });
        output += `~A  DEPT      ` + curves.map(c => c.name).join('      ') + '\n';
        
        const allDepths = new Set();
        const curveData = new Map(curves.map(c => [c.name, new Map()]));
  
        curves.forEach(curve => {
          const dataMap = curveData.get(curve.name);
          curve.points_px.forEach(([px, py]) => {
            const { depth, value } = transformPoint(px, py);
            const roundedDepth = parseFloat(depth.toFixed(4));
            allDepths.add(roundedDepth);
            dataMap.set(roundedDepth, value.toFixed(4));
          });
        });
        
        const sortedDepths = Array.from(allDepths).sort((a, b) => a - b);
        sortedDepths.forEach(depth => {
          const row = [depth.toFixed(4)];
          curves.forEach(curve => {
            row.push(curveData.get(curve.name).get(depth) || '-999.25');
          });
          output += ' ' + row.join('   ') + '\n';
        });
      }
  
      const blob = new Blob([output], { type: format === 'csv' ? 'text/csv' : 'text/plain' });
      
      // Return blob for direct handling (integration context)
      setIsProcessing(false);
      setState(prev => ({ ...prev, status: 'Export complete.' }));
      
      return { blob, filename: download_filename };
    }, [state, toast]);

  const handleAutoDigitize = useCallback(async () => {
    // ... existing logic ...
    if (!imgCanvasRef.current || !state.roi) {
        toast({ title: 'Error', description: 'Draw a region of interest first (Shift + Drag).', variant: 'destructive' });
        return;
      }
      setIsProcessing(true);
      cancelToken.current.cancel = false;
      setState(prev => ({ ...prev, status: 'Starting AI digitization...', progress: 0 }));
  
      try {
        const onProgress = (p, msg) => {
          setState(prev => ({ ...prev, progress: p, status: msg }));
        };
        const result = await autoDigitizeSafe({
          canvas: imgCanvasRef.current,
          roi: state.roi,
          tolerance: 1,
          onProgress,
          cancelToken: cancelToken.current,
        });
  
        if (result.cancelled) {
          toast({ title: 'Cancelled', description: 'Auto-digitization was cancelled.' });
          setState(prev => ({ ...prev, status: 'Cancelled.', progress: 0, roi: null }));
        } else {
          setState(prev => ({ ...prev, points: result.points, status: 'Digitization complete. Add to Session.', progress: 100, roi: null }));
          toast({ title: 'Success', description: `Digitized ${result.points.length} points.` });
        }
      } catch (error) {
        console.error("Auto-digitize error:", error);
        toast({ title: 'AI Digitization Failed', description: error.message, variant: 'destructive' });
        setState(prev => ({ ...prev, status: `Error: ${error.message}`, progress: 0, roi: null }));
      } finally {
        setIsProcessing(false);
      }
  }, [state.roi, toast]);

  return {
    state,
    setState,
    imgCanvasRef,
    ovrCanvasRef,
    zoomCanvasRef,
    handleFileUpload,
    handleSavePoints,
    handleDeleteCurve,
    handleExport,
    isProcessing,
    handleAutoDigitize,
    // New project methods
    savedProjects,
    isLoadingProjects,
    loadProject,
    saveProject,
    deleteProject
  };
};

export default useLogDigitizer;