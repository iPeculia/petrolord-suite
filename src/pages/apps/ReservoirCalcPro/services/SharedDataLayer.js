import { PetroLordIntegrationManager } from './PetroLordIntegrationManager';

export class SharedDataLayer {
    // High-level abstraction for ReservoirCalc

    static async getSurfaces() {
        return await PetroLordIntegrationManager.fetchSharedData({ category: 'surface' });
    }

    static async getPolygons() {
        return await PetroLordIntegrationManager.fetchSharedData({ category: 'polygon' });
    }

    static async getFluidContacts() {
        return await PetroLordIntegrationManager.fetchSharedData({ category: 'contacts' });
    }

    static async getPPFGData() {
        return await PetroLordIntegrationManager.fetchSharedData({ sourceApp: 'ppfg-analyzer' });
    }

    static async getVelocityData() {
        return await PetroLordIntegrationManager.fetchSharedData({ sourceApp: 'velocity-model-builder' });
    }

    static async importData(dataId) {
        // In a real scenario, we might need to fetch the full payload if it wasn't included in the list
        // But fetchSharedData gets select('*'), so we have payload.
        // This method is just a placeholder for complex import logic (e.g., transformation).
        const data = await PetroLordIntegrationManager.fetchSharedData(); 
        return data.find(d => d.id === dataId);
    }

    static async shareResult(name, resultObject, projectId) {
        return await PetroLordIntegrationManager.publishData({
            projectId,
            dataName: name,
            dataCategory: 'result',
            description: 'ReservoirCalc Pro Volume Result',
            payload: resultObject,
            isPublic: true
        });
    }
}