import { saveAs } from 'file-saver';

export class BackupManager {
    
    /**
     * Create a full JSON backup of the project state
     */
    static createBackup(projectState, meta = {}) {
        const backupData = {
            version: "1.0",
            timestamp: new Date().toISOString(),
            meta: meta,
            data: projectState
        };
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json;charset=utf-8" });
        const filename = `BasinFlow_Backup_${meta.name || 'Project'}_${new Date().getTime()}.json`;
        saveAs(blob, filename);
        
        return filename;
    }

    /**
     * Restore from JSON file (Client-side processing)
     * @param {File} file 
     */
    static async restoreBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    // Basic validation
                    if (!json.version || !json.data) {
                        reject(new Error("Invalid backup file format"));
                        return;
                    }
                    resolve(json.data);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = (err) => reject(err);
            reader.readAsText(file);
        });
    }
}