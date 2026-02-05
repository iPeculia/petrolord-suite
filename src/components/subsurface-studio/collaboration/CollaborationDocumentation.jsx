import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const CollaborationDocumentation = () => (
    <ScrollArea className="h-full p-4 text-slate-300 text-sm leading-relaxed bg-slate-950 rounded-lg border border-slate-800">
        <h1 className="text-2xl font-bold text-white mb-4">Real-Time Collaboration Guide</h1>
        
        <h3 className="text-lg font-semibold text-white mt-6 mb-2">1. Presence & Cursors</h3>
        <p>See who is working in the project with you in real-time. Active users appear in the top bar. Their cursors are tracked across the canvas to prevent conflicting edits.</p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">2. Live Chat</h3>
        <p>Use the integrated chat panel on the right to discuss interpretations without leaving the app. Messages are broadcast instantly to all active session members.</p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3. Conflict Resolution</h3>
        <p>If two users edit the same horizon or fault simultaneously, the system uses a 'last-write-wins' strategy for atomic updates, but broadcasts notifications so users can coordinate.</p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4. Video Huddles</h3>
        <p>Start a quick video call directly within the studio context to resolve complex geological ambiguities face-to-face.</p>
    </ScrollArea>
);

export default CollaborationDocumentation;