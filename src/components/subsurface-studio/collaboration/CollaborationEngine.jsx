import React from 'react';
import { WebSocketManager } from './WebSocketManager';
import CursorTracking from './CursorTracking';
import { useStudio } from '@/contexts/StudioContext';

// This wrapper component injects the collaboration context and visual overlays
const CollaborationEngine = ({ children }) => {
    const { activeProject } = useStudio();

    // Only enable if a project is active
    if (!activeProject) return children;

    return (
        <WebSocketManager projectId={activeProject.id}>
            <div className="relative h-full w-full">
                {children}
                {/* Overlay layer for cursors */}
                <CursorTracking />
            </div>
        </WebSocketManager>
    );
};

export default CollaborationEngine;