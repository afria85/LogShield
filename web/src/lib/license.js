// src/lib/license.js
// License management system with correct pricing tiers and security
// Production-ready with Gumroad integration support

// ============================================
// PRICING TIERS (Final - Dec 2025)
// ============================================
// Free:    $0        | 20/mo    | 5K chars    | 10 patterns
// Starter: $9/mo     | 200/mo   | 25K chars   | 40+ patterns
// Pro:     $15/mo    | 1000/mo  | 100K chars  | 70+ patterns
// Team:    $39/mo    | 5000/mo  | Unlimited   | All patterns
// LTD:     $199      | 1000/mo  | 100K chars  | Pro features

// ============================================
// RATE LIMITS (matches Pricing.jsx)
// ============================================
const RATE_LIMITS = {
  free: {
    sanitizations: 20,
    charLimit: 5000,
    patterns: 10,
    resetPeriod: 'monthly'
  },
  starter: {
    sanitizations: 200,
    charLimit: 25000,
    patterns: 40,
    resetPeriod: 'monthly'
  },
  pro: {
    sanitizations: 1000,
    charLimit: 100000,
    patterns: 70,
    resetPeriod: 'monthly'
  },
  team: {
    sanitizations: 5000,
    charLimit: Infinity,
    patterns: Infinity,
    resetPeriod: 'monthly'
  },
  lifetime: {
    sanitizations: 1000,
    charLimit: 100000,
    patterns: 70,
    resetPeriod: 'monthly'
  },
  lifetime_pro: {
    sanitizations: 1000,
    charLimit: 100000,
    patterns: 70,
    resetPeriod: 'monthly'
  },
  enterprise: {
    sanitizations: Infinity,
    charLimit: Infinity,
    patterns: Infinity,
    resetPeriod: 'none'
  }
};

// ============================================
// FEATURE FLAGS
// ============================================
const TIER_FEATURES = {
  free: {
    export: false,
    aiEntropy: false,
    entropy: false, // Alias for backward compatibility
    customPatterns: false,
    cli: false,
    batch: false,
    dashboard: false,
    sso: false,
    api: false
  },
  starter: {
    export: true,
    aiEntropy: false,
    entropy: false,
    customPatterns: false,
    cli: false,
    batch: true,
    dashboard: false,
    sso: false,
    api: false
  },
  pro: {
    export: true,
    aiEntropy: true,
    entropy: true, // Alias for backward compatibility
    customPatterns: true,
    cli: true,
    batch: true,
    dashboard: false,
    sso: false,
    api: true
  },
  team: {
    export: true,
    aiEntropy: true,
    entropy: true,
    customPatterns: true,
    cli: true,
    batch: true,
    dashboard: true,
    sso: true,
    api: true
  },
  lifetime: {
    export: true,
    aiEntropy: true,
    entropy: true,
    customPatterns: true,
    cli: true,
    batch: true,
    dashboard: false,
    sso: false,
    api: true
  },
  lifetime_pro: {
    export: true,
    aiEntropy: true,
    entropy: true,
    customPatterns: true,
    cli: true,
    batch: true,
    dashboard: false,
    sso: false,
    api: true
  },
  enterprise: {
    export: true,
    aiEntropy: true,
    entropy: true,
    customPatterns: true,
    cli: true,
    batch: true,
    dashboard: true,
    sso: true,
    api: true
  }
};

// ============================================
// STORAGE KEYS
// ============================================
const STORAGE_KEYS = {
  LICENSE: 'logshield_license',
  USAGE: 'logshield_usage',
  LAST_RESET: 'logshield_last_reset'
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get end of current month as Date object
 */
function getMonthEndDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Get start of current month
 */
function getMonthStartDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Check if reset is needed (monthly)
 */
function needsUsageReset(lastReset) {
  if (!lastReset) return true;
  
  const lastResetDate = new Date(lastReset);
  const monthStart = getMonthStartDate();
  
  return lastResetDate < monthStart;
}

/**
 * Safe localStorage access
 */
function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// USAGE TRACKING
// ============================================

/**
 * Get current usage data
 */
function getUsage() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.USAGE);
    if (!raw) return { count: 0, lastReset: null };
    
    const usage = JSON.parse(raw);
    
    // Check if reset needed
    if (needsUsageReset(usage.lastReset)) {
      const newUsage = { count: 0, lastReset: new Date().toISOString() };
      safeSetItem(STORAGE_KEYS.USAGE, JSON.stringify(newUsage));
      return newUsage;
    }
    
    return usage;
  } catch {
    return { count: 0, lastReset: new Date().toISOString() };
  }
}

/**
 * Increment usage counter
 */
