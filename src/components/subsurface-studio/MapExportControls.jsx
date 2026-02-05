import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const MapExportControls = ({ exportGeoJSON }) => {
    return (
        <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={exportGeoJSON}>
            <Download className="w-3 h-3 mr-2" /> Export View as GeoJSON
        </Button>
    );
};

export default MapExportControls;