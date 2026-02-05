import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

const ShortcutRow = ({ keys, description }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
    <span className="text-sm text-slate-300">{description}</span>
    <div className="flex gap-1">
      {keys.map((k, i) => (
        <kbd key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-400 min-w-[24px] text-center">
          {k}
        </kbd>
      ))}
    </div>
  </div>
);

const KeyboardShortcutsHelp = ({ open, onOpenChange }) => {
  const shortcuts = [
    { keys: ['Ctrl', 'S'], description: 'Save current version' },
    { keys: ['Ctrl', 'Z'], description: 'Undo last change' },
    { keys: ['Ctrl', 'Y'], description: 'Redo last change' },
    { keys: ['Ctrl', 'H'], description: 'Toggle Help Panel' },
    { keys: ['Ctrl', '/'], description: 'Show this shortcuts dialog' },
    { keys: ['Alt', '1'], description: 'Switch to Inputs tab' },
    { keys: ['Alt', '2'], description: 'Switch to Profile tab' },
    { keys: ['Alt', '3'], description: 'Switch to Risks tab' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-amber-400" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Boost your productivity with these shortcuts.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          {shortcuts.map((s, i) => (
            <ShortcutRow key={i} keys={s.keys} description={s.description} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp;