// src/lib/storage.js
// LocalStorage utilities with error handling

class Storage {
  constructor() {
    this.prefix = 'logshield_';
    this.isAvailable = this.checkAvailability();
  }

  // Check if localStorage is available
  checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Get item from localStorage
  get(key) {
    if (!this.isAvailable) return null;
    
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  }

  // Set item in localStorage
  set(key, value) {
    if (!this.isAvailable) return false;
    
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
      return false;
    }
  }

  // Remove item from localStorage
  remove(key) {
    if (!this.isAvailable) return false;
    
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  }

  // Clear all app data
  clear() {
    if (!this.isAvailable) return false;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Get all keys
  getAllKeys() {
    if (!this.isAvailable) return [];
    
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.substring(this.prefix.length));
    } catch (error) {
      console.error('Error getting keys from storage:', error);
      return [];
    }
  }

  // Get storage size (approximate)
  getSize() {
    if (!this.isAvailable) return 0;
    
    try {
      let size = 0;
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          size += localStorage.getItem(key).length;
        }
      });
      return size;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  // Format size for display
  formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}