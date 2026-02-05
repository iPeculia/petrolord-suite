// This component is being decommissioned. A new, more direct viewer is being implemented.
import { useState } from 'react';

export function useTiles() {
  return { tiles: [], stats: { requested: 0, ok: 0 } };
}