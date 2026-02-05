import { get, set, del, keys } from 'idb-keyval';

/**
 * Material Balance Data Persistence Layer
 * Uses IndexedDB for robust local storage of large project datasets.
 */

const PROJECT_STORE_PREFIX = 'mb_proj_';
const METADATA_STORE_KEY = 'mb_projects_meta';

// --- Helper to get storage keys ---
const getProjectKey = (id) => `${PROJECT_STORE_PREFIX}${id}`;

// --- Core Persistence Functions ---

export const saveProject = async (projectData) => {
  try {
    if (!projectData || !projectData.id) throw new Error('Invalid project data');
    
    const timestamp = new Date().toISOString();
    const projectToSave = {
      ...projectData,
      lastModifiedDate: timestamp,
    };

    // 1. Save full project data to IDB
    await set(getProjectKey(projectToSave.id), projectToSave);

    // 2. Update metadata list (lightweight)
    const meta = {
      id: projectToSave.id,
      name: projectToSave.name,
      type: projectToSave.type || 'Oil',
      createdDate: projectToSave.createdDate,
      lastModifiedDate: timestamp,
      status: projectToSave.status || 'Active'
    };
    
    await updateProjectMetadata(meta);
    
    return { success: true, timestamp };
  } catch (error) {
    console.error('Save Project Error:', error);
    return { success: false, error: error.message };
  }
};

export const loadProject = async (projectId) => {
  try {
    const data = await get(getProjectKey(projectId));
    if (!data) throw new Error('Project not found');
    return data;
  } catch (error) {
    console.error('Load Project Error:', error);
    throw error;
  }
};

export const createProject = async (name, type) => {
  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  
  const newProject = {
    id,
    name,
    type,
    createdDate: timestamp,
    lastModifiedDate: timestamp,
    status: 'Active',
    version: '1.0',
    // Initialize empty data structures
    reservoirMetadata: { type, name: 'New Reservoir' },
    productionHistory: { dates: [], Np: [], Gp: [], Wp: [], Rp: [] },
    pressureData: { dates: [], Pr: [] },
    pvtData: { pressure: [], Bo: [], Bg: [], Rs: [] },
    contactObservations: { dates: [], measuredGOC: [], measuredOWC: [] },
    fittedModels: {},
    scenarios: [],
    auditTrail: []
  };

  await saveProject(newProject);
  return id;
};

export const deleteProject = async (projectId) => {
  try {
    // Remove data
    await del(getProjectKey(projectId));
    
    // Remove from metadata
    const metaList = (await get(METADATA_STORE_KEY)) || [];
    const updatedList = metaList.filter(p => p.id !== projectId);
    await set(METADATA_STORE_KEY, updatedList);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const listProjects = async () => {
  return (await get(METADATA_STORE_KEY)) || [];
};

export const archiveProject = async (projectId) => {
  const project = await loadProject(projectId);
  if (project) {
    project.status = 'Archived';
    await saveProject(project);
    return { success: true };
  }
  return { success: false, error: 'Project not found' };
};

export const duplicateProject = async (projectId, newName) => {
  const original = await loadProject(projectId);
  if (!original) throw new Error('Original project not found');

  const newId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  const copy = {
    ...original,
    id: newId,
    name: newName,
    createdDate: timestamp,
    lastModifiedDate: timestamp,
    auditTrail: [{ action: 'duplicate', timestamp, details: `Duplicated from ${original.name}` }]
  };

  await saveProject(copy);
  return newId;
};

// --- Internal Helpers ---

async function updateProjectMetadata(newMeta) {
  const list = (await get(METADATA_STORE_KEY)) || [];
  const index = list.findIndex(p => p.id === newMeta.id);
  
  if (index >= 0) {
    list[index] = newMeta;
  } else {
    list.push(newMeta);
  }
  
  await set(METADATA_STORE_KEY, list);
}