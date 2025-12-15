// src/lib/LicenseManager.js
import CryptoJS from 'crypto-js';

class LicenseManager {
    constructor() {
        this.publicKey = import.meta.env.VITE_LICENSE_PUBLIC_KEY || 
                        'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBA...'; // Partial key
        
        this.validationCache = new Map();
        this.encryptionKey = this.generateDeviceFingerprint();
    }

    generateDeviceFingerprint() {
        // Create unique device ID for additional security
        const navigatorInfo = `${navigator.userAgent}${navigator.language}${screen.width}${screen.height}`;
        return CryptoJS.SHA256(navigatorInfo).toString();
    }

    async validateLicense(licenseKey, productId = 'LOG_SHIELD_PRO') {
        // Check cache first
        const cacheKey = `${licenseKey}_${productId}`;
        if (this.validationCache.has(cacheKey)) {
            return this.validationCache.get(cacheKey);
        }

        try {
            // 1. Decode base64 license
            const decoded = atob(licenseKey);
            const parts = decoded.split('.');
            
            if (parts.length !== 3) throw new Error('Invalid license format');
            
            const [encryptedData, signature, metadata] = parts;
            
            // 2. Verify integrity
            const expectedSignature = CryptoJS.HmacSHA256(
                encryptedData + metadata, 
                this.publicKey
            ).toString();
            
            if (signature !== expectedSignature) {
                throw new Error('License tampered');
            }
            
            // 3. Decrypt data
            const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
            const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            
            // 4. Validate fields
            const validation = {
                valid: false,
                tier: 'FREE',
                features: [],
                expiresAt: null,
                message: ''
            };
            
            if (decrypted.product !== productId) {
                validation.message = 'License for wrong product';
            } else if (decrypted.expiresAt && new Date(decrypted.expiresAt) < new Date()) {
                validation.message = 'License expired';
            } else {
                validation.valid = true;
                validation.tier = decrypted.tier || 'PRO';
                validation.features = decrypted.features || ['unlimited-scans', 'advanced-patterns', 'priority-support'];
                validation.expiresAt = decrypted.expiresAt;
                validation.message = 'Valid license';
            }
            
            // Cache valid results for 5 minutes
            if (validation.valid) {
                this.validationCache.set(cacheKey, validation);
                setTimeout(() => this.validationCache.delete(cacheKey), 300000);
            }
            
            return validation;
            
        } catch (error) {
            console.error('License validation error:', error);
            return {
                valid: false,
                tier: 'FREE',
                features: ['basic-scans', 'standard-patterns'],
                message: error.message || 'Invalid license'
            };
        }
    }

    // For Gumroad integration
    async validateGumroadLicense(saleId, licenseKey) {
        try {
            // Call Gumroad API via proxy (to hide API key)
            const response = await fetch('/api/validate-license', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sale_id: saleId, license_key: licenseKey })
            });
            
            return await response.json();
        } catch (error) {
            // Fallback to offline validation
            return this.validateLicense(licenseKey);
        }
    }

    // Feature gating
    hasFeature(licenseInfo, feature) {
        if (!licenseInfo || !licenseInfo.valid) return false;
        if (licenseInfo.tier === 'ENTERPRISE') return true;
        return licenseInfo.features.includes(feature);
    }
}

export class GumroadLicenseManager extends LicenseManager {
  constructor() {
    super();
    this.gumroadApi = 'https://api.gumroad.com/v2/licenses/verify';
    this.productId = 'LOG_SHIELD'; // Ganti dengan product ID Gumroad Anda
  }

  async validateGumroadLicense(licenseKey) {
    try {
      const response = await fetch(this.gumroadApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_permalink: this.productId,
          license_key: licenseKey
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Format sesuai dengan sistem yang ada
        return {
          valid: true,
          tier: this.mapGumroadTier(data.purchase),
          key: licenseKey,
          gumroadData: data,
          expires: data.purchase.subscription_ends_at || null
        };
      }
      return { valid: false, error: data.message };
    } catch (error) {
      console.warn('Gumroad validation failed, using local:', error);
      return super.activateLicense(licenseKey); // Fallback ke local
    }
  }

  mapGumroadTier(purchase) {
    // Map Gumroad tier ke tier internal
    const price = parseFloat(purchase.price) || 0;
    
    if (price >= 199) return 'lifetime';
    if (price >= 79) return 'team';
    if (price >= 19) return 'pro';
    if (price >= 7) return 'starter';
    return 'free';
  }
}

// Export instance baru (kompatibel dengan kode lama)
export const licenseManager = new GumroadLicenseManager();