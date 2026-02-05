import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Download, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MobileExportPanel = () => {
    const { toast } = useToast();

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'EarthModel Studio Project',
                    text: 'Check out this subsurface model.',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            toast({ title: "Copied", description: "Link copied to clipboard." });
        }
    };

    return (
        <Card className="bg-slate-950 border-slate-800 mt-4">
            <CardContent className="p-4 grid grid-cols-3 gap-2">
                <Button variant="outline" className="flex flex-col items-center h-auto py-2 gap-1" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                    <span className="text-[10px]">Share</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center h-auto py-2 gap-1">
                    <Download className="h-5 w-5" />
                    <span className="text-[10px]">Save</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center h-auto py-2 gap-1">
                    <Mail className="h-5 w-5" />
                    <span className="text-[10px]">Email</span>
                </Button>
            </CardContent>
        </Card>
    );
};

export default MobileExportPanel;