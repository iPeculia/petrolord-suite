import React, { useEffect, useRef, useCallback } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const ImageViewer = ({ status, imgCanvasRef, ovrCanvasRef, zoomCanvasRef, imageUrl, points, setPoints, calibration, setState, state }) => {
  const imageRef = useRef(null);
  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isDrawing = useRef(false);
  const isDrawingROI = useRef(false);
  const roiStartPoint = useRef(null);
  
  const { pickingFor, view, manualMode, curves } = state;

  const getCanvasPosFromEvent = (e) => {
    const canvas = ovrCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const getImagePosFromCanvasPos = (canvasPos) => {
    if (!view) return { x: 0, y: 0 };
    return {
      x: (canvasPos.x - view.x) / view.scale,
      y: (canvasPos.y - view.y) / view.scale
    };
  };

  const draw = useCallback(() => {
    const imgCanvas = imgCanvasRef.current;
    const ovrCanvas = ovrCanvasRef.current;
    if (!imgCanvas || !ovrCanvas || !imageRef.current) return;

    const ctx = imgCanvas.getContext('2d');
    const ovrCtx = ovrCanvas.getContext('2d');
    const { width, height } = imgCanvas;

    ctx.clearRect(0, 0, width, height);
    ovrCtx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(view.x, view.y);
    ctx.scale(view.scale, view.scale);
    ctx.drawImage(imageRef.current, 0, 0);
    ctx.restore();

    ovrCtx.save();
    ovrCtx.translate(view.x, view.y);
    ovrCtx.scale(view.scale, view.scale);

    const drawCalibrationLine = (pixel, orientation) => {
        if (!pixel) return;
        ovrCtx.beginPath();
        if (orientation === 'h') {
            ovrCtx.moveTo(0, pixel);
            ovrCtx.lineTo(calibration.img_width, pixel);
        } else {
            ovrCtx.moveTo(pixel, 0);
            ovrCtx.lineTo(pixel, calibration.img_height);
        }
        ovrCtx.stroke();
    };
    
    ovrCtx.strokeStyle = 'rgba(255, 165, 0, 0.5)';
    ovrCtx.lineWidth = 1 / view.scale;
    ovrCtx.setLineDash([5 / view.scale, 5 / view.scale]);
    drawCalibrationLine(calibration.depth_top_pixel, 'h');
    drawCalibrationLine(calibration.depth_bottom_pixel, 'h');
    drawCalibrationLine(calibration.x_left_pixel, 'v');
    drawCalibrationLine(calibration.x_right_pixel, 'v');
    ovrCtx.setLineDash([]);
    
    curves.forEach(curve => {
      if (curve.points_px.length > 1) {
        ovrCtx.strokeStyle = curve.color || 'rgba(100, 100, 255, 0.7)';
        ovrCtx.lineWidth = 2 / view.scale;
        ovrCtx.beginPath();
        ovrCtx.moveTo(curve.points_px[0][0], curve.points_px[0][1]);
        for (let i = 1; i < curve.points_px.length; i++) {
          ovrCtx.lineTo(curve.points_px[i][0], curve.points_px[i][1]);
        }
        ovrCtx.stroke();
      }
    });

    if (points.length > 0) {
      ovrCtx.strokeStyle = state.currentTrack.color || 'rgba(0, 255, 255, 0.9)';
      ovrCtx.lineWidth = 2 / view.scale;
      if (points.length > 1) {
        ovrCtx.beginPath();
        ovrCtx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
          ovrCtx.lineTo(points[i][0], points[i][1]);
        }
        ovrCtx.stroke();
      }
      points.forEach(([px, py]) => {
        ovrCtx.beginPath();
        ovrCtx.arc(px, py, 3 / view.scale, 0, 2 * Math.PI);
        ovrCtx.fillStyle = state.currentTrack.color || 'rgba(0, 255, 255, 0.9)';
        ovrCtx.fill();
      });
    }
    
    if (state.roi) {
        ovrCtx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
        ovrCtx.lineWidth = 2 / view.scale;
        ovrCtx.strokeRect(state.roi.x1, state.roi.y1, state.roi.x2 - state.roi.x1, state.roi.y2 - state.roi.y1);
    }
    ovrCtx.restore();
  }, [view, points, calibration, state.roi, curves, state.currentTrack.color]);

  useEffect(() => {
    if (imageUrl) {
        const image = new Image();
        image.onload = () => {
            imageRef.current = image;
            const imgCanvas = imgCanvasRef.current;
            const ovrCanvas = ovrCanvasRef.current;
            const container = imgCanvas.parentElement;
            imgCanvas.width = container.clientWidth;
            imgCanvas.height = container.clientHeight;
            ovrCanvas.width = container.clientWidth;
            ovrCanvas.height = container.clientHeight;
            draw();
        };
        image.src = imageUrl;
    }
  }, [imageUrl, draw]);
  
  useEffect(() => {
      draw();
  }, [draw]);

  const handleMouseDown = (e) => {
    if (!imageUrl) return;
    const canvasPos = getCanvasPosFromEvent(e);
    const imagePos = getImagePosFromCanvasPos(canvasPos);
    
    if (pickingFor) {
      const fieldToSet = pickingFor;
      const valueToSet = pickingFor.includes('depth') ? Math.round(imagePos.y) : Math.round(imagePos.x);
      
      setState(prev => ({
        ...prev,
        calibration: { ...prev.calibration, [fieldToSet]: valueToSet },
        pickingFor: null,
        status: 'Calibration point set. Ready.'
      }));
      return;
    }
    
    if (e.shiftKey) {
      isDrawingROI.current = true;
      roiStartPoint.current = imagePos;
      setState(prev => ({ ...prev, roi: null }));
    } else if (manualMode) {
      setPoints([...points, [imagePos.x, imagePos.y]]);
    } else if (e.button === 1 || e.button === 2 || e.drag) { // Middle or right click or drag for panning
      isPanning.current = true;
      lastMousePos.current = canvasPos;
    } else if (e.button === 0 && !manualMode) { // Left click starts freehand drawing
        isDrawing.current = true;
        setPoints([[imagePos.x, imagePos.y]]);
    }
  };

  const handleMouseMove = (e) => {
    if (!imageUrl || pickingFor) return;
    const canvasPos = getCanvasPosFromEvent(e);

    if (isPanning.current) {
        const dx = canvasPos.x - lastMousePos.current.x;
        const dy = canvasPos.y - lastMousePos.current.y;
        lastMousePos.current = canvasPos;
        setState(prev => ({ ...prev, view: { ...prev.view, x: prev.view.x + dx, y: prev.view.y + dy } }));
        return;
    }

    const imagePos = getImagePosFromCanvasPos(canvasPos);
    
    if (isDrawingROI.current) {
      const [x1, y1] = [roiStartPoint.current.x, roiStartPoint.current.y];
      const [x2, y2] = [imagePos.x, imagePos.y];
      setState(prev => ({ ...prev, roi: { x1: Math.min(x1, x2), y1: Math.min(y1, y2), x2: Math.max(x1, x2), y2: Math.max(y1, y2) } }));
    } else if (isDrawing.current && !manualMode) {
      setPoints(prev => [...prev, [imagePos.x, imagePos.y]]);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    isDrawingROI.current = false;
    roiStartPoint.current = null;
    isPanning.current = false;
  };

  const handleWheel = (e) => {
    if (!imageUrl) return;
    e.preventDefault();
    const canvasPos = getCanvasPosFromEvent(e);
    const zoomFactor = 1.1;
    const newScale = e.deltaY < 0 ? view.scale * zoomFactor : view.scale / zoomFactor;
    
    const worldX = (canvasPos.x - view.x) / view.scale;
    const worldY = (canvasPos.y - view.y) / view.scale;
    
    const newX = canvasPos.x - worldX * newScale;
    const newY = canvasPos.y - worldY * newScale;
    
    setState(prev => ({...prev, view: { x: newX, y: newY, scale: newScale }}));
  };
  
  const handleContextMenu = (e) => e.preventDefault();

  let cursorClass = 'cursor-grab';
  if(isPanning.current) cursorClass = 'cursor-grabbing';
  else if(pickingFor) cursorClass = 'cursor-copy';
  else if (manualMode || isDrawingROI.current) cursorClass = 'cursor-crosshair';
  
  return (
    <div className="flex-1 space-y-4">
      <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg relative h-[480px] lg:h-[700px]">
        <h3 className="text-lg font-semibold text-teal-300 mb-2 absolute top-4 left-4 z-10 bg-gray-900/50 px-2 py-1 rounded">Log Image Viewer <span className="text-sm text-gray-400">(Shift+Drag: ROI, Wheel: Zoom, Drag: Pan)</span></h3>
        <div className="w-full h-full bg-gray-900 rounded overflow-hidden relative">
          <canvas ref={imgCanvasRef} className="absolute top-0 left-0" />
          <canvas
            ref={ovrCanvasRef}
            className={cn("absolute top-0 left-0", cursorClass)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onContextMenu={handleContextMenu}
          />
        </div>
        <div className="absolute top-6 right-6 flex flex-col items-end gap-2 pointer-events-none">
          <canvas ref={zoomCanvasRef} width="160" height="160" className="hidden"></canvas>
        </div>
      </div>
      <div className="bg-gray-800/50 p-3 rounded-lg shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            {state.progress > 0 && state.progress < 100 && <Progress value={state.progress} className="w-full" />}
          </div>
          <div className="text-sm text-gray-300 min-w-[100px] text-left">Zoom: {(view.scale * 100).toFixed(0)}%</div>
          <div className="text-sm text-gray-300 w-full text-right truncate" title={status}>{status}</div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;