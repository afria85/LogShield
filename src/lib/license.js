// src/lib/license.js
// License management and validation system

const LICENSE_TIERS = {
  free: {
    name: 'Free',
    charLimit: 3000,
    usesPerMonth: 5,
    patterns: 'basic',
    features: {
      entropy: false,
      export: false,
      batch: false,
      api: false
    }
  },
  starter: {
    name: 'Starter',
    charLimit: 10000,
    usesPerMonth: 50,
    patterns: 'standard',
    price: 7,
    features: {
      entropy: false,
      export: true,
      batch: false,
      api: false
    }
  },
  pro: {
    name: 'Pro',
    charLimit: Infinity,
    usesPerMonth: Infinity,
    patterns: 'advanced',
    price: 19,
    features: {
      entropy: true,
      export: true,
      batch: true,
      api: false
    }
  },
  team: {
    name: 'Team',
    charLimit: Infinity,
    usesPerMonth: Infinity,
    patterns: 'advanced',
    seats: 5,
    price: 79,
    features: {
      entropy: true,
      export: true,
      batch: true,
      api: true,
      shared: true,
      sso: true
    }
  },
  lifetime: {
    name: 'Lifetime',
    charLimit: Infinity,
    usesPerMonth: Infinity,
    patterns: 'advanced',
    price: 199,
    oneTime: true,
    features: {
      entropy: true,
      export: true,
      batch: true,
      api: true,
      shared: true,
      sso: true,
      whiteLabel: true
    }
  }
};

export class LicenseManager {
  constructor() {
    this.storageKey = 'logshield_license';
    this.usageKey = 'logshield_usage';
    this.currentLicense = this.loadLicense();
    this.usage = this.loadUsage();
  }

  // Load license from localStorage
  loadLicense() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const license = JSON.parse(stored);
        if (this.validateLicense(license)) {
          return license;
        }
      }
    } catch (e) {
      console.error('Failed to load license:', e);
    }
    return this.getDefaultLicense();
  }

  // Get default free license
  getDefaultLicense() {
    return {
      tier: 'free',
      key: null,
      activated: Date.now(),
      expires: null,
      deviceId: this.getDeviceId()
    };
  }

  // Validate license
  validateLicense(license) {
    if (!license || !license.tier) return false;
    
    // Check expiration
    if (license.expires && Date.now() > license.expires) {
      return false;
    }

    // Check device binding (anti-piracy)
    if (license.key && license.deviceId !== this.getDeviceId()) {
      console.warn('License is bound to another device');
      return false;
    }

    return true;
  }

  // Get device fingerprint
  getDeviceId() {
    let deviceId = localStorage.getItem('logshield_device_id');
    if (!deviceId) {
      deviceId = this.generateDeviceId();
      localStorage.setItem('logshield_device_id', deviceId);
    }
    return deviceId;
  }

  generateDeviceId() {
    const nav = navigator;
    const screen = window.screen;
    const components = [
      nav.userAgent,
      nav.language,
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset()
    ];
    return this.hashCode(components.join('|'));
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  // Activate license
  async activateLicense(licenseKey) {
    try {
      // In production, this would verify with backend
      // For now, we'll do basic validation
      const tier = this.parseLicenseKey(licenseKey);
      
      if (!tier) {
        throw new Error('Invalid license key');
      }

      const license = {
        tier,
        key: licenseKey,
        activated: Date.now(),
        expires: tier === 'lifetime' ? null : Date.now() + (365 * 24 * 60 * 60 * 1000),
        deviceId: this.getDeviceId()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(license));
      this.currentLicense = license;

      return { success: true, license };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Parse license key to determine tier
  parseLicenseKey(key) {
    // Format: LS-TIER-XXXX-XXXX-XXXX
    const parts = key.split('-');
    if (parts[0] !== 'LS' || parts.length !== 5) {
      return null;
    }

    const tierMap = {
      'STR': 'starter',
      'PRO': 'pro',
      'TEAM': 'team',
      'LIFE': 'lifetime'
    };

    return tierMap[parts[1]] || null;
  }

  // Track usage
  trackUsage() {
    const now = Date.now();
    const currentMonth = new Date().getMonth();
    
    if (!this.usage || this.usage.month !== currentMonth) {
      this.usage = {
        month: currentMonth,
        count: 0,
        lastUsed: now
      };
    }

    this.usage.count++;
    this.usage.lastUsed = now;
    localStorage.setItem(this.usageKey, JSON.stringify(this.usage));
  }

  loadUsage() {
    try {
      const stored = localStorage.getItem(this.usageKey);
      if (stored) {
        const usage = JSON.parse(stored);
        const currentMonth = new Date().getMonth();
        if (usage.month === currentMonth) {
          return usage;
        }
      }
    } catch (e) {
      console.error('Failed to load usage:', e);
    }
    return { month: new Date().getMonth(), count: 0, lastUsed: Date.now() };
  }

  // Check if can use feature
  canUse(feature) {
    const tier = LICENSE_TIERS[this.currentLicense.tier];
    
    if (!tier) return false;

    // Check monthly limit
    if (tier.usesPerMonth !== Infinity && this.usage.count >= tier.usesPerMonth) {
      return false;
    }

    // Check feature availability
    if (feature && !tier.features[feature]) {
      return false;
    }

    return true;
  }

  // Check character limit
  checkCharLimit(textLength) {
    const tier = LICENSE_TIERS[this.currentLicense.tier];
    return textLength <= tier.charLimit;
  }

  // Get tier info
  getTierInfo() {
    return LICENSE_TIERS[this.currentLicense.tier];
  }

  // Get all tiers (for pricing page)
  getAllTiers() {
    return LICENSE_TIERS;
  }

  // Get usage stats
  getUsageStats() {
    const tier = this.getTierInfo();
    return {
      used: this.usage.count,
      limit: tier.usesPerMonth,
      remaining: tier.usesPerMonth === Infinity 
        ? Infinity 
        : Math.max(0, tier.usesPerMonth - this.usage.count),
      resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    };
  }

  // Upgrade tier
  async upgrade(newTier, paymentToken) {
    // In production, this would process payment via Lemon Squeezy
    // For demo, we'll simulate
    try {
      const license = {
        tier: newTier,
        key: this.generateLicenseKey(newTier),
        activated: Date.now(),
        expires: newTier === 'lifetime' ? null : Date.now() + (365 * 24 * 60 * 60 * 1000),
        deviceId: this.getDeviceId(),
        paymentId: paymentToken
      };

      localStorage.setItem(this.storageKey, JSON.stringify(license));
      this.currentLicense = license;

      return { success: true, license };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  generateLicenseKey(tier) {
    const tierCodes = {
      'starter': 'STR',
      'pro': 'PRO',
      'team': 'TEAM',
      'lifetime': 'LIFE'
    };
    
    const random = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    return `LS-${tierCodes[tier]}-${random()}-${random()}-${random()}`;
  }

  // Deactivate license
  deactivate() {
    localStorage.removeItem(this.storageKey);
    this.currentLicense = this.getDefaultLicense();
  }
}

// Export singleton instance
export const licenseManager = new LicenseManager();