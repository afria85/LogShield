// src/lib/license.js (clean, production-safe rewrite)
// Minimal, robust license manager used by the UI.
// This file intentionally avoids complex classes and keeps a stable API
// to ensure compatibility with the existing frontend components.

export const licenseManager = {
  currentLicense: { tier: 'free', name: 'Free' },

  // Load/save helpers
  _storageKey: 'logshield_license',

  loadLicense() {
    try {
      const raw = localStorage.getItem(this._storageKey);
      if (!raw) return this.setDefaultLicense();
      const parsed = JSON.parse(raw);
      this.currentLicense = { ...this.getDefaultLicense(), ...parsed };
    } catch (e) {
      this.setDefaultLicense();
    }
  },

  saveLicense() {
    try {
      localStorage.setItem(this._storageKey, JSON.stringify(this.currentLicense));
    } catch (e) {}
  },

  setDefaultLicense() {
    this.currentLicense = this.getDefaultLicense();
    this.saveLicense();
  },

  getDefaultLicense() {
    const now = Date.now();
    return {
      tier: 'free',
      name: 'Free',
      key: 'FREE-' + now,
      activated: now,
      expiresAt: now + (365 * 24 * 60 * 60 * 1000 * 10), // 10 years default
      features: this.getTierFeatures('free'),
      limits: this.getTierLimits('free')
    };
  },

  getTierLimits(tier) {
    const map = {
      free:  { dailySanitizations: 1000, monthlySanitizations: 5000, charLimit: 200000 },
      starter:{ dailySanitizations: 5000, monthlySanitizations: 50000, charLimit: 300000 },
      pro:   { dailySanitizations: 50000, monthlySanitizations: 500000, charLimit: 1000000 },
      team:  { dailySanitizations: 500000, monthlySanitizations: 5000000, charLimit: 5000000 },
      lifetime: { dailySanitizations: Infinity, monthlySanitizations: Infinity, charLimit: Infinity }
    };
    return map[tier] || map.free;
  },

  getTierFeatures(tier) {
    const features = {
      free: { entropy: false, export: ['txt'] },
      starter: { entropy: false, export: ['txt','csv'] },
      pro: { entropy: true, export: ['txt','csv','json'] },
      team: { entropy: true, export: ['txt','csv','json','xml'] },
      lifetime: { entropy: true, export: ['txt','csv','json','xml'] }
    };
    return features[tier] || features.free;
  },

  // Basic license setters
  setLicense(licenseData) {
    try {
      if (!licenseData || !licenseData.tier) return false;
      const now = Date.now();
      this.currentLicense = {
        tier: (licenseData.tier || 'free').toLowerCase(),
        name: licenseData.name || licenseData.tier,
        key: licenseData.key || `LIC-${now}`,
        activated: licenseData.activated || now,
        expiresAt: licenseData.expiresAt || (now + 365 * 24 * 60 * 60 * 1000),
        features: this.getTierFeatures(licenseData.tier),
        limits: this.getTierLimits(licenseData.tier)
      };
      this.saveLicense();
      return true;
    } catch (e) {
      return false;
    }
  },

  clearLicense() {
    try {
      localStorage.removeItem(this._storageKey);
      this.setDefaultLicense();
      return true;
    } catch (e) {
      return false;
    }
  },

  // Usage tracking - per-tier daily counter
  trackUsage() {
    try {
      const tier = this.currentLicense?.tier || 'free';
      const key = `logshield_usage_${tier}`;
      const today = new Date().toISOString().slice(0,10);
      const store = JSON.parse(localStorage.getItem(key) || "{}");
      if (store.date !== today) {
        store.date = today;
        store.count = 0;
      }
      store.count = (store.count || 0) + 1;
      localStorage.setItem(key, JSON.stringify(store));
    } catch (e) {}
  },

  getUsageStats() {
    try {
      const tier = this.currentLicense?.tier || 'free';
      const key = `logshield_usage_${tier}`;
      const today = new Date().toISOString().slice(0,10);
      const store = JSON.parse(localStorage.getItem(key) || "{}");
      const used = (store.date === today ? (store.count || 0) : 0);

      const limits = this.getTierLimits(tier);
      const limit = limits?.dailySanitizations ?? Infinity;
      const remaining = (limit === Infinity) ? Infinity : Math.max(0, limit - used);
      const percentage = (limit === Infinity || limit === 0) ? 0 : Math.min(100, (used / limit) * 100);
      const limitReached = (limit !== Infinity) ? used >= limit : false;

      const resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + 1);
      resetDate.setHours(0,0,0,0);

      return { used, limit, remaining, percentage, limitReached, resetDate };
    } catch (e) {
      return { used: 0, limit: Infinity, remaining: Infinity, percentage: 0, limitReached: false, resetDate: new Date() };
    }
  },

  getTierInfo() {
    const tier = this.currentLicense?.tier || 'free';
    const limits = this.getTierLimits(tier);
    return {
      tier,
      charLimit: limits?.charLimit ?? Infinity,
      features: this.getTierFeatures(tier)
    };
  }
};

export default licenseManager;
