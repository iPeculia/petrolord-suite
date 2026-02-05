import React, { useState, useEffect } from 'react';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

const tips = [
    "A positive NPV indicates the project adds value relative to your discount rate.",
    "Payback Period helps assess liquidity risk—shorter is generally safer.",
    "Use 'Real Terms' view to strip out inflation and see purchasing power.",
    "Sensitivity Analysis (Tornado) identifies which input carries the most risk.",
    "DPI (Discounted Profit Index) > 1.0 means efficient capital usage.",
    "Check 'Fiscal Terms' tab to switch between Royalty/Tax and PSC regimes."
];

const QuickTipsCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
        setIndex(prev => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex(prev => (prev + 1) % tips.length);
  const prev = () => setIndex(prev => (prev - 1 + tips.length) % tips.length);

  return (
    <Card className="bg-gradient-to-r from-slate-900 to-blue-950/20 border-slate-800 p-3 relative overflow-hidden">
        <div className="flex items-center gap-3">
            <div className="bg-yellow-500/10 p-2 rounded-full shrink-0">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="flex-1 h-10 relative flex items-center overflow-hidden">
                <AnimatePresence mode='wait'>
                    <motion.p 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs text-slate-300 italic absolute w-full"
                    >
                        "{tips[index]}"
                    </motion.p>
                </AnimatePresence>
            </div>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white" onClick={prev}>
                    <ChevronLeft className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white" onClick={next}>
                    <ChevronRight className="w-3 h-3" />
                </Button>
            </div>
        </div>
    </Card>
  );
};

export default QuickTipsCarousel;