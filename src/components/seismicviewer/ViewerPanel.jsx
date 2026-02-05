import React, { useRef, useEffect, useState } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Loader2 } from 'lucide-react';

    const ViewerPanel = ({ renderedImage, isLoading, isPicking, onAddPick, currentPicks, session }) => {
      const containerRef = useRef(null);
      const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

      useEffect(() => {
        if (renderedImage && containerRef.current) {
          const img = new Image();
          img.src = renderedImage.url;
          img.onload = () => {
            setImageSize({ width: img.width, height: img.height });
          };
        }
      }, [renderedImage]);

      const handleCanvasClick = (e) => {
        if (!isPicking || !renderedImage || !session) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const traceIndex = Math.round((x / rect.width) * (renderedImage.trace_count - 1));
        const timeMs = session.t0_ms + (y / rect.height) * (session.dt_ms * renderedImage.sample_count);

        onAddPick([traceIndex, timeMs]);
      };

      return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-black relative">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
              >
                <Loader2 className="w-16 h-16 text-amber-400 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
          {renderedImage && (
            <div className="relative" style={{ cursor: isPicking ? 'crosshair' : 'default' }} onClick={handleCanvasClick}>
              <motion.img
                key={renderedImage.url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={renderedImage.url}
                alt="Seismic Section"
                className="max-w-full max-h-full object-contain"
              />
              {isPicking && currentPicks.length > 0 && (
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  {currentPicks.map((pick, index) => {
                    const x = (pick[0] / (renderedImage.trace_count - 1)) * 100;
                    const y = ((pick[1] - session.t0_ms) / (session.dt_ms * renderedImage.sample_count)) * 100;
                    return <circle key={index} cx={`${x}%`} cy={`${y}%`} r="3" fill="cyan" />;
                  })}
                </svg>
              )}
            </div>
          )}
        </div>
      );
    };

    export default ViewerPanel;