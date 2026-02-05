const DB_NAME = 'ReservoirCalcProDB';
const META_STORE = 'maps_meta';
const DATA_STORE = 'maps_data';
const DB_VERSION = 1;

// Helper to open DB
const openDB = () => {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject("IndexedDB is not supported in this environment.");
            return;
        }
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = (event) => {
            console.error("IndexedDB error:", event.target.error);
            reject("Failed to open database");
        };
        request.onsuccess = (event) => resolve(event.target.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(META_STORE)) db.createObjectStore(META_STORE, { keyPath: 'id' });
            if (!db.objectStoreNames.contains(DATA_STORE)) db.createObjectStore(DATA_STORE, { keyPath: 'id' });
        };
    });
};

// Helper for transactions
const performTransaction = (storeName, mode, callback) => {
    return openDB().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], mode);
            const store = transaction.objectStore(storeName);
            const request = callback(store);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    });
};

export class MapStorageService {
    static async saveMap(mapData) {
        try {
            const mapId = mapData.id || `map_${Date.now()}`;
            const timestamp = new Date().toISOString();
            const { data, ...meta } = mapData;
            const metaRecord = {
                ...meta,
                id: mapId,
                createdAt: meta.createdAt || timestamp,
                sizeBytes: data ? JSON.stringify(data).length : 0
            };
            const dataRecord = { id: mapId, data: data };
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction([META_STORE, DATA_STORE], 'readwrite');
                tx.oncomplete = () => resolve(mapId);
                tx.onerror = (e) => reject(e.target.error);
                tx.objectStore(META_STORE).put(metaRecord);
                tx.objectStore(DATA_STORE).put(dataRecord);
            });
        } catch (error) {
            console.error("MapStorageService Error:", error);
            if (error && error.name === 'QuotaExceededError') throw new Error("Storage quota exceeded. Please delete old maps.");
            throw error;
        }
    }

    static async getAllMaps() {
        try {
            const metaList = await performTransaction(META_STORE, 'readonly', store => store.getAll());
            // CRITICAL: Always return an array
            const safeList = Array.isArray(metaList) ? metaList : [];
            return safeList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error("Failed to load maps:", error);
            return []; // Return empty array on error
        }
    }

    static async getMapData(mapId) {
        try {
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction([META_STORE, DATA_STORE], 'readonly');
                let meta, dataWrapper;
                tx.objectStore(META_STORE).get(mapId).onsuccess = (e) => meta = e.target.result;
                tx.objectStore(DATA_STORE).get(mapId).onsuccess = (e) => dataWrapper = e.target.result;
                tx.oncomplete = () => {
                    if (!meta || !dataWrapper) resolve(null);
                    else resolve({ ...meta, data: dataWrapper.data });
                };
                tx.onerror = (e) => reject(e.target.error);
            });
        } catch (error) {
            console.error(`Failed to load map data ${mapId}:`, error);
            return null;
        }
    }

    static async deleteMap(mapId) {
        try {
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction([META_STORE, DATA_STORE], 'readwrite');
                tx.objectStore(META_STORE).delete(mapId);
                tx.objectStore(DATA_STORE).delete(mapId);
                tx.oncomplete = () => resolve();
                tx.onerror = (e) => reject(e.target.error);
            });
        } catch (error) {
            console.error("Failed to delete map:", error);
        }
    }

    static formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    static exportMap(map) {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(map));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", (map.name || "map") + ".json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } catch(e) {
            console.error("Export failed", e);
        }
    }
}