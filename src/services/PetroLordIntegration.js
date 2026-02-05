import { v4 as uuidv4 } from 'uuid';

class PetroLordIntegrationService {
  constructor() {
    this.isConnected = false;
    this.token = null;
    this.syncQueue = [];
    this.syncStatus = 'idle'; // idle, syncing, error
    this.healthCheckInterval = null;
    this.listeners = [];
  }

  // --- Authentication ---
  async authenticate(clientId, clientSecret) {
    // Mock OAuth2 flow
    console.log("Authenticating with PetroLord Suite...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (clientId && clientSecret) {
      this.token = `pl_token_${uuidv4()}`;
      this.isConnected = true;
      this.startHealthCheck();
      this.notifyListeners('auth_success');
      return { success: true, token: this.token };
    }
    return { success: false, error: "Invalid credentials" };
  }

  logout() {
    this.isConnected = false;
    this.token = null;
    this.stopHealthCheck();
    this.notifyListeners('logout');
  }

  // --- Data Sync Queue ---
  addToSyncQueue(item) {
    this.syncQueue.push({ ...item, id: uuidv4(), status: 'pending', retries: 0 });
    this.processQueue();
  }

  async processQueue() {
    if (this.syncStatus === 'syncing' || this.syncQueue.length === 0) return;

    this.syncStatus = 'syncing';
    this.notifyListeners('sync_start');

    const item = this.syncQueue.find(i => i.status === 'pending');
    if (!item) {
      this.syncStatus = 'idle';
      return;
    }

    try {
      await this.syncItem(item);
      item.status = 'completed';
      // Remove completed
      this.syncQueue = this.syncQueue.filter(i => i.id !== item.id);
    } catch (error) {
      console.error("Sync failed for item:", item, error);
      item.retries += 1;
      if (item.retries > 3) { // Exponential backoff logic would be here
        item.status = 'failed';
      } else {
        // Move to end to retry later
        this.syncQueue = this.syncQueue.filter(i => i.id !== item.id);
        this.syncQueue.push(item);
      }
    }

    this.syncStatus = 'idle';
    this.notifyListeners('sync_update');
    
    if (this.syncQueue.some(i => i.status === 'pending')) {
      setTimeout(() => this.processQueue(), 1000); // Delay between items
    }
  }

  async syncItem(item) {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800));
    if (Math.random() < 0.1) throw new Error("Random network jitter");
    return true;
  }

  // --- Health Check ---
  startHealthCheck() {
    if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
    this.healthCheckInterval = setInterval(async () => {
      const isHealthy = await this.checkConnection();
      if (!isHealthy && this.isConnected) {
        console.warn("PetroLord connection lost");
        this.notifyListeners('health_warning');
      }
    }, 30000);
  }

  stopHealthCheck() {
    if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
  }

  async checkConnection() {
    // Mock ping
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
  }

  // --- Events ---
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(event) {
    this.listeners.forEach(cb => cb({ type: event, service: this }));
  }
  
  getIntegrationStatus() {
      return {
          connected: this.isConnected,
          queueLength: this.syncQueue.length,
          syncStatus: this.syncStatus
      };
  }
}

export const petroLordService = new PetroLordIntegrationService();