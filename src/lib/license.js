// src/lib/license.js
// License and rate limiting for LogShield
// Last updated: December 2025
//
// ==========================================
// PRICING STRUCTURE (Final Agreed)
// ==========================================
// Free:      $0       | 20/mo    | 5K chars    | 10 patterns
// Starter:   $9/mo    | 200/mo   | 25K chars   | 40+ patterns
// Pro:       $15/mo   | 1000/mo  | 100K chars  | 70+ patterns
// Team:      $39/mo   | 5000/mo  | Unlimited   | All patterns
// LTD:       $199     | 1000/mo  | 100K chars  | Pro features (lifetime)
// ==========================================
//
// API COMPATIBILITY:
// - App.jsx: licenseManager.loadLicense(), licenseManager.currentLicense
// - pages/App.jsx: licenseManager.trackUsage()
// - Sanitizer.jsx: licenseManager.getTierInfo(), licenseManager.getUsageStats()
//   - tierInfo.charLimit, tierInfo.features.entropy, tierInfo.features.export
//   - usageStats.used, usageStats.limit, usageStats.resetDate (Date object!)
//
// SECURITY NOTE:
// This is client-side validation only. Determined users can bypass.
// For MVP targeting ethical developers, this is acceptable.
// Phase 2: Add serverless function for validation.

const STORAGE_KEY = 'logshield_license';
const USAGE_KEY = 'logshield_usage';

// Rate limits per tier
export const RATE_LIMITS = {
  free: {
    sanitizations: 20,
    perMonth: true,
    charLimit: 5000,
    patterns: 10,
    features: {
      export: false,
      customPatterns: false,
      cli: false,
      batch: false,
      aiEntropy: false,
      entropy: false,
    }
  },
  starter: {
    sanitizations: 200,
    perMonth: true,
    charLimit: 25000,
    patterns: 40,
    features: {
      export: true,
      customPatterns: false,
      cli: false,
      batch: false,
      aiEntropy: false,
      entropy: false,
    }
  },
  pro: {
    sanitizations: 1000,
    perMonth: true,
    charLimit: 100000,
    patterns: 70,
    features: {
      export: true,
      customPatterns: true,
      cli: true,
      batch: true,
      aiEntropy: true,
      entropy: true,
    }
  },
  team: {
    sanitizations: 5000,
    perMonth: true,
    charLimit: Infinity,
    patterns: Infinity,
    seats: 5,
    features: {
      export: true,
      customPatterns: true,
      cli: true,
      batch: true,
      aiEntropy: true,
      entropy: true,
      dashboard: true,
      sso: true,
    }
  },
  lifetime_pro: {
    sanitizations: 1000,
    perMonth: true,
    charLimit: 100000,
    patterns: 70,
    features: {
      export: true,
      customPatterns: true,
      cli: true,
      batch: true,
      aiEntropy: true,
      entropy: true,
    }
  }
};

// Pattern counts per tier (for UI display)
export const PATTERN_COUNTS = {
  free: 10,
  starter: 40,
  pro: 70,
  team: 'All',
  lifetime_pro: 70
};

// ==========================================
// Core Functions
// ==========================================

export function getLicense() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { tier: 'free', validUntil: null };
    }
    
    const license = JSON.parse(stored);
    
    if (license.validUntil && new Date(license.validUntil) < new Date()) {
      return { tier: 'free', validUntil: null };
    }
    
    return license;
  } catch {
    return { tier: 'free', validUntil: null };
  }
}

export function setLicense(tier, validUntil = null) {
  const license = {
    tier,
    validUntil: validUntil ? validUntil.toISOString() : null,
    activatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(license));
  return license;
}

export function getUsage() {
  try {
    const stored = localStorage.getItem(USAGE_KEY);
    if (!stored) {
      return { count: 0, month: getCurrentMonth() };
    }
    
    const usage = JSON.parse(stored);
    
    if (usage.month !== getCurrentMonth()) {
      return { count: 0, month: getCurrentMonth() };
    }
    
    return usage;
  } catch {
    return { count: 0, month: getCurrentMonth() };
  }
}

export function incrementUsage() {
  const usage = getUsage();
  usage.count += 1;
  usage.month = getCurrentMonth();
  
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
  return usage;
}

