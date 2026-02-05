import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'casing_wear_projects';

/**
 * Creates a new project structure.
 */
export const createProject = (wellData, projectName, description) => {
  return {
    id: uuidv4(),
    wellId: wellData?.id,
    wellName: wellData?.name,
    name: projectName,
    description: description || '',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    versions: []
  };
};

/**
 * Creates a new version object.
 */
export const createVersion = (projectId, versionName, versionNotes, caseData) => {
  return {
    id: uuidv4(),
    projectId,
    name: versionName,
    notes: versionNotes || '',
    data: JSON.parse(JSON.stringify(caseData)), // Deep clone to prevent reference issues
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    status: 'Draft'
  };
};

/**
 * Loads all projects from local storage.
 */
export const listProjects = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load projects', error);
    return [];
  }
};

/**
 * Saves the projects list to local storage.
 */
export const saveProjectsToStorage = (projects) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects', error);
  }
};

/**
 * Helper to update a specific project in the list.
 */
export const updateProjectInStorage = (project) => {
  const projects = listProjects();
  const index = projects.findIndex(p => p.id === project.id);
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  saveProjectsToStorage(projects);
};

export const deleteProjectFromStorage = (projectId) => {
    const projects = listProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    saveProjectsToStorage(filtered);
    return filtered;
}