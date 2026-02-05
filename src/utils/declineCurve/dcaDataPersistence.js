import { get, set, del, keys } from 'idb-keyval';

const STORAGE_PREFIX = 'dca_project_';
const METADATA_KEY = 'dca_projects_metadata';

export const saveProjectToLocalStorage = (projectId, projectData) => {
  try {
    const key = `${STORAGE_PREFIX}${projectId}`;
    const serialized = JSON.stringify(projectData);
    localStorage.setItem(key, serialized);
    updateMetadata(projectId, projectData.name);
    return { success: true };
  } catch (error) {
    console.error('Local Storage Save Error:', error);
    return { success: false, error };
  }
};

export const loadProjectFromLocalStorage = (projectId) => {
  try {
    const key = `${STORAGE_PREFIX}${projectId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Local Storage Load Error:', error);
    return null;
  }
};

export const saveProjectToIndexedDB = async (projectId, projectData) => {
  try {
    await set(projectId, projectData);
    updateMetadata(projectId, projectData.name, 'indexeddb');
    return { success: true };
  } catch (error) {
    console.error('IndexedDB Save Error:', error);
    return { success: false, error };
  }
};

export const loadProjectFromIndexedDB = async (projectId) => {
  try {
    return await get(projectId);
  } catch (error) {
    console.error('IndexedDB Load Error:', error);
    return null;
  }
};

const updateMetadata = (id, name, type = 'local') => {
  try {
    const metaStr = localStorage.getItem(METADATA_KEY);
    const meta = metaStr ? JSON.parse(metaStr) : [];
    const now = new Date().toISOString();
    
    const existingIndex = meta.findIndex(p => p.id === id);
    if (existingIndex >= 0) {
      meta[existingIndex] = { ...meta[existingIndex], name, modified: now, type };
    } else {
      meta.push({ id, name, created: now, modified: now, type });
    }
    
    localStorage.setItem(METADATA_KEY, JSON.stringify(meta));
  } catch (e) {
    console.warn('Failed to update project metadata', e);
  }
};

export const listAllProjects = () => {
  try {
    const metaStr = localStorage.getItem(METADATA_KEY);
    return metaStr ? JSON.parse(metaStr) : [];
  } catch (e) {
    return [];
  }
};

export const exportProjectAsJSON = (projectData) => {
  try {
    const json = JSON.stringify(projectData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectData.name || 'project'}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const importProjectFromJSON = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        // Basic validation
        if (!data.id || !data.name) throw new Error("Invalid project structure");
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};