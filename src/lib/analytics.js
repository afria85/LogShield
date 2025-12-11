// src/lib/analytics.js
// Privacy-first analytics tracking - NO personal data collection

class Analytics {
  constructor() {
    this.enabled = this.shouldEnableAnalytics();
    this.consentGiven = this.getConsentStatus();
    this.session = {
      id: this.generateAnonymousId(),
      startTime: Date.now(),
      pageViews: 0,
      events: 0
    };

    // Status init
    this.initialized = false;

    // Privacy configuration
    this.config = {
      excludePersonalData: true,
      hashIdentifiableData: true,
      noCrossSiteTracking: true,
      aggregateOnly: true,
      sampleRate: 1.0,
      performance: false,
      session: true
    };
  }

  // ================================
  // INIT / DESTROY
  // ================================

  init(options = {}) {
    if (this.initialized) {
      console.log('[Analytics] Already initialized');
      return this;
    }

    console.log('[Analytics] Initializing...', options);

    // Merge user options
    this.config = { ...this.config, ...options };

    // Init plausible fallback
    this.initPlausible();

    this.initialized = true;

    // Track initialization
    this.trackEvent('analytics_initialized', {
      sample_rate: this.config.sampleRate,
      performance: this.config.performance,
      session: this.config.session
    });

    return this;
  }

  destroy() {
    console.log('[Analytics] Destroying session...');

    this.resetSession();
    this.initialized = false;
    this.enabled = false;

    this.trackEvent('analytics_destroyed');
    return this;
  }

  // ================================
  // PLAUSIBLE SETUP
  // ================================

  initPlausible() {
    if (typeof window === 'undefined') return;

    if (!window.plausible) {
      // Fallback agar tidak error
      window.plausible = function (eventName, props = {}) {
        console.log('[Analytics Fallback]:', eventName, props);
        return true;
      };
      window.plausible.q = [];
    }

    this.setupPageviewTracking();
  }

  setupPageviewTracking() {
    console.log('[Analytics] Pageview tracking ready (router will override)');
  }

  // ================================
  // PAGE VIEWS & EVENTS
  // ================================

  trackPageView(url = null, props = {}) {
    if (!this.enabled || !this.consentGiven) {
      console.log('[Analytics] Pageview skipped: disabled or no consent');
      return;
    }

    const pageData = {
      path: url || window.location.pathname,
      session_id: this.session.id,
      page_views: ++this.session.pageViews,
      is_first_visit: this.session.pageViews === 1,
      ...props
    };

    this.sendEvent('pageview', this.anonymizeData(pageData));
  }

  trackEvent(eventName, eventData = {}) {
    if (!this.enabled || !this.consentGiven) return;

    const safeData = {
      event_name: eventName,
      session_id: this.session.id,
      page_views: this.session.pageViews,
      events: ++this.session.events,
      ...this.anonymizeData(eventData)
    };

    this.sendEvent('event', safeData);
  }

  trackEventWithProps(eventName, props = {}) {
    this.trackEvent(eventName, props);
  }

  // ================================
  // CORE SEND EVENT
  // ================================

  sendEvent(type, data) {
    if (window.plausible) {
      window.plausible(type === 'pageview' ? 'pageview' : data.event_name, {
        props: data
      });
      return;
    }

    // Send to backend if defined
    if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      this.sendToEndpoint(type, data);
    }

