// src/lib/firebase-license.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, update } from 'firebase/database';

// Firebase config (dari Firebase Console)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Gumroad API untuk validasi initial
const GUMROAD_API_URL = 'https://api.gumroad.com/v2/licenses/verify';
const GUMROAD_PRODUCT_ID = import.meta.env.VITE_GUMROAD_PRODUCT_ID;

/**
 * Validate license key dengan Gumroad
 */
export async function validateLicenseWithGumroad(licenseKey, email) {
  try {
    const response = await fetch(GUMROAD_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        product_id: GUMROAD_PRODUCT_ID,
        license_key: licenseKey,
        increment_uses_count: 'false', // Jangan increment, cuma validasi
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      return {
        valid: false,
        error: 'Invalid license key'
      };
    }

    // Gumroad returns purchase info
    const purchase = data.purchase;
    
    return {
      valid: true,
      email: purchase.email,
      tier: mapGumroadVariantToTier(purchase.variants),
      purchaseDate: purchase.created_at,
      refunded: purchase.refunded,
      chargebacked: purchase.chargebacked,
    };
  } catch (error) {
    console.error('Gumroad validation error:', error);
    return {
      valid: false,
      error: 'Network error during validation'
    };
  }
}

/**
 * Map Gumroad variant ke tier kita
 */
function mapGumroadVariantToTier(variants) {
  // Sesuaikan dengan variant names di Gumroad
  if (variants?.includes('Team')) return 'team';
  if (variants?.includes('Pro')) return 'pro';
  return 'starter';
}

/**
 * Activate license - simpan ke Firebase setelah validasi Gumroad
 */
export async function activateLicense(licenseKey, email) {
  try {
    // 1. Validasi dengan Gumroad dulu
    const gumroadResult = await validateLicenseWithGumroad(licenseKey, email);
    
    if (!gumroadResult.valid) {
      return {
        success: false,
        error: gumroadResult.error
      };
    }

    if (gumroadResult.refunded || gumroadResult.chargebacked) {
      return {
        success: false,
        error: 'This license has been refunded or chargebacked'
      };
    }

    // 2. Check apakah sudah ada di Firebase
    const licenseRef = ref(db, `licenses/${licenseKey}`);
    const snapshot = await get(licenseRef);
    
    if (snapshot.exists()) {
      const existingLicense = snapshot.val();
      
      // Kalau sudah aktif, return data existing
      if (existingLicense.status === 'active') {
        return {
          success: true,
          license: existingLicense,
          message: 'License already activated'
        };
      }
    }

    // 3. Simpan license baru ke Firebase
    const licenseData = {
      email: gumroadResult.email,
      tier: gumroadResult.tier,
      status: 'active',
      activatedAt: new Date().toISOString(),
      purchaseDate: gumroadResult.purchaseDate,
      lastValidated: new Date().toISOString(),
      deviceCount: 1, // Track berapa device yang pakai
    };

    await set(licenseRef, licenseData);

    // 4. Simpan ke localStorage untuk quick access
    localStorage.setItem('logshield_license', licenseKey);
    localStorage.setItem('logshield_tier', gumroadResult.tier);

    return {
      success: true,
      license: licenseData
    };

  } catch (error) {
    console.error('License activation error:', error);
    return {
      success: false,
      error: 'Failed to activate license'
    };
  }
}

/**
 * Quick check license dari Firebase (cached, fast)
 */
export async function checkLicense(licenseKey) {
  try {
    const licenseRef = ref(db, `licenses/${licenseKey}`);
    const snapshot = await get(licenseRef);

    if (!snapshot.exists()) {
      return { valid: false, tier: 'free' };
    }

    const license = snapshot.val();

    // Check status
    if (license.status !== 'active') {
      return { valid: false, tier: 'free' };
    }

    // Update last validated (optional, untuk tracking)
    await update(licenseRef, {
      lastValidated: new Date().toISOString()
    });

    return {
      valid: true,
      tier: license.tier,
      email: license.email,
      activatedAt: license.activatedAt
    };

  } catch (error) {
    console.error('License check error:', error);
    // Kalau Firebase error, fallback ke localStorage
    const cachedTier = localStorage.getItem('logshield_tier');
    return {
      valid: false,
      tier: cachedTier || 'free',
      cached: true
    };
  }
}

/**
 * Revoke license (untuk refund atau abuse)
 */
export async function revokeLicense(licenseKey) {
  try {
    const licenseRef = ref(db, `licenses/${licenseKey}`);
    await update(licenseRef, {
      status: 'revoked',
      revokedAt: new Date().toISOString()
    });

    // Clear localStorage
    localStorage.removeItem('logshield_license');
    localStorage.removeItem('logshield_tier');

    return { success: true };
  } catch (error) {
    console.error('License revoke error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get current user's license dari localStorage
 */
export function getCurrentLicense() {
  const licenseKey = localStorage.getItem('logshield_license');
  const tier = localStorage.getItem('logshield_tier') || 'free';
  
  return {
    licenseKey,
    tier,
    isActive: !!licenseKey
  };
}

/**
 * Logout - clear license
 */
export function clearLicense() {
  localStorage.removeItem('logshield_license');
  localStorage.removeItem('logshield_tier');
  localStorage.removeItem('logshield_user_email');
}