import { get, set, del } from 'idb-keyval';

// Simple wrapper for idb-keyval to have a single point of import
export const idbKeyval = {
  get,
  set,
  del,
};