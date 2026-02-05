import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'reservoir_calc_projects';
const BACKUP_KEY = 'reservoir_calc_projects_backup';

export const ProjectService = {
    /**
     * Fetch all projects from LocalStorage
     */
    async getProjects() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const projects = JSON.parse(raw);
            // Sort by updated_at desc
            return projects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        } catch (err) {
            console.error('ProjectService: Load Error', err);
            return [];
        }
    },

    /**
     * Save a project (Create or Update)
     */
    async saveProject(projectData, isNew = false) {
        try {
            const projects = await this.getProjects();
            
            // Create Backup before modification
            localStorage.setItem(BACKUP_KEY, JSON.stringify(projects));

            const timestamp = new Date().toISOString();
            let savedProject;

            if (isNew || !projectData.id) {
                // CREATE
                savedProject = {
                    ...projectData,
                    id: uuidv4(),
                    created_at: timestamp,
                    updated_at: timestamp,
                    version: 1,
                    history: [] // Initialize version history
                };
                projects.unshift(savedProject);
            } else {
                // UPDATE
                const index = projects.findIndex(p => p.id === projectData.id);
                if (index === -1) throw new Error("Project not found to update");

                const oldProject = projects[index];
                
                // Create a snapshot for history before updating
                const historyEntry = {
                    version: oldProject.version,
                    timestamp: oldProject.updated_at,
                    meta: { description: 'Auto-snapshot before save' }
                    // In a real app, we might store the full diff here, 
                    // but for localStorage size limits, we'll keep history metadata mostly
                };

                savedProject = {
                    ...oldProject,
                    ...projectData,
                    updated_at: timestamp,
                    version: (oldProject.version || 1) + 1,
                    history: [historyEntry, ...(oldProject.history || [])].slice(0, 10) // Keep last 10
                };
                
                projects[index] = savedProject;
            }

            // Persist
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    throw new Error("Storage Quota Exceeded. Delete old projects to save new ones.");
                }
                throw e;
            }

            return savedProject;
        } catch (err) {
            console.error('ProjectService: Save Error', err);
            throw err;
        }
    },

    /**
     * Delete a project
     */
    async deleteProject(projectId) {
        try {
            let projects = await this.getProjects();
            const initialLength = projects.length;
            projects = projects.filter(p => p.id !== projectId);
            
            if (projects.length === initialLength) return false;

            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
            return true;
        } catch (err) {
            console.error('ProjectService: Delete Error', err);
            throw err;
        }
    },

    /**
     * Export project to JSON file
     */
    exportToJSON(project) {
        try {
            const exportData = {
                meta: {
                    app: 'ReservoirCalc Pro',
                    version: '1.0',
                    exportDate: new Date().toISOString()
                },
                project: project
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            saveAs(blob, `${project.name.replace(/\s+/g, '_')}_v${project.version}.json`);
            return true;
        } catch (err) {
            console.error('ProjectService: Export Error', err);
            return false;
        }
    },

    /**
     * Import project from JSON file
     */
    async importFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    if (!json.project) {
                        throw new Error('Invalid project file format');
                    }
                    
                    // When importing, treat as a NEW project (duplicate) to avoid ID collisions
                    // unless specifically requested otherwise (omitted for simplicity)
                    const { id, created_at, updated_at, ...projectData } = json.project;
                    
                    const newProject = {
                        ...projectData,
                        name: `${projectData.name} (Imported)`,
                        version: 1
                    };

                    const saved = await this.saveProject(newProject, true);
                    resolve(saved);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error('File reading failed'));
            reader.readAsText(file);
        });
    },

    /**
     * Recover from Backup
     */
    async restoreBackup() {
        const backup = localStorage.getItem(BACKUP_KEY);
        if (backup) {
            localStorage.setItem(STORAGE_KEY, backup);
            return true;
        }
        return false;
    }
};