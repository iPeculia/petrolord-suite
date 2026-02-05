import { useRef, useEffect, useState, useCallback } from 'react';

export const useInteractiveStage = (onDraw, isPicking) => {
    const imgCanvasRef = useRef(null);
    const ovrCanvasRef = useRef(null);
    const zoomCanvasRef = useRef(null);

    const [img, setImg] = useState(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const draw = useCallback(() => {
        const imgCanvas = imgCanvasRef.current;
        const ovrCanvas = ovrCanvasRef.current;
        if (!imgCanvas || !ovrCanvas || !img) return;

        const imgCtx = imgCanvas.getContext('2d');
        const ovrCtx = ovrCanvas.getContext('2d');

        imgCtx.setTransform(1, 0, 0, 1, 0, 0);
        imgCtx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
        ovrCtx.setTransform(1, 0, 0, 1, 0, 0);
        ovrCtx.clearRect(0, 0, ovrCanvas.width, ovrCanvas.height);

        imgCtx.setTransform(scale, 0, 0, scale, offset.x, offset.y);
        imgCtx.drawImage(img.element, 0, 0);

        ovrCtx.setTransform(scale, 0, 0, scale, offset.x, offset.y);
        if (onDraw) onDraw();
    }, [img, scale, offset, onDraw]);

    useEffect(() => {
        const imgCanvas = imgCanvasRef.current;
        const ovrCanvas = ovrCanvasRef.current;
        const parent = imgCanvas?.parentElement;
        if (parent && imgCanvas && ovrCanvas) {
            const { width, height } = parent.getBoundingClientRect();
            imgCanvas.width = ovrCanvas.width = width;
            imgCanvas.height = ovrCanvas.height = height;
            draw();
        }
    }, [draw]);

    const toCanvasPx = useCallback((imgX, imgY) => ({
        x: imgX * scale + offset.x,
        y: imgY * scale + offset.y,
    }), [scale, offset]);

    const toImgPx = useCallback((canvasX, canvasY) => ({
        x: (canvasX - offset.x) / scale,
        y: (canvasY - offset.y) / scale,
    }), [scale, offset]);

    const loadFromFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImg = new Image();
                newImg.onload = () => {
                    const canvas = imgCanvasRef.current;
                    // Create a separate canvas in memory to hold the full-size image data
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = newImg.width;
                    tempCanvas.height = newImg.height;
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCtx.drawImage(newImg, 0, 0);

                    const wRatio = canvas.width / newImg.width;
                    const hRatio = canvas.height / newImg.height;
                    const initialScale = Math.min(wRatio, hRatio, 1);
                    
                    setImg({
                        element: newImg,
                        dataCanvas: tempCanvas,
                        width: newImg.width,
                        height: newImg.height
                    });

                    setScale(initialScale);
                    setOffset({
                        x: (canvas.width - newImg.width * initialScale) / 2,
                        y: (canvas.height - newImg.height * initialScale) / 2,
                    });
                    resolve();
                };
                newImg.onerror = reject;
                newImg.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleMouseMoveZoom = useCallback((e) => {
        const zoomCanvas = zoomCanvasRef.current;
        const ovrCanvas = ovrCanvasRef.current;
        if (!zoomCanvas || !ovrCanvas || !img || isPicking) return;
        
        const zoomCtx = zoomCanvas.getContext('2d');
        const rect = ovrCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        zoomCtx.fillStyle = 'white';
        zoomCtx.fillRect(0, 0, zoomCanvas.width, zoomCanvas.height);
        
        const zoomLevel = 8;
        const srcSize = zoomCanvas.width / zoomLevel;
        
        const { x: imgX, y: imgY } = toImgPx(mouseX, mouseY);

        zoomCtx.imageSmoothingEnabled = false;
        zoomCtx.drawImage(
            img.element,
            imgX - srcSize / 2, imgY - srcSize / 2,
            srcSize, srcSize,
            0, 0,
            zoomCanvas.width, zoomCanvas.height
        );
        
        zoomCtx.strokeStyle = 'red';
        zoomCtx.lineWidth = 1;
        zoomCtx.beginPath();
        zoomCtx.moveTo(zoomCanvas.width / 2, 0);
        zoomCtx.lineTo(zoomCanvas.width / 2, zoomCanvas.height);
        zoomCtx.moveTo(0, zoomCanvas.height / 2);
        zoomCtx.lineTo(zoomCanvas.width, zoomCanvas.height / 2);
        zoomCtx.stroke();
    }, [img, toImgPx, isPicking]);

    useEffect(() => {
        const canvas = ovrCanvasRef.current;
        if (!canvas) return;

        const handleMouseDown = (e) => {
            if (e.button !== 0) return; // Only main button
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
        };
        const handleMouseUp = () => setIsDragging(false);
        const handleMouseLeave = () => setIsDragging(false);
        
        const handleMouseMoveDrag = (e) => {
            if (!isDragging || isPicking) return;
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            setDragStart({ x: e.clientX, y: e.clientY });
        };
        
        const handleWheel = (e) => {
            e.preventDefault();
            const scaleAmount = 1.1;
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const newScale = e.deltaY < 0 ? scale * scaleAmount : scale / scaleAmount;
            
            const worldX = (mouseX - offset.x) / scale;
            const worldY = (mouseY - offset.y) / scale;

            setOffset({
                x: mouseX - worldX * newScale,
                y: mouseY - worldY * newScale
            });
            setScale(newScale);
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('mousemove', handleMouseMoveDrag);
        canvas.addEventListener('mousemove', handleMouseMoveZoom);
        canvas.addEventListener('wheel', handleWheel);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            canvas.removeEventListener('mousemove', handleMouseMoveDrag);
            canvas.removeEventListener('mousemove', handleMouseMoveZoom);
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, [isDragging, dragStart, scale, offset, handleMouseMoveZoom, isPicking]);

    useEffect(() => {
        draw();
    }, [img, scale, offset, draw]);

    const clearOverlay = () => {
        const ovrCanvas = ovrCanvasRef.current;
        if (!ovrCanvas) return;
        const ovrCtx = ovrCanvas.getContext('2d');
        const { width, height } = ovrCanvas;
        ovrCtx.save();
        ovrCtx.setTransform(1, 0, 0, 1, 0, 0);
        ovrCtx.clearRect(0, 0, width, height);
        ovrCtx.restore();
    };

    const drawPoints = (points, color = 'blue', size = 2) => {
        const ovrCanvas = ovrCanvasRef.current;
        if (!ovrCanvas || !points || points.length === 0) return;
        const ovrCtx = ovrCanvas.getContext('2d');
        ovrCtx.fillStyle = color;
        points.forEach(([x, y]) => {
            ovrCtx.beginPath();
            ovrCtx.arc(x, y, size / scale, 0, 2 * Math.PI);
            ovrCtx.fill();
        });
    };
    
    const getPixelData = (x, y) => {
        if (!img || !img.dataCanvas) return null;
        const ctx = img.dataCanvas.getContext('2d');
        return ctx.getImageData(x, y, 1, 1).data;
    };

    return {
        imgCanvasRef,
        ovrCanvasRef,
        zoomCanvasRef,
        stage: img ? { img, toCanvasPx, toImgPx, draw, clearOverlay, drawPoints, getPixelData, imgCanvasRef } : null,
        loadFromFile,
    };
};