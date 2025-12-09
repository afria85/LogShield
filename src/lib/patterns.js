// src/lib/patterns.js
// Security pattern definitions for log sanitization

export const FREE_PATTERNS = [
  {
    id: 'aws_key',
    name: 'AWS Access Key',
    pattern: /AKIA[0-9A-Z]{16}/gi,
    replacement: '[AWS_KEY_REDACTED]',
    category: 'credentials',
    description: 'AWS Access Key ID'
  },
  {
    id: 'email',
    name: 'Email Address',
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
    replacement: '[EMAIL_REDACTED]',
    category: 'pii',
    description: 'Email addresses'
  },
  {
    id: 'ipv4',
    name: 'IPv4 Address',
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    replacement: '[IP_REDACTED]',
    category: 'network',
    description: 'IPv4 addresses'
  },
  {
    id: 'credit_card',
    name: 'Credit Card',
    pattern: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g,
    replacement: '[CARD_REDACTED]',
    category: 'financial',
    description: 'Credit card numbers'
  },
  {
    id: 'phone',
    name: 'Phone Number',
    pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    replacement: '[PHONE_REDACTED]',
    category: 'pii',
    description: 'US phone numbers'
  },
  {
    id: 'ssn',
    name: 'Social Security Number',
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    replacement: '[SSN_REDACTED]',
    category: 'pii',
    description: 'US SSN'
  },
  {
    id: 'jwt',
    name: 'JWT Token',
    pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/gi,
    replacement: '[JWT_REDACTED]',
    category: 'credentials',
    description: 'JSON Web Tokens'
  },
  {
    id: 'github_token',
    name: 'GitHub Token',
    pattern: /gh[ps]_[a-zA-Z0-9]{36}/gi,
    replacement: '[GITHUB_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'GitHub Personal/App tokens'
  },
  {
    id: 'slack_token',
    name: 'Slack Token',
    pattern: /xox[baprs]-[0-9a-zA-Z-]+/gi,
    replacement: '[SLACK_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'Slack API tokens'
  },
  {
    id: 'password_field',
    name: 'Password Field',
    pattern: /password["\s:=]+[^\s"']+/gi,
    replacement: 'password=[REDACTED]',
    category: 'credentials',
    description: 'Password fields in logs'
  }
];

export const PRO_PATTERNS = [
  ...FREE_PATTERNS,
  {
    id: 'aws_secret',
    name: 'AWS Secret Key',
    pattern: /[a-zA-Z0-9/+=]{40}/g,
    replacement: '[AWS_SECRET_REDACTED]',
    category: 'credentials',
    description: 'AWS Secret Access Key'
  },
  {
    id: 'gcp_key',
    name: 'GCP API Key',
    pattern: /AIza[0-9A-Za-z-_]{35}/gi,
    replacement: '[GCP_KEY_REDACTED]',
    category: 'credentials',
    description: 'Google Cloud Platform API key'
  },
  {
    id: 'azure_key',
    name: 'Azure Key',
    pattern: /[a-zA-Z0-9]{44}==/g,
    replacement: '[AZURE_KEY_REDACTED]',
    category: 'credentials',
    description: 'Azure storage key'
  },
  {
    id: 'stripe_key',
    name: 'Stripe Key',
    pattern: /sk_live_[0-9a-zA-Z]{24,}/gi,
    replacement: '[STRIPE_KEY_REDACTED]',
    category: 'credentials',
    description: 'Stripe secret key'
  },
  {
    id: 'firebase_key',
    name: 'Firebase Key',
    pattern: /AAAA[A-Za-z0-9_-]{7}:[A-Za-z0-9_-]{140}/g,
    replacement: '[FIREBASE_KEY_REDACTED]',
    category: 'credentials',
    description: 'Firebase Cloud Messaging key'
  },
  {
    id: 'mailgun_key',
    name: 'Mailgun API Key',
    pattern: /key-[0-9a-zA-Z]{32}/gi,
    replacement: '[MAILGUN_KEY_REDACTED]',
    category: 'credentials',
    description: 'Mailgun API key'
  },
  {
    id: 'twilio_key',
    name: 'Twilio Key',
    pattern: /SK[0-9a-fA-F]{32}/g,
    replacement: '[TWILIO_KEY_REDACTED]',
    category: 'credentials',
    description: 'Twilio API key'
  },
  {
    id: 'sendgrid_key',
    name: 'SendGrid Key',
    pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g,
    replacement: '[SENDGRID_KEY_REDACTED]',
    category: 'credentials',
    description: 'SendGrid API key'
  },
  {
    id: 'oauth_token',
    name: 'OAuth Token',
    pattern: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
    replacement: '[OAUTH_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'OAuth 2.0 tokens (UUID format)'
  },
  {
    id: 'api_key_generic',
    name: 'Generic API Key',
    pattern: /api[_-]?key["\s:=]+[a-zA-Z0-9_-]{20,}/gi,
    replacement: 'api_key=[REDACTED]',
    category: 'credentials',
    description: 'Generic API key patterns'
  },
  {
    id: 'private_key',
    name: 'Private Key',
    pattern: /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----[\s\S]*?-----END (RSA |EC |DSA )?PRIVATE KEY-----/gi,
    replacement: '[PRIVATE_KEY_REDACTED]',
    category: 'credentials',
    description: 'PEM private keys'
  },
  {
    id: 'mongodb_uri',
    name: 'MongoDB URI',
    pattern: /mongodb(\+srv)?:\/\/[^\s"']+/gi,
    replacement: '[MONGODB_URI_REDACTED]',
    category: 'credentials',
    description: 'MongoDB connection strings'
  },
  {
    id: 'postgres_uri',
    name: 'PostgreSQL URI',
    pattern: /postgres(ql)?:\/\/[^\s"']+/gi,
    replacement: '[POSTGRES_URI_REDACTED]',
    category: 'credentials',
    description: 'PostgreSQL connection strings'
  },
  {
    id: 'mysql_uri',
    name: 'MySQL URI',
    pattern: /mysql:\/\/[^\s"']+/gi,
    replacement: '[MYSQL_URI_REDACTED]',
    category: 'credentials',
    description: 'MySQL connection strings'
  },
  {
    id: 'redis_uri',
    name: 'Redis URI',
    pattern: /redis:\/\/[^\s"']+/gi,
    replacement: '[REDIS_URI_REDACTED]',
    category: 'credentials',
    description: 'Redis connection strings'
  },
  {
    id: 'docker_auth',
    name: 'Docker Auth',
    pattern: /"auth":\s*"[A-Za-z0-9+/=]+"/gi,
    replacement: '"auth":"[REDACTED]"',
    category: 'credentials',
    description: 'Docker registry auth'
  },
  {
    id: 'ipv6',
    name: 'IPv6 Address',
    pattern: /([0-9a-f]{0,4}:){7}[0-9a-f]{0,4}/gi,
    replacement: '[IPv6_REDACTED]',
    category: 'network',
    description: 'IPv6 addresses'
  },
  {
    id: 'mac_address',
    name: 'MAC Address',
    pattern: /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/g,
    replacement: '[MAC_REDACTED]',
    category: 'network',
    description: 'MAC addresses'
  },
  {
    id: 'bitcoin_address',
    name: 'Bitcoin Address',
    pattern: /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g,
    replacement: '[BTC_ADDRESS_REDACTED]',
    category: 'financial',
    description: 'Bitcoin wallet addresses'
  },
  {
    id: 'ethereum_address',
    name: 'Ethereum Address',
    pattern: /0x[a-fA-F0-9]{40}/g,
    replacement: '[ETH_ADDRESS_REDACTED]',
    category: 'financial',
    description: 'Ethereum wallet addresses'
  },
  {
    id: 'iban',
    name: 'IBAN',
    pattern: /\b[A-Z]{2}\d{2}[A-Z0-9]{1,30}\b/g,
    replacement: '[IBAN_REDACTED]',
    category: 'financial',
    description: 'International Bank Account Number'
  },
  {
    id: 'passport',
    name: 'Passport Number',
    pattern: /\b[A-Z]{1,2}\d{6,9}\b/g,
    replacement: '[PASSPORT_REDACTED]',
    category: 'pii',
    description: 'Passport numbers'
  },
  {
    id: 'url_params',
    name: 'URL Parameters',
    pattern: /([?&])(token|key|secret|password|api[_-]?key)=[^&\s]+/gi,
    replacement: '$1$2=[REDACTED]',
    category: 'credentials',
    description: 'Sensitive URL parameters'
  },
  {
    id: 'bearer_token',
    name: 'Bearer Token',
    pattern: /Bearer\s+[a-zA-Z0-9_-]+/gi,
    replacement: 'Bearer [REDACTED]',
    category: 'credentials',
    description: 'HTTP Bearer tokens'
  },
  {
    id: 'basic_auth',
    name: 'Basic Auth',
    pattern: /Basic\s+[A-Za-z0-9+/=]+/gi,
    replacement: 'Basic [REDACTED]',
    category: 'credentials',
    description: 'HTTP Basic authentication'
  },
  {
    id: 'cookie_session',
    name: 'Session Cookie',
    pattern: /(session|sess|sid|token)[=:]\s*[a-zA-Z0-9_-]{20,}/gi,
    replacement: '$1=[REDACTED]',
    category: 'credentials',
    description: 'Session cookies'
  },
  {
    id: 'env_var',
    name: 'Environment Variable',
    pattern: /(PASSWORD|SECRET|KEY|TOKEN)[=:]\s*[^\s"';]+/gi,
    replacement: '$1=[REDACTED]',
    category: 'credentials',
    description: 'Environment variables with secrets'
  }
];

export const TEAM_PATTERNS = [
  ...PRO_PATTERNS,
  // Additional enterprise patterns can be added here
];

export const PATTERN_CATEGORIES = [
  { id: 'all', name: 'All Patterns', icon: '🔍' },
  { id: 'credentials', name: 'Credentials', icon: '🔑' },
  { id: 'pii', name: 'Personal Info', icon: '👤' },
  { id: 'network', name: 'Network', icon: '🌐' },
  { id: 'financial', name: 'Financial', icon: '💳' }
];

// AI-based entropy detection for unknown secrets
export function detectHighEntropy(text, threshold = 4.5) {
  const words = text.split(/\s+/);
  const suspects = [];

  words.forEach(word => {
    if (word.length >= 20) {
      const entropy = calculateEntropy(word);
      if (entropy >= threshold) {
        suspects.push({
          text: word,
          entropy: entropy.toFixed(2),
          type: 'high_entropy'
        });
      }
    }
  });

  return suspects;
}

function calculateEntropy(str) {
  const len = str.length;
  const frequencies = {};
  
  for (let char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  let entropy = 0;
  for (let char in frequencies) {
    const probability = frequencies[char] / len;
    entropy -= probability * Math.log2(probability);
  }

  return entropy;
}

// Get patterns based on license tier
export function getPatternsByTier(tier) {
  switch (tier) {
    case 'free':
      return FREE_PATTERNS;
    case 'starter':
    case 'pro':
      return PRO_PATTERNS;
    case 'team':
    case 'enterprise':
      return TEAM_PATTERNS;
    default:
      return FREE_PATTERNS;
  }
}

// Filter patterns by category
export function filterPatternsByCategory(patterns, category) {
  if (category === 'all') return patterns;
  return patterns.filter(p => p.category === category);
}