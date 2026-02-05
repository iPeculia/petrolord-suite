import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, X, CheckCircle2 } from 'lucide-react';

const InteractiveGuide = ({ steps, isOpen, onClose, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const resizeObserver = useRef(null);

  const currentStep = steps[currentStepIndex];

  // Helper to find target element safely
  const updateTargetRect = () => {
    if (!currentStep) return;
    
    if (currentStep.targetId) {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Add some padding
        setTargetRect({
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
          right: rect.right + 8,
          bottom: rect.bottom + 8
        });
      } else {
        // Fallback if element not found: Center modal
        setTargetRect(null);
      }
    } else {
      // No target = Center modal
      setTargetRect(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is rendered if coming from a route change
      const timer = setTimeout(() => {
        updateTargetRect();
        setIsReady(true);
      }, 500);
      
      window.addEventListener('resize', updateTargetRect);
      window.addEventListener('scroll', updateTargetRect, true);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateTargetRect);
        window.removeEventListener('scroll', updateTargetRect, true);
      };
    } else {
      setIsReady(false);
      setCurrentStepIndex(0);
    }
  }, [isOpen, currentStepIndex, steps]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen || !isReady) return null;

  // Render Portal
  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence>
        {/* Overlay with Cutout */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 w-full h-full pointer-events-auto"
        >
          {/* We use a complex SVG or clip-path to create the hole, or simplified approach with 4 divs */}
          {targetRect ? (
            <>
              {/* Dark Overlay parts around the target */}
              <div className="absolute bg-black/70 transition-all duration-300 ease-out" style={{ top: 0, left: 0, right: 0, height: targetRect.top }} />
              <div className="absolute bg-black/70 transition-all duration-300 ease-out" style={{ top: targetRect.top, left: 0, width: targetRect.left, height: targetRect.height }} />
              <div className="absolute bg-black/70 transition-all duration-300 ease-out" style={{ top: targetRect.top, right: 0, left: targetRect.right, height: targetRect.height }} />
              <div className="absolute bg-black/70 transition-all duration-300 ease-out" style={{ top: targetRect.bottom, left: 0, right: 0, bottom: 0 }} />
              
              {/* Highlight Ring */}
              <div 
                className="absolute border-2 border-blue-500 rounded-lg shadow-[0_0_0_4px_rgba(59,130,246,0.3)] transition-all duration-300 ease-out pointer-events-none animate-pulse"
                style={{
                  top: targetRect.top,
                  left: targetRect.left,
                  width: targetRect.width,
                  height: targetRect.height
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          )}
        </motion.div>

        {/* Tooltip / Card */}
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="absolute max-w-sm w-full outline-none"
          style={{
            // Basic positioning logic: if target exists, place near it. Else center.
            ...(targetRect ? {
              top: targetRect.bottom + 20 > window.innerHeight - 200 ? 'auto' : targetRect.bottom + 20,
              bottom: targetRect.bottom + 20 > window.innerHeight - 200 ? window.innerHeight - targetRect.top + 20 : 'auto',
              left: Math.max(20, Math.min(targetRect.left, window.innerWidth - 400)), // Clamp to screen
            } : {
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            })
          }}
        >
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-5 relative">
            <button 
              onClick={handleSkip}
              className="absolute top-3 right-3 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold text-sm mb-3 border border-blue-600/30">
                {currentStepIndex + 1}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{currentStep.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {currentStep.content}
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
              <div className="flex gap-1">
                {steps.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${idx === currentStepIndex ? 'bg-blue-500' : 'bg-slate-700'}`}
                  />
                ))}
              </div>
              
              <div className="flex gap-2">
                {currentStepIndex > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleBack} className="text-slate-400 hover:text-white">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                )}
                <Button size="sm" onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 text-white">
                  {currentStepIndex === steps.length - 1 ? (
                    <>Finish <CheckCircle2 className="w-4 h-4 ml-1.5" /></>
                  ) : (
                    <>Next <ChevronRight className="w-4 h-4 ml-1.5" /></>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default InteractiveGuide;