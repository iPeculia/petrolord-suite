import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProgressiveWebApp = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowInstallBanner(false);
            toast({ title: "Installing...", description: "EarthModel Studio is being installed on your device." });
        }
    };

    if (!showInstallBanner) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-cyan-900 text-white p-4 rounded-lg shadow-xl border border-cyan-700 flex items-center justify-between animate-in slide-in-from-bottom-10">
            <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-md">
                    <img src="/vite.svg" alt="Logo" className="w-6 h-6" />
                </div>
                <div>
                    <div className="font-bold text-sm">Install App</div>
                    <div className="text-xs text-cyan-200">Add to Home Screen for better performance</div>
                </div>
            </div>
            <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={handleInstallClick}>
                    <Download className="w-3 h-3 mr-1" /> Install
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-cyan-200 hover:text-white hover:bg-cyan-800" onClick={() => setShowInstallBanner(false)}>
                    <X className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default ProgressiveWebApp;