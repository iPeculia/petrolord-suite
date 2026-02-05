export class AutoSaveManager {
  constructor(saveCallback, intervalMinutes = 5) {
    this.saveCallback = saveCallback;
    this.intervalMinutes = intervalMinutes;
    this.timer = null;
    this.lastSaveTime = Date.now();
    this.isDirty = false;
  }

  start() {
    this.stop();
    if (this.intervalMinutes > 0) {
      const intervalMs = this.intervalMinutes * 60 * 1000;
      this.timer = setInterval(() => this.checkAndSave(), intervalMs);
      console.log(`[MBAutoSave] Started. Interval: ${this.intervalMinutes} min`);
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  setDirty(isDirty) {
    this.isDirty = isDirty;
  }

  setInterval(minutes) {
    this.intervalMinutes = minutes;
    this.start();
  }

  async checkAndSave() {
    if (this.isDirty && this.saveCallback) {
      console.log("[MBAutoSave] Triggering auto-save...");
      try {
        await this.saveCallback();
        this.lastSaveTime = Date.now();
        this.isDirty = false;
      } catch (error) {
        console.error("[MBAutoSave] Failed:", error);
      }
    }
  }
}