export function canSanitize(charCount = 0) {
  const license = getLicense();
  const usage = getUsage();
  const limits = RATE_LIMITS[license.tier] || RATE_LIMITS.free;
  
  if (charCount > limits.charLimit) {
    return {
      allowed: false,
      reason: `Character limit exceeded. Your plan allows ${formatNumber(limits.charLimit)} characters. Upgrade for more.`,
      limitType: 'characters'
    };
  }
  
  if (usage.count >= limits.sanitizations) {
    return {
      allowed: false,
      reason: `Monthly limit reached (${limits.sanitizations}/${limits.sanitizations}). Upgrade for more sanitizations.`,
      limitType: 'sanitizations'
    };
  }
  
  return {
    allowed: true,
    remaining: limits.sanitizations - usage.count,
    charLimit: limits.charLimit
  };
}

export function hasFeature(feature) {
  const license = getLicense();
  const limits = RATE_LIMITS[license.tier] || RATE_LIMITS.free;
  
  return limits.features?.[feature] || false;
}

export function getTierInfo(tier) {
  const limits = RATE_LIMITS[tier] || RATE_LIMITS.free;
  
  return {
    name: tier.charAt(0).toUpperCase() + tier.slice(1).replace('_', ' '),
    sanitizations: limits.sanitizations,
    charLimit: limits.charLimit === Infinity ? 'Unlimited' : formatNumber(limits.charLimit),
    patterns: PATTERN_COUNTS[tier] || limits.patterns,
    features: limits.features
  };
}

export function getUsageSummary() {
  const license = getLicense();
  const usage = getUsage();
  const limits = RATE_LIMITS[license.tier] || RATE_LIMITS.free;
  
  return {
    tier: license.tier,
    tierName: getTierInfo(license.tier).name,
    used: usage.count,
    limit: limits.sanitizations,
    remaining: Math.max(0, limits.sanitizations - usage.count),
    percentUsed: Math.round((usage.count / limits.sanitizations) * 100),
    charLimit: limits.charLimit,
    validUntil: license.validUntil,
    resetDate: getMonthEndDate()
  };
}

// ==========================================
// Helper Functions
// ==========================================

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthEndDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0);
}

function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}

// ==========================================
// licenseManager Object API
// ==========================================
// Compatible with:
// - App.jsx: loadLicense(), currentLicense
// - pages/App.jsx: trackUsage()
// - Sanitizer.jsx: getTierInfo(), getUsageStats()
// ==========================================

export const licenseManager = {
  currentLicense: null,

  loadLicense() {
    this.currentLicense = getLicense();
    return this.currentLicense;
  },

  getTierInfo() {
    const license = this.currentLicense || getLicense();
    const limits = RATE_LIMITS[license.tier] || RATE_LIMITS.free;
    
    return {
      tier: license.tier,
      name: license.tier.charAt(0).toUpperCase() + license.tier.slice(1).replace('_', ' '),
      sanitizations: limits.sanitizations,
      charLimit: limits.charLimit,
      patterns: PATTERN_COUNTS[license.tier] || limits.patterns,
      features: limits.features || {},
      validUntil: license.validUntil
    };
  },

  getUsageStats() {
    const license = this.currentLicense || getLicense();
    const usage = getUsage();
    const limits = RATE_LIMITS[license.tier] || RATE_LIMITS.free;
    
    return {
      used: usage.count,
      limit: limits.sanitizations,
      remaining: Math.max(0, limits.sanitizations - usage.count),
      percentUsed: limits.sanitizations === Infinity 
        ? 0 
        : Math.round((usage.count / limits.sanitizations) * 100),
      resetDate: getMonthEndDate()
    };
  },

  // Called by pages/App.jsx after sanitization
  trackUsage() {
    return incrementUsage();
  },

  // Alias for trackUsage
  recordUsage() {
    return this.trackUsage();
  },

  canSanitize(charCount = 0) {
    return canSanitize(charCount);
  },

  hasFeature(feature) {
    return hasFeature(feature);
  },

  activate(tier, validUntil = null) {
    const license = setLicense(tier, validUntil);
    this.currentLicense = license;
    return license;
  },

  getLicense() {
    return getLicense();
  }
};

export default {
  RATE_LIMITS,
  PATTERN_COUNTS,
  getLicense,
  setLicense,
  getUsage,
  incrementUsage,
  canSanitize,
  hasFeature,
  getTierInfo,
  getUsageSummary,
  licenseManager
};
