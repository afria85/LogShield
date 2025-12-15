// src/lib/storage.js
// LocalStorage utilities with error handling and encryption support

// ============================================
// STORAGE CLASS
// ============================================

class Storage {
  constructor(prefix = 'logshield_') {
    this.prefix = prefix;
    this.isAvailable = this.checkAvailability();
  }

  /**
   * Check if localStorage is available
   */
  checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get item from localStorage
   */
  get(key, defaultValue = null) {
    if (!this.isAvailable) return defaultValue;
    
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (item === null) return defaultValue;
      
      // Try to parse as JSON
      try {
        return JSON.parse(item);
      } catch {
        return item; // Return as string if not valid JSON
      }
    } catch (error) {
      console.error(`Storage.get error for key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Set item in localStorage
   */
  set(key, value) {
    if (!this.isAvailable) return false;
    
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.error(`Storage.set error for key "${key}":`, error);
      
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        this.handleQuotaExceeded();
      }
      
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key) {
    if (!this.isAvailable) return false;
    
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error(`Storage.remove error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  has(key) {
    if (!this.isAvailable) return false;
    
    try {
      return localStorage.getItem(this.prefix + key) !== null;
    } catch {
      return false;
    }
  }

  /**
   * Clear all app data
   */
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
      console.error('Storage.clear error:', error);
      return false;
    }
  }

  /**
   * Get all keys (without prefix)
   */
  getAllKeys() {
    if (!this.isAvailable) return [];
    
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.substring(this.prefix.length));
    } catch (error) {
      console.error('Storage.getAllKeys error:', error);
      return [];
    }
  }

  /**
   * Get all items as object
   */
  getAll() {
    if (!this.isAvailable) return {};
    
    const result = {};
    const keys = this.getAllKeys();
    
    keys.forEach(key => {
      result[key] = this.get(key);
    });
    
    return result;
  }

  /**
   * Get storage size (approximate bytes)
   */
  getSize() {
    if (!this.isAvailable) return 0;
    
    try {
      let size = 0;
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key);
          size += key.length + (value ? value.length : 0);
        }
      });
      
      // Multiply by 2 for UTF-16 encoding
      return size * 2;
    } catch (error) {
      console.error('Storage.getSize error:', error);
      return 0;
    }
  }

  /**
   * Format size for display
   */
  formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  /**
   * Get human-readable storage size
   */
  getFormattedSize() {
    return this.formatSize(this.getSize());
  }

  /**
   * Handle quota exceeded error
   */
  handleQuotaExceeded() {
    console.warn('Storage quota exceeded, attempting cleanup...');
    
    // Remove old usage data first
    const keys = this.getAllKeys();
    const usageKeys = keys.filter(k => k.includes('usage'));
    
    usageKeys.forEach(key => {
      this.remove(key);
    });
  }

  /**
   * Set item with expiration
   */
  setWithExpiry(key, value, ttlMs) {
    const item = {
      value,
      expiry: Date.now() + ttlMs
    };
    return this.set(key, item);
  }

  /**
   * Get item with expiration check
   */
  getWithExpiry(key, defaultValue = null) {
    const item = this.get(key);
    
    if (!item || typeof item !== 'object') {
      return defaultValue;
    }
    
    if (item.expiry && Date.now() > item.expiry) {
      this.remove(key);
      return defaultValue;
    }
    
    return item.value !== undefined ? item.value : defaultValue;
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

const storage = new Storage('logshield_');

// ============================================
// EXPORTS
// ============================================

export { Storage, storage };
export default storage;

// Export utility functions
export function getItem(key, defaultValue = null) {
  return storage.get(key, defaultValue);
}

export function setItem(key, value) {
  return storage.set(key, value);
}

export function removeItem(key) {
  return storage.remove(key);
}

export function clearStorage() {
  return storage.clear();
}

export function getStorageSize() {
  return storage.getFormattedSize();
}
