// Helpers for external API calls

export const postToExternalAPI = async (endpoint, payload, apiKey) => {
    // Mock implementation
    console.log(`POST ${endpoint} with key ${apiKey ? 'PRESENT' : 'MISSING'}`);
    return { success: true, transactionId: 'tx_' + Math.random().toString(36).substr(2, 9) };
};