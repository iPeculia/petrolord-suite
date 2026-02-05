import { useState, useEffect } from 'react';

export const useDevicePerformance = () => {
    const [isLiteMode, setIsLiteMode] = useState(false);

    useEffect(() => {
        // Simple check for device memory. Can be expanded.
        // navigator.deviceMemory is not supported in all browsers, so we add a fallback.
        const deviceMemory = navigator.deviceMemory || 2; // Assume 2GB if not supported
        
        // Check for WebGL support and renderer info
        let isLowEndGpu = false;
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    if (renderer.toLowerCase().includes('intel')) {
                        isLowEndGpu = true;
                    }
                }
            } else {
                isLowEndGpu = true; // No WebGL support
            }
        } catch (e) {
            isLowEndGpu = true;
        }

        if (deviceMemory < 4 || isLowEndGpu) {
            setIsLiteMode(true);
        }

    }, []);

    return { isLiteMode };
};