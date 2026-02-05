import { supabase } from '@/lib/customSupabaseClient';

export const EARTH_MODEL_CONFIG = {
  GRID_LIMITS: {
    MAX_NX: 1000,
    MAX_NY: 1000,
    MAX_NZ: 500,
    MAX_CELLS: 1000000 // 1 million cells limit for browser performance
  },
  INTERPOLATION_METHODS: {
    KRIGING: 'kriging',
    MIN_CURVATURE: 'min_curvature',
    IDW: 'inverse_distance_weighting',
    RBF: 'radial_basis_function'
  },
  CRS_DEFINITIONS: {
    WGS84: 'EPSG:4326',
    WEB_MERCATOR: 'EPSG:3857',
    UTM_ZONES: [
      // Simplified list
      { code: 'EPSG:32631', name: 'WGS 84 / UTM zone 31N' },
      { code: 'EPSG:32632', name: 'WGS 84 / UTM zone 32N' },
      { code: 'EPSG:32633', name: 'WGS 84 / UTM zone 33N' }
    ]
  },
  BUCKETS: {
    SURFACE_DATA: 'surface-data',
    GRID_DATA: 'grid-data',
    WELL_DATA: 'well-data',
    JOB_RESULTS: 'job-results'
  }
};

export const emSupabase = supabase;