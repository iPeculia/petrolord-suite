import { emSupabase, EARTH_MODEL_CONFIG } from '@/config/earthmodel-config';

export const earthModelService = {
  // Projects
  async getProjects() {
    const { data, error } = await emSupabase
      .from('em_projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createProject(project) {
    const { data: { user } } = await emSupabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await emSupabase
      .from('em_projects')
      .insert([{ ...project, user_id: user.id }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Wells
  async getWells(projectId) {
    const { data, error } = await emSupabase
      .from('em_wells')
      .select('*')
      .eq('project_id', projectId);
    if (error) throw error;
    return data;
  },

  async createWell(well) {
    const { data, error } = await emSupabase
      .from('em_wells')
      .insert([well])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Surfaces
  async getSurfaces(projectId) {
    const { data, error } = await emSupabase
      .from('em_surfaces')
      .select('*')
      .eq('project_id', projectId);
    if (error) throw error;
    return data;
  },

  async createSurface(surface, points = []) {
    // 1. Create Metadata
    const { data: surfaceData, error: surfaceError } = await emSupabase
      .from('em_surfaces')
      .insert([surface])
      .select()
      .single();
    
    if (surfaceError) throw surfaceError;

    // 2. Upload Points (if small enough for DB, otherwise use Storage)
    if (points.length > 0 && points.length < 5000) {
       const pointsWithId = points.map(p => ({ ...p, surface_id: surfaceData.id }));
       const { error: pointsError } = await emSupabase
         .from('em_surface_points')
         .insert(pointsWithId);
       if (pointsError) throw pointsError;
    } else if (points.length >= 5000) {
        // Upload to storage logic would go here
        // await uploadSurfaceToStorage(surfaceData.id, points);
    }

    return surfaceData;
  },

  // Jobs
  async createJob(projectId, type, parameters) {
    const { data, error } = await emSupabase
      .from('em_jobs')
      .insert([{
        project_id: projectId,
        type,
        parameters,
        status: 'pending',
        logs: ['Job initialized']
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getJobs(projectId) {
    const { data, error } = await emSupabase
      .from('em_jobs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};