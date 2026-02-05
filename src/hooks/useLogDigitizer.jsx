import { useState, useRef, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { autoDigitizeSafe } from '@/lib/autoDigitizeSafe';

const STORAGE_KEY = 'log_digitizer_settings';

const initialState = {
  fileName: null,
  imageUrl: null,
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
  status: 'Ready. Load an image to start.',
  progress: 0,
  roi: null,
  pickingFor: null,
  view: { x: 0, y: 0, scale: 1 },
  manualMode: false,
};

const useLogDigitizer = (toast) => {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgCanvasRef = useRef(null);
  const ovrCanvasRef = useRef(null);
  const zoomCanvasRef = useRef(null);
  const cancelToken = useRef({ cancel: false });

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const { calibration, simplifyEpsilon } = JSON.parse(savedSettings);
        setState(prev => ({
          ...prev,
          calibration: { ...prev.calibration, ...calibration },
          simplifyEpsilon,
        }));
      }
    } catch (e) {
      console.error("Failed to load settings from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      const settingsToSave = {
        calibration: state.calibration,
        simplifyEpsilon: state.simplifyEpsilon,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (e) {
      console.error("Failed to save settings to localStorage", e);
    }
  }, [state.calibration, state.simplifyEpsilon]);

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

  const handleSavePoints = useCallback(async () => {
    if (state.points.length < 2) {
      toast({ title: 'Cannot Save', description: 'At least 2 points must be digitized.', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    setState(prev => ({ ...prev, status: 'Saving curve...' }));

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
      status: 'Curve saved. Digitize next curve or export.',
    }));

    toast({ title: 'Curve Saved', description: `${state.currentTrack.name} has been saved.` });
    setIsProcessing(false);
  }, [state, toast]);

  const handleDeleteCurve = useCallback(async (curveId) => {
    setState(prev => ({
      ...prev,
      curves: prev.curves.filter(c => c.id !== curveId),
      status: 'Curve deleted.',
    }));
    toast({ title: 'Curve Deleted', description: 'The curve has been removed.' });
  }, [toast]);

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
      const depth = depth_top_value + (py - depth_top_pixel) * (depth_bottom_value - depth_top_value) / (depth_bottom_pixel - depth_top_pixel);
      let value;
      if (x_scale === 'log10') {
        const log_x_min = Math.log10(x_min);
        const log_x_max = Math.log10(x_max);
        value = Math.pow(10, log_x_min + (px - x_left_pixel) * (log_x_max - log_x_min) / (x_right_pixel - x_left_pixel));
      } else {
        value = x_min + (px - x_left_pixel) * (x_max - x_min) / (x_right_pixel - x_left_pixel);
      }
      return { depth, value };
    };

    let output = '';
    const download_filename = `${fileName.split('.')[0]}.${format}`;

    if (format === 'csv') {
      const headers = ['DEPTH', ...curves.map(c => c.name)];
      output += headers.join(',') + '\n';
      
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
      output += `~VERSION INFORMATION\nVERS. 2.0: CWLS LOG ASCII STANDARD - VERSION 2.0\nWRAP. NO: ONE LINE PER DEPTH STEP\n~WELL INFORMATION\n#MNEM.UNIT      DATA                                    DESCRIPTION\n#----.----      ----------------------------------------  -------------------------------\nSTRT.M         ${calibration.depth_top_value.toFixed(4)}                               : START DEPTH\nSTOP.M         ${calibration.depth_bottom_value.toFixed(4)}                               : STOP DEPTH\nSTEP.M         0.1524                                  : STEP\nNULL.          -999.25                                 : NULL VALUE\nWELL.          UNKNOWN                                 : WELL\n~CURVE INFORMATION\n#MNEM.UNIT      API CODE                                DESCRIPTION\n#----.----      ----------------------------------------  -------------------------------\nDEPT.${calibration.depth_unit.toUpperCase()}                                                  : 1  DEPTH\n`;
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
    
    if (format === 'csv') {
      setIsProcessing(false);
      setState(prev => ({ ...prev, status: 'Ready for Petrophysics.' }));
      return { blob, filename: download_filename };
    }

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = download_filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast({ title: 'Export Successful', description: `Downloaded ${download_filename}` });
    setState(prev => ({ ...prev, status: 'Export complete.' }));
    setIsProcessing(false);
    return null;
  }, [state, toast]);

  const handleAutoDigitize = useCallback(async () => {
    if (!imgCanvasRef.current || !state.roi) {
      toast({ title: 'Error', description: 'Please draw a region of interest first (hold Shift and drag).', variant: 'destructive' });
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
        setState(prev => ({ ...prev, points: result.points, status: 'AI digitization complete. Save the curve.', progress: 100, roi: null }));
        toast({ title: 'Success', description: `Digitized ${result.points.length} points.` });
      }
    } catch (error) {
      console.error("Auto-digitize error:", error);
      toast({ title: 'AI Digitization Failed', description: error.message, variant: 'destructive' });
      setState(prev => ({ ...prev, status: `Error: ${error.message}`, progress: 0, roi: null }));
    } finally {
      setIsProcessing(false);
    }
  }, [state.roi, toast, state.calibration]);

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
  };
};

export default useLogDigitizer;