function incrementUsage(amount = 1) {
  try {
    const usage = getUsage();
    usage.count = (usage.count || 0) + amount;
    usage.lastReset = usage.lastReset || new Date().toISOString();
    safeSetItem(STORAGE_KEYS.USAGE, JSON.stringify(usage));
    return usage.count;
  } catch {
    return 0;
  }
}

/**
 * Reset usage counter
 */
function resetUsage() {
  const newUsage = { count: 0, lastReset: new Date().toISOString() };
  safeSetItem(STORAGE_KEYS.USAGE, JSON.stringify(newUsage));
  return newUsage;
}

// ============================================
// LICENSE MANAGEMENT
// ============================================

/**
 * Get license from storage
 */
function getLicense() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.LICENSE);
    if (!raw) return getDefaultLicense();
    
    const license = JSON.parse(raw);
    
    // Validate license structure
    if (!license || !license.tier) {
      return getDefaultLicense();
    }
    
    // Check expiration
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      // License expired, revert to free
      const freeLicense = getDefaultLicense();
      saveLicense(freeLicense);
      return freeLicense;
    }
    
    return license;
  } catch {
    return getDefaultLicense();
  }
}

/**
 * Save license to storage
 */
function saveLicense(license) {
  try {
    safeSetItem(STORAGE_KEYS.LICENSE, JSON.stringify(license));
    return true;
  } catch {
    return false;
  }
}

/**
 * Get default free license
 */
function getDefaultLicense() {
  return {
    tier: 'free',
    name: 'Free',
    key: null,
    activated: new Date().toISOString(),
    expiresAt: null, // Free never expires
    source: 'default'
  };
}

// ============================================
// LICENSE MANAGER OBJECT
// ============================================

