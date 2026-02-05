import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShow(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-2xl z-50 flex flex-col gap-3"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-white text-sm">Install App</h4>
                            <p className="text-xs text-slate-400 mt-1">Add Petrolord to your home screen for offline access and better performance.</p>
                        </div>
                        <button onClick={() => setShow(false)} className="text-slate-400 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <Button onClick={handleInstall} size="sm" className="bg-lime-600 hover:bg-lime-500 text-white w-full">
                        <Download className="w-4 h-4 mr-2" /> Install
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstallPrompt;