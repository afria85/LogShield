// src/lib/analytics.js
// Analytics tracking utilities for Plausible

class Analytics {
  constructor() {
    this.enabled = typeof window !== 'undefined' && window.plausible;
  }

  // Track page view
  trackPageView(url = null) {
    if (!this.enabled) return;
    
    try {
      window.plausible('pageview', { 
        props: { 
          url: url || window.location.pathname 
        } 
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  // Track custom event
  trackEvent(eventName, props = {}) {
    if (!this.enabled) return;
    
    try {
      window.plausible(eventName, { props });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  // Track sanitization
  trackSanitize(tier, patternCount) {
    this.trackEvent('Sanitize', {
      tier,
      patterns: patternCount
    });
  }

  // Track upgrade click
  trackUpgradeClick(tier) {
    this.trackEvent('Upgrade Click', { tier });
  }

  // Track copy action
  trackCopy() {
    this.trackEvent('Copy Output');
  }

  // Track download
  trackDownload(format) {
    this.trackEvent('Download', { format });
  }

  // Track file upload
  trackFileUpload(fileType) {
    this.trackEvent('File Upload', { type: fileType });
  }

  // Track license activation
  trackLicenseActivation(tier) {
    this.trackEvent('License Activated', { tier });
  }

  // Track error
  trackError(errorType, errorMessage) {
    this.trackEvent('Error', {
      type: errorType,
      message: errorMessage.substring(0, 100) // Limit length
    });
  }

  // Track feature usage
  trackFeatureUse(feature) {
    this.trackEvent('Feature Used', { feature });
  }

  // Track conversion (payment)
  trackConversion(tier, amount) {
    this.trackEvent('Conversion', {
      tier,
      amount: `$${amount}`
    });
  }

  // Track signup
  trackSignup(source = 'organic') {
    this.trackEvent('Signup', { source });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Helper function for easy import
export function trackEvent(name, props) {
  analytics.trackEvent(name, props);
}