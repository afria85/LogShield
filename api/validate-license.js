// /api/validate-license.js
import { KV } from '@vercel/kv'; // We'll use Vercel KV to store licenses (simpler than a DB)

// Initialize a simple in-memory store for demo (Replace with Vercel KV or a DB for production)
// In a real app, use: const kv = new KV({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
const licenseStore = new Map(); // TEMPORARY - loses data on server restart

export default async function handler(req, res) {
  // ? PERBAIKI CORS: Allow localhost AND production domain
  const allowedOrigins = [
    'http://localhost:5173',      // Development
    'http://localhost:3000',      // Development alternative  
    'https://logshield.dev',      // Production
    'https://www.logshield.dev'   // Production with www
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ?? ENDPOINT 1: Validate a license key (called from your frontend)
  if (req.method === 'POST' && req.query.action === 'validate') {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({ valid: false, error: 'Missing license key' });
    }

    // 1. Check our local cache/store first (fast)
    const cachedLicense = licenseStore.get(licenseKey);
    if (cachedLicense) {
      console.log(`[API] License ${licenseKey} found in cache`);
      return res.json(cachedLicense);
    }

    // 2. If not in cache, validate with Gumroad API
    try {
      const gumroadResponse = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: 'YOUR_GUMROAD_PRODUCT_ID', // ?? REPLACE THIS
          license_key: licenseKey,
        }),
      });

      const data = await gumroadResponse.json();

      if (data.success) {
        // Map Gumroad response to your app's license format
        const licenseInfo = {
          valid: true,
          tier: mapGumroadToTier(data.purchase), // Implement this function
          key: licenseKey,
          features: ['unlimited-scans', 'advanced-patterns'],
          expiresAt: data.purchase.subscription_ends_at || null,
        };

        // Store in cache for future requests (e.g., 1 hour)
        licenseStore.set(licenseKey, licenseInfo);
        // If using Vercel KV: await kv.set(`license:${licenseKey}`, licenseInfo, { ex: 3600 });

        console.log(`[API] License ${licenseKey} validated via Gumroad API`);
        return res.json(licenseInfo);
      } else {
        return res.status(200).json({ // Still 200 OK, but with valid: false
          valid: false,
          tier: 'free',
          error: data.message || 'Invalid license key'
        });
      }
    } catch (error) {
      console.error('[API] Gumroad validation error:', error);
      return res.status(500).json({ valid: false, error: 'License server error' });
    }
  }

  // ?? ENDPOINT 2: Receive webhooks from Gumroad (for new sales)
  if (req.method === 'POST' && req.query.action === 'webhook') {
    // Verify webhook signature (important for security!)
    // Gumroad sends a signature header you should verify

    const { license_key, product_id, sale_id } = req.body;

    console.log(`[Webhook] New sale: ${sale_id} for product ${product_id}, key: ${license_key}`);

    // Immediately store the new license in cache/DB so it's ready for validation
    const newLicenseInfo = {
      valid: true,
      tier: mapGumroadToTier(req.body),
      key: license_key,
      features: ['unlimited-scans', 'advanced-patterns'],
      createdAt: new Date().toISOString(),
    };

    licenseStore.set(license_key, newLicenseInfo);
    // If using Vercel KV: await kv.set(`license:${license_key}`, newLicenseInfo);

    return res.status(200).json({ received: true });
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}

// Helper function to map Gumroad purchase to your tiers
function mapGumroadToTier(purchase) {
  const price = parseFloat(purchase.price) || 0;
  if (price >= 199) return 'lifetime';
  if (price >= 79) return 'team';
  if (price >= 19) return 'pro';
  if (price >= 7) return 'starter';
  return 'free';
}