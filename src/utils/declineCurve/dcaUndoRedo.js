export const createUndoRedoManager = (initialState, limit = 50) => {
  let history = [];
  let pointer = -1;

  const pushState = (state) => {
    const snapshot = JSON.parse(JSON.stringify(state));
    
    // Remove any future history if we push a new state while in the middle of the stack
    if (pointer < history.length - 1) {
      history = history.slice(0, pointer + 1);
    }
    
    history.push(snapshot);
    if (history.length > limit) {
      history.shift();
    } else {
      pointer++;
    }
  };

  const undo = () => {
    if (pointer > 0) {
      pointer--;
      return JSON.parse(JSON.stringify(history[pointer]));
    }
    return null;
  };

  const redo = () => {
    if (pointer < history.length - 1) {
      pointer++;
      return JSON.parse(JSON.stringify(history[pointer]));
    }
    return null;
  };

  const canUndo = () => pointer > 0;
  const canRedo = () => pointer < history.length - 1;

  // Initialize
  if (initialState) pushState(initialState);

  return {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    getCurrentState: () => history[pointer]
  };
};