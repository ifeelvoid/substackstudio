// Extension Sync - Communication between Chrome Extension and Web App

export interface ExtensionData {
  notes: any[];
  analytics: any[];
  latestAnalytics: any;
  timestamp: string;
}

export class ExtensionSync {
  private static instance: ExtensionSync;
  private syncInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): ExtensionSync {
    if (!ExtensionSync.instance) {
      ExtensionSync.instance = new ExtensionSync();
    }
    return ExtensionSync.instance;
  }

  // Check if Chrome extension is available
  isExtensionAvailable(): boolean {
    return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
  }

  // Get data from extension
  async getExtensionData(): Promise<ExtensionData | null> {
    if (!this.isExtensionAvailable()) {
      console.log('Extension not available, using localStorage');
      return this.getLocalStorageData();
    }

    try {
      return new Promise((resolve) => {
        chrome.storage.local.get(['dashboardSync'], (result) => {
          if (chrome.runtime.lastError) {
            console.error('Extension error:', chrome.runtime.lastError);
            resolve(null);
          } else {
            resolve((result.dashboardSync as ExtensionData) || null);
          }
        });
      });
    } catch (error) {
      console.error('Error getting extension data:', error);
      return null;
    }
  }

  // Fallback to localStorage for web-only mode
  private getLocalStorageData(): ExtensionData | null {
    try {
      const data = localStorage.getItem('substackStudioData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return null;
    }
  }

  // Save data to localStorage (for web-only mode)
  saveToLocalStorage(data: ExtensionData): void {
    try {
      localStorage.setItem('substackStudioData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Request sync from extension
  async requestSync(): Promise<boolean> {
    if (!this.isExtensionAvailable()) {
      return false;
    }

    try {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'syncData' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Sync error:', chrome.runtime.lastError);
            resolve(false);
          } else {
            resolve(response?.success || false);
          }
        });
      });
    } catch (error) {
      console.error('Error requesting sync:', error);
      return false;
    }
  }

  // Start automatic sync (every 30 seconds)
  startAutoSync(callback: (data: ExtensionData | null) => void): void {
    this.stopAutoSync();

    this.syncInterval = setInterval(async () => {
      const data = await this.getExtensionData();
      if (data) {
        callback(data);
      }
    }, 30000); // 30 seconds

    // Initial sync
    this.getExtensionData().then(callback);
  }

  // Stop automatic sync
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Listen for extension messages
  listenForExtensionMessages(callback: (message: any) => void): void {
    if (!this.isExtensionAvailable()) return;

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      callback(message);
      sendResponse({ received: true });
      return true;
    });
  }
}

// Export singleton instance
export const extensionSync = ExtensionSync.getInstance();
