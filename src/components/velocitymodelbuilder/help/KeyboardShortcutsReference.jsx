import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Command } from 'lucide-react';

const KeyboardShortcutsReference = () => {
  const shortcuts = [
    { keys: ["Ctrl", "S"], action: "Save Project" },
    { keys: ["Ctrl", "Z"], action: "Undo Last Action" },
    { keys: ["Ctrl", "Shift", "Z"], action: "Redo" },
    { keys: ["Ctrl", "E"], action: "Export Current Model" },
    { keys: ["Space"], action: "Toggle Play/Pause on 3D View" },
    { keys: ["Shift", "Click"], action: "Select Multiple Wells" },
    { keys: ["Delete"], action: "Remove Selected Layer/Object" },
    { keys: ["/"], action: "Focus Search Bar" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Command className="w-6 h-6" /> Keyboard Shortcuts
        </h2>
        <div className="rounded-md border border-slate-800 bg-slate-900">
            <Table>
                <TableHeader className="bg-slate-950">
                    <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-300 w-1/2">Shortcut</TableHead>
                        <TableHead className="text-slate-300">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {shortcuts.map((s, i) => (
                        <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell>
                                <div className="flex gap-1">
                                    {s.keys.map((k, j) => (
                                        <kbd key={j} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-300 min-w-[24px] text-center">
                                            {k}
                                        </kbd>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell className="text-slate-400 text-sm">{s.action}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
  );
};

export default KeyboardShortcutsReference;