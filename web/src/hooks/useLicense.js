// src/hooks/useLicense.js
import { useEffect, useState } from 'react';
import { licenseManager } from '../lib/license';

export function useLicense() {
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const currentLicense = licenseManager.loadLicense();
      setLicense(currentLicense);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const activateLicense = async (licenseKey) => {
    try {
      setLoading(true);
      const result = await licenseManager.activateLicense(licenseKey);
      
      if (result.success) {
        setLicense(result.license);
        setError(null);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to activate license';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const upgradeLicense = async (tier, paymentToken) => {
    try {
      setLoading(true);
      const result = await licenseManager.upgrade(tier, paymentToken);
      
      if (result.success) {
        setLicense(result.license);
        setError(null);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to upgrade license';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const deactivateLicense = () => {
    try {
      licenseManager.deactivate();
      setLicense(licenseManager.getDefaultLicense());
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const trackUsage = () => {
    try {
      licenseManager.trackUsage();
      // Refresh license to get updated usage
      setLicense(licenseManager.loadLicense());
    } catch (err) {
      console.error('Failed to track usage:', err);
    }
  };

  const canUseFeature = (feature) => {
    return licenseManager.canUse(feature);
  };

  const checkCharLimit = (textLength) => {
    return licenseManager.checkCharLimit(textLength);
  };

  const getTierInfo = () => {
    return licenseManager.getTierInfo();
  };

  const getUsageStats = () => {
    return licenseManager.getUsageStats();
  };

  return {
    license,
    loading,
    error,
    activateLicense,
    upgradeLicense,
    deactivateLicense,
    trackUsage,
    canUseFeature,
    checkCharLimit,
    getTierInfo,
    getUsageStats
  };
}
