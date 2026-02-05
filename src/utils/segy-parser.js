// This file now acts as a bridge to the Web Worker.
// It abstracts away the worker communication, so components can use it like a simple async function.

export function parseSegy(file, parseMode, sliceIndex = 0) {
  return new Promise((resolve, reject) => {
    // Create a new worker instance. 
    // The `?worker` query is a Vite-specific feature that handles the worker bundling.
    const worker = new Worker(new URL('../workers/segy.worker.js', import.meta.url), {
      type: 'module'
    });

    worker.onmessage = (e) => {
      const { success, result, error } = e.data;
      if (success) {
        resolve(result);
      } else {
        reject(new Error(error));
      }
      worker.terminate(); // Clean up the worker after it's done.
    };

    worker.onerror = (e) => {
      reject(new Error(`Worker error: ${e.message}`));
      worker.terminate();
    };

    // Send the file and parameters to the worker to start processing.
    worker.postMessage({
      file,
      parseMode,
      sliceIndex,
    });
  });
}