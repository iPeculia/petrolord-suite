import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;

      const combo = [
        event.ctrlKey || event.metaKey ? 'Ctrl' : null,
        event.shiftKey ? 'Shift' : null,
        event.altKey ? 'Alt' : null,
        event.key.toUpperCase()
      ].filter(Boolean).join('+');

      if (shortcuts[combo]) {
        event.preventDefault();
        shortcuts[combo]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};