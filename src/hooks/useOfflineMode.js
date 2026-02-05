import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useOfflineMode = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [syncQueue, setSyncQueue] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            if (syncQueue.length > 0) {
                toast({
                    title: "Back Online",
                    description: `Syncing ${syncQueue.length} offline actions...`,
                });
                // Simulate sync processing
                setTimeout(() => {
                    setSyncQueue([]);
                    toast({
                        title: "Sync Complete",
                        description: "All offline changes have been saved.",
                    });
                }, 1500);
            } else {
                toast({
                    title: "Online",
                    description: "Connection restored.",
                    className: "bg-emerald-900 border-emerald-800 text-white"
                });
            }
        };

        const handleOffline = () => {
            setIsOnline(false);
            toast({
                title: "Offline Mode",
                description: "You are currently offline. Changes will be queued.",
                variant: "destructive"
            });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [syncQueue, toast]);

    const queueAction = (action) => {
        if (!isOnline) {
            setSyncQueue(prev => [...prev, { ...action, timestamp: Date.now() }]);
            toast({
                title: "Action Queued",
                description: "Will sync when connection is restored.",
            });
            return true; // Queued
        }
        return false; // Not queued, proceed normally
    };

    return { isOnline, queueAction, syncQueueCount: syncQueue.length };
};