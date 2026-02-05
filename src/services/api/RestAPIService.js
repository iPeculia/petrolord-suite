/**
 * REST API Service
 * Manages API endpoints for external systems to access FDP data.
 */

export class RestAPIService {
    static BASE_URL = '/api/v1/fdp';

    static async getFieldData(fieldId) {
        return this._mockRequest(`${this.BASE_URL}/fields/${fieldId}`, {
            id: fieldId,
            name: "Golden Block",
            location: { lat: 4.5, lng: 10.2 },
            reserves: 450
        });
    }

    static async getWellData(wellId) {
        return this._mockRequest(`${this.BASE_URL}/wells/${wellId}`, {
            id: wellId,
            name: "Well-01",
            status: "Active",
            production: 15000
        });
    }

    static async getFDPDocument(fdpId) {
        return this._mockRequest(`${this.BASE_URL}/documents/${fdpId}`, {
            id: fdpId,
            title: "Final FDP Report",
            version: "1.2.0",
            status: "Approved"
        });
    }

    static async getAnalyticsData(projectId) {
        return this._mockRequest(`${this.BASE_URL}/analytics/${projectId}`, {
            npv: 125000000,
            irr: 18.5,
            payback: 4.2
        });
    }

    static async _mockRequest(endpoint, responseData) {
        console.log(`[REST API] GET ${endpoint}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Network delay
        return {
            status: 200,
            data: responseData,
            timestamp: new Date().toISOString()
        };
    }
}