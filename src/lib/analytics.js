// src/lib/analytics.js
// Simple analytics wrapper for Plausible

export const analytics = {
  // Track page views
  trackPageView(path) {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('pageview', { props: { path } });
    }
    console.debug('[Analytics] Page view:', path);
  },

  // Track custom events
  trackEvent(eventName, props = {}) {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(eventName, { props });
    }
    console.debug('[Analytics] Event:', eventName, props);
  },

  // Track sanitization events
  trackSanitize(tier, replacements, fileSize, duration) {
    this.trackEvent('sanitize', {
      tier,
      replacements,
      fileSize: fileSize ? `${Math.round(fileSize / 1024)}KB` : 'unknown',
      duration: duration ? `${duration}ms` : 'unknown'
    });
  },

  // Track upgrade clicks
  trackUpgradeClick(plan, source) {
    this.trackEvent('upgrade_click', { plan, source });
  },

  // Track feature usage
  trackFeatureUse(feature, details = {}) {
    this.trackEvent('feature_use', { feature, ...details });
  },

  // Track errors
  trackError(error, context = {}) {
    this.trackEvent('error', {
      message: error?.message || String(error),
      ...context
    });
  }
};

export default analytics;
