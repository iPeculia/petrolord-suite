export const keyboardShortcuts = {
  Navigation: [
    { key: 'Ctrl + N', action: 'New Project' },
    { key: 'Ctrl + O', action: 'Open Project' },
    { key: 'Ctrl + S', action: 'Save Project' },
    { key: 'Ctrl + Shift + S', action: 'Save Snapshot' }
  ],
  View: [
    { key: 'H', action: 'Reset Camera (Home)' },
    { key: 'F', action: 'Frame Selected Object' },
    { key: 'T', action: 'Top View' },
    { key: 'S', action: 'Side View' },
    { key: 'V', action: 'Toggle Sidebar' }
  ],
  Tools: [
    { key: 'M', action: 'Measure Tool' },
    { key: 'P', action: 'Pick Mode' },
    { key: 'B', action: 'Box Select' },
    { key: 'Esc', action: 'Cancel Operation / Deselect' }
  ],
  Editing: [
    { key: 'Ctrl + Z', action: 'Undo' },
    { key: 'Ctrl + Y', action: 'Redo' },
    { key: 'Del', action: 'Delete Selected' }
  ]
};