import React from 'react';

const KeyboardShortcutsGuide = () => (
    <div className="space-y-6">
        <h1>Keyboard Shortcuts</h1>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between p-2 bg-slate-900 rounded border border-slate-800">
                <span>Calculate</span>
                <kbd className="bg-slate-800 px-2 rounded text-xs py-1">Ctrl + Enter</kbd>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 rounded border border-slate-800">
                <span>Save Project</span>
                <kbd className="bg-slate-800 px-2 rounded text-xs py-1">Ctrl + S</kbd>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 rounded border border-slate-800">
                <span>Zoom Extents</span>
                <kbd className="bg-slate-800 px-2 rounded text-xs py-1">Z</kbd>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 rounded border border-slate-800">
                <span>Toggle 3D/2D</span>
                <kbd className="bg-slate-800 px-2 rounded text-xs py-1">V</kbd>
            </div>
        </div>
    </div>
);

export default KeyboardShortcutsGuide;