    if (import.meta.env.DEV) {
      console.log(`[Analytics] ${type}`, data);
    }
  }

  async sendToEndpoint(type, data) {
    try {
      await fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Privacy-Mode': 'strict',
          'X-No-Tracking': 'true'
        },
        body: JSON.stringify({
          type,
          data,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.warn('[Analytics] Failed to send to endpoint:', e);
    }
  }

  // ================================
  // PRIVACY UTILS
  // ================================

  anonymizeData(data) {
    const anonymized = { ...data };

    if (this.config.excludePersonalData) {
      delete anonymized.ip;
      delete anonymized.user_agent;
      delete anonymized.referrer;
      delete anonymized.screen_resolution;
      delete anonymized.viewport;
      delete anonymized.language;
    }

    if (this.config.hashIdentifiableData) {
      if (anonymized.url) {
        const url = new URL(anonymized.url, window.location.origin);
        anonymized.url = url.pathname;
      }

      if (anonymized.referrer) {
        anonymized.referrer = this.hashString(anonymized.referrer);
      }
    }

    return anonymized;
  }

  shouldEnableAnalytics() {
    if (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes') return false;

    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      console.log('[Analytics] Disabled on localhost');
      return false;
    }

    return this.getConsentStatus();
  }

  getConsentStatus() {
    try {
      const consent = localStorage.getItem('analytics_consent');
      return consent === 'true';
    } catch (e) {
      return false;
    }
  }

  setConsent(given) {
    try {
      localStorage.setItem('analytics_consent', given.toString());
      this.consentGiven = given;
      this.enabled = given;

      if (given) this.trackEvent('analytics_consent_given');
    } catch (e) {
      console.warn('[Analytics] Failed to save consent:', e);
    }
  }

  // ================================
  // HELPERS
  // ================================

  generateAnonymousId() {
    const randomPart = Math.random().toString(36).substring(2, 15);
    const timePart = Date.now().toString(36);
    const hash = this.hashString(randomPart + timePart);
    return 'anon_' + hash.substring(0, 12);
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  resetSession() {
    this.session = {
      id: this.generateAnonymousId(),
      startTime: Date.now(),
      pageViews: 0,
      events: 0
    };
  }

  clearAllData() {
    this.resetSession();
    try {
      localStorage.removeItem('analytics_consent');
      localStorage.removeItem('analytics_session');
    } catch (e) {}
    this.consentGiven = false;
    this.enabled = false;
  }

  // ================================
  // CUSTOM TRACK FUNCTIONS
  // ================================

  trackSanitize(tier, patternCount, fileSize = null) {
    this.trackEvent('sanitize', {
      tier,
      pattern_count: patternCount,
      file_size_bucket: fileSize ? this.bucketFileSize(fileSize) : null
    });
  }

  bucketFileSize(bytes) {
    if (bytes < 1024) return '0-1KB';
    if (bytes < 10240) return '1-10KB';
    if (bytes < 102400) return '10-100KB';
    if (bytes < 1048576) return '100KB-1MB';
    return '1MB+';
  }

  trackUpgradeClick(tier, location = 'unknown') {
    this.trackEvent('upgrade_click', { tier, location });
  }

  trackCopy(source = 'output') {
    this.trackEvent('copy', { source });
  }

  trackDownload(format, sizeBucket = null) {
    this.trackEvent('download', { format, size_bucket: sizeBucket });
  }

  trackFileUpload(fileType, sizeBucket, extension = null) {
    this.trackEvent('file_upload', {
      file_type: fileType,
      size_bucket: sizeBucket,
      extension: extension ? this.hashString(extension) : null
    });
  }

  trackLicenseActivation(tier, source = 'checkout') {
    this.trackEvent('license_activated', { tier, source });
  }

  trackError(errorType, errorContext = {}) {
    const safe = {};
    if (errorContext.message) {
      safe.message_hash = this.hashString(errorContext.message.substring(0, 50));
    }
    this.trackEvent('error', { error_type: errorType, ...safe });
  }

  trackFeatureUse(feature, details = {}) {
    const safeDetails = {};
    Object.keys(details).forEach(key => {
      if (typeof details[key] === 'number' || typeof details[key] === 'boolean') {
        safeDetails[key] = details[key];
      }
    });

    this.trackEvent('feature_use', { feature, ...safeDetails });
  }

  trackConversion(tier, amount) {
    this.trackEvent('conversion', {
      tier,
      amount_range: this.bucketAmount(amount)
    });
  }

  bucketAmount(amount) {
    if (amount < 10) return '0-10';
    if (amount < 50) return '10-50';
    if (amount < 100) return '50-100';
    if (amount < 500) return '100-500';
    return '500+';
  }

  trackSignup(source = 'organic') {
    this.trackEvent('signup', { source });
  }
}

// Export singleton
export const analytics = new Analytics();

// Helper exports
export const initAnalytics = (opts = {}) => analytics.init(opts);
export const trackPageView = (...args) => analytics.trackPageView(...args);
export const trackEvent = (...args) => analytics.trackEvent(...args);
export const setAnalyticsConsent = (v) => analytics.setConsent(v);
export const getAnalyticsConsent = () => analytics.getConsentStatus();
export const clearAnalyticsData = () => analytics.clearAllData();