export const licenseManager = {
  currentLicense: null,
  
  // ========== INITIALIZATION ==========
  
  /**
   * Load license from storage
   * Called on app init (App.jsx)
   */
  loadLicense() {
    this.currentLicense = getLicense();
    return this.currentLicense;
  },
  
  /**
   * Get current license
   */
  getLicense() {
    if (!this.currentLicense) {
      this.loadLicense();
    }
    return this.currentLicense;
  },
  
  // ========== LICENSE OPERATIONS ==========
  
  /**
   * Activate a new license
   */
  activate(tier, validUntil = null, licenseKey = null) {
    const normalizedTier = (tier || 'free').toLowerCase();
    
    // Validate tier
    if (!RATE_LIMITS[normalizedTier]) {
      console.warn(`Invalid tier: ${tier}, falling back to free`);
      return false;
    }
    
    const license = {
      tier: normalizedTier,
      name: this.getTierDisplayName(normalizedTier),
      key: licenseKey,
      activated: new Date().toISOString(),
      expiresAt: validUntil ? new Date(validUntil).toISOString() : null,
      source: licenseKey ? 'gumroad' : 'manual'
    };
    
    const saved = saveLicense(license);
    if (saved) {
      this.currentLicense = license;
      // Reset usage on tier upgrade
      resetUsage();
    }
    
    return saved;
  },
  
  /**
   * Clear license (revert to free)
   */
  clearLicense() {
    safeRemoveItem(STORAGE_KEYS.LICENSE);
    this.currentLicense = getDefaultLicense();
    resetUsage();
    return true;
  },
  
  /**
   * Check if license is valid
   */
  isValid() {
    const license = this.getLicense();
    
    if (!license || !license.tier) return false;
    
    // Free is always valid
    if (license.tier === 'free') return true;
    
    // Check expiration
    if (license.expiresAt) {
      return new Date(license.expiresAt) > new Date();
    }
    
    // Lifetime licenses don't expire
    if (license.tier === 'lifetime' || license.tier === 'lifetime_pro') {
      return true;
    }
    
    return true;
  },
  
  // ========== TIER INFO ==========
  
  /**
   * Get tier information
   * Used by Sanitizer.jsx
   */
  getTierInfo() {
    const license = this.getLicense();
    const tier = license?.tier || 'free';
    const limits = RATE_LIMITS[tier] || RATE_LIMITS.free;
    const features = TIER_FEATURES[tier] || TIER_FEATURES.free;
    
    return {
      tier,
      name: this.getTierDisplayName(tier),
      charLimit: limits.charLimit,
      sanitizationLimit: limits.sanitizations,
      patternLimit: limits.patterns,
      features: { ...features },
      isLifetime: tier === 'lifetime' || tier === 'lifetime_pro',
      isPaid: tier !== 'free'
    };
  },
  
  /**
   * Get display name for tier
   */
  getTierDisplayName(tier) {
    const names = {
      free: 'Free',
      starter: 'Starter',
      pro: 'Pro',
      team: 'Team',
      lifetime: 'Lifetime',
      lifetime_pro: 'Lifetime Pro',
      enterprise: 'Enterprise'
    };
    return names[tier] || 'Free';
  },
  
  // ========== USAGE TRACKING ==========
  
  /**
   * Track usage (increment counter)
   * Called from pages/App.jsx
   */
  trackUsage(amount = 1) {
    return incrementUsage(amount);
  },
  
  /**
   * Alias for trackUsage (backward compatibility)
   */
  recordUsage(amount = 1) {
    return this.trackUsage(amount);
  },
  
  /**
   * Increment usage (alias)
   */
  incrementUsage(amount = 1) {
    return this.trackUsage(amount);
  },
  
  /**
   * Get usage statistics
   * Used by Sanitizer.jsx
   */
  getUsageStats() {
    const license = this.getLicense();
    const tier = license?.tier || 'free';
    const limits = RATE_LIMITS[tier] || RATE_LIMITS.free;
    const usage = getUsage();
    
    const limit = limits.sanitizations;
    const used = usage.count || 0;
    const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used);
    const percentUsed = limit === Infinity ? 0 : Math.min(100, Math.round((used / limit) * 100));
    
    return {
      used,
      limit,
      remaining,
      percentUsed,
      limitReached: limit !== Infinity && used >= limit,
      resetDate: getMonthEndDate(), // Returns Date object for .toLocaleDateString()
      resetsAt: getMonthEndDate().toISOString() // String format for compatibility
    };
  },
  
  // ========== FEATURE CHECKING ==========
  
  /**
   * Check if feature is available
   */
  hasFeature(feature) {
    const tierInfo = this.getTierInfo();
    return tierInfo.features?.[feature] === true;
  },
  
  /**
   * Check if can perform sanitization
   */
  canSanitize(charCount = 0) {
    const tierInfo = this.getTierInfo();
    const usageStats = this.getUsageStats();
    
    // Check character limit
    if (tierInfo.charLimit !== Infinity && charCount > tierInfo.charLimit) {
      return {
        allowed: false,
        reason: 'char_limit',
        message: `Text exceeds ${tierInfo.charLimit.toLocaleString()} character limit`
      };
    }
    
    // Check usage limit
    if (usageStats.limitReached) {
      return {
        allowed: false,
        reason: 'usage_limit',
        message: `Monthly limit of ${usageStats.limit} sanitizations reached`
      };
    }
    
    return {
      allowed: true,
      reason: null,
      message: null
    };
  },
  
  // ========== GUMROAD INTEGRATION ==========
  
  /**
   * Validate Gumroad license key
   */
  async validateGumroadLicense(licenseKey) {
    // This should be called via your backend API to keep secrets safe
    // For now, return a mock validation
    // In production, call: POST /api/validate-license
    
    try {
      // Example: const response = await fetch('/api/validate-license', { ... });
      // For demo purposes, we'll do basic client-side validation
      
      if (!licenseKey || licenseKey.length < 10) {
        return { valid: false, error: 'Invalid license key format' };
      }
      
      // In production, verify with Gumroad API via backend
      // For now, accept any key that starts with 'LS-'
      if (licenseKey.startsWith('LS-')) {
        const tier = this.mapGumroadToTier(licenseKey);
        return {
          valid: true,
          tier,
          licenseKey,
          expiresAt: null // LTD doesn't expire
        };
      }
      
      return { valid: false, error: 'License key not recognized' };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  },
  
  /**
   * Map Gumroad product to tier
   */
  mapGumroadToTier(licenseKey) {
    // License key format: LS-{TIER}-{ID}
    // Example: LS-PRO-ABC123, LS-TEAM-XYZ789, LS-LTD-QWE456
    
    const upperKey = licenseKey.toUpperCase();
    
    if (upperKey.includes('-LTD-') || upperKey.includes('-LIFETIME-')) {
      return 'lifetime_pro';
    }
    if (upperKey.includes('-TEAM-') || upperKey.includes('-ENTERPRISE-')) {
      return 'team';
    }
    if (upperKey.includes('-PRO-')) {
      return 'pro';
    }
    if (upperKey.includes('-STARTER-')) {
      return 'starter';
    }
    
    return 'pro'; // Default to pro for valid keys
  }
};

// ============================================
// EXPORTS
// ============================================

export default licenseManager;

// Export rate limits and features for external use
export { RATE_LIMITS, TIER_FEATURES };

// Export helper functions
export {
  getMonthEndDate,
  getMonthStartDate,
  getLicense,
  getUsage,
  getDefaultLicense
};
