// src/lib/analytics.js
// Analytics integration with Plausible (privacy-first analytics)

// ============================================
// CONFIGURATION
// ============================================

const PLAUSIBLE_DOMAIN = import.meta.env?.VITE_PLAUSIBLE_DOMAIN || 'logshield.dev';
const DEBUG = import.meta.env?.DEV || false;

// ============================================
// ANALYTICS CLASS
// ============================================

class Analytics {
  constructor() {
    this.enabled = this.checkEnabled();
    this.queue = [];
    this.initialized = false;
  }

  /**
   * Check if analytics is enabled
   */
  checkEnabled() {
    // Respect Do Not Track
    if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') {
      if (DEBUG) console.log('[Analytics] Do Not Track enabled, analytics disabled');
      return false;
    }

    // Check if plausible is available
    if (typeof window !== 'undefined' && window.plausible) {
      return true;
    }

    return false;
  }

  /**
   * Initialize analytics (call on app start)
   */
  init() {
    if (this.initialized) return;
    
    this.enabled = this.checkEnabled();
    this.initialized = true;

    // Process queued events
    if (this.enabled && this.queue.length > 0) {
      this.queue.forEach(event => {
        this.track(event.name, event.props);
      });
      this.queue = [];
    }

    if (DEBUG) {
      console.log(`[Analytics] Initialized - enabled: ${this.enabled}`);
    }
  }

  /**
   * Track custom event
   */
  track(eventName, props = {}) {
    if (DEBUG) {
      console.log(`[Analytics] Track: ${eventName}`, props);
    }

    // Queue if not initialized
    if (!this.initialized) {
      this.queue.push({ name: eventName, props });
      return;
    }

    if (!this.enabled) return;

    try {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible(eventName, { props });
      }
    } catch (error) {
      console.error('[Analytics] Track error:', error);
    }
  }

  /**
   * Track page view (usually automatic with Plausible)
   */
  pageview(path) {
    if (DEBUG) {
      console.log(`[Analytics] Pageview: ${path}`);
    }

    // Plausible tracks pageviews automatically
    // This is for manual tracking if needed
    this.track('pageview', { path });
  }

  // ========================================
  // LOGSHIELD SPECIFIC EVENTS
  // ========================================

  /**
   * Track sanitization event
   */
  trackSanitize(tier, stats = {}) {
    this.track('Sanitize', {
      tier,
      patterns_matched: stats.totalReplacements || 0,
      processing_time: stats.processingTime || 0,
      input_size: stats.inputLength || 0
    });
  }

  /**
   * Track export event
   */
  trackExport(format, tier) {
    this.track('Export', {
      format,
      tier
    });
  }

  /**
   * Track copy to clipboard
   */
  trackCopy(tier) {
    this.track('Copy', { tier });
  }

  /**
   * Track file upload
   */
  trackFileUpload(fileType, fileSize) {
    this.track('FileUpload', {
      file_type: fileType,
      file_size: this.formatFileSize(fileSize)
    });
  }

  /**
   * Track upgrade click
   */
  trackUpgradeClick(fromTier, toTier) {
    this.track('UpgradeClick', {
      from_tier: fromTier,
      to_tier: toTier
    });
  }

  /**
   * Track purchase completion
   */
  trackPurchase(tier, price, currency = 'USD') {
    this.track('Purchase', {
      tier,
      price,
      currency
    });
  }

  /**
   * Track license activation
   */
  trackLicenseActivation(tier, source) {
    this.track('LicenseActivation', {
      tier,
      source // 'gumroad', 'manual', etc.
    });
  }

  /**
   * Track error
   */
  trackError(errorType, errorMessage) {
    this.track('Error', {
      error_type: errorType,
      error_message: errorMessage?.substring(0, 100) // Limit message length
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(feature, tier) {
    this.track('FeatureUsage', {
      feature,
      tier
    });
  }

  /**
   * Track theme change
   */
  trackThemeChange(theme) {
    this.track('ThemeChange', { theme });
  }

  /**
   * Track entropy detection toggle
   */
  trackEntropyToggle(enabled, tier) {
    this.track('EntropyToggle', {
      enabled,
      tier
    });
  }

  /**
   * Track pattern category filter
   */
  trackCategoryFilter(category, tier) {
    this.track('CategoryFilter', {
      category,
      tier
    });
  }

  /**
   * Track scroll depth (for landing page)
   */
  trackScrollDepth(depth) {
    // depth: 25, 50, 75, 100
    this.track('ScrollDepth', { depth: `${depth}%` });
  }

  /**
   * Track CTA click
   */
  trackCTAClick(ctaName, location) {
    this.track('CTAClick', {
      cta_name: ctaName,
      location
    });
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Format file size for analytics
   */
  formatFileSize(bytes) {
    if (bytes < 1024) return 'tiny';
    if (bytes < 10 * 1024) return 'small';
    if (bytes < 100 * 1024) return 'medium';
    if (bytes < 1024 * 1024) return 'large';
    return 'very_large';
  }

  /**
   * Get user properties (for segment tracking)
   */
  getUserProps() {
    return {
      has_license: !!localStorage.getItem('logshield_license'),
      theme: localStorage.getItem('logshield_theme') || 'system'
    };
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

const analytics = new Analytics();

// ============================================
// EXPORTS
// ============================================

export { analytics, Analytics };
export default analytics;

// Export convenience functions
export function trackEvent(name, props = {}) {
  analytics.track(name, props);
}

export function trackSanitize(tier, stats) {
  analytics.trackSanitize(tier, stats);
}

export function trackExport(format, tier) {
  analytics.trackExport(format, tier);
}

export function trackUpgrade(fromTier, toTier) {
  analytics.trackUpgradeClick(fromTier, toTier);
}

export function trackError(type, message) {
  analytics.trackError(type, message);
}

// Initialize on import
if (typeof window !== 'undefined') {
  // Wait for DOM ready
  if (document.readyState === 'complete') {
    analytics.init();
  } else {
    window.addEventListener('load', () => analytics.init());
  }
}
