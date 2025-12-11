// src/lib/patterns.js
// Security pattern definitions for log sanitization - 70+ patterns

export const FREE_PATTERNS = [
  // === BASIC CREDENTIALS ===
  {
    id: 'aws_key',
    name: 'AWS Access Key',
    pattern: /AKIA[0-9A-Z]{16}/gi,
    replacement: '[AWS_KEY_REDACTED]',
    category: 'credentials',
    description: 'AWS Access Key ID'
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
    pattern: /password["'\s:=]+["']?[^\s"',;}{]+["']?/gi,
    replacement: 'password=[REDACTED]',
    category: 'credentials',
    description: 'Password fields in logs'
  },

  // === BASIC PII ===
  {
    id: 'email',
    name: 'Email Address',
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
    replacement: '[EMAIL_REDACTED]',
    category: 'pii',
    description: 'Email addresses'
  },
  {
    id: 'phone_us',
    name: 'US Phone Number',
    pattern: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
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

  // === BASIC NETWORK ===
  {
    id: 'ipv4',
    name: 'IPv4 Address',
    pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    replacement: '[IP_REDACTED]',
    category: 'network',
    description: 'IPv4 addresses'
  },

  // === BASIC FINANCIAL ===
  {
    id: 'credit_card',
    name: 'Credit Card',
    pattern: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g,
    replacement: '[CARD_REDACTED]',
    category: 'financial',
    description: 'Credit card numbers'
  }
];

export const PRO_PATTERNS = [
  ...FREE_PATTERNS,
  
  // === CLOUD PROVIDER CREDENTIALS ===
  {
    id: 'aws_secret',
    name: 'AWS Secret Key',
    pattern: /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/g,
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
    id: 'gcp_service_account',
    name: 'GCP Service Account',
    pattern: /"type":\s*"service_account"[\s\S]*?"private_key"/gi,
    replacement: '[GCP_SERVICE_ACCOUNT_REDACTED]',
    category: 'credentials',
    description: 'GCP service account JSON'
  },
  {
    id: 'azure_key',
    name: 'Azure Storage Key',
    pattern: /[a-zA-Z0-9+/]{86}==/g,
    replacement: '[AZURE_KEY_REDACTED]',
    category: 'credentials',
    description: 'Azure storage key'
  },
  {
    id: 'azure_connection',
    name: 'Azure Connection String',
    pattern: /DefaultEndpointsProtocol=https?;AccountName=[^;]+;AccountKey=[^;]+/gi,
    replacement: '[AZURE_CONNECTION_REDACTED]',
    category: 'credentials',
    description: 'Azure connection string'
  },
  {
    id: 'digitalocean_token',
    name: 'DigitalOcean Token',
    pattern: /dop_v1_[a-f0-9]{64}/gi,
    replacement: '[DO_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'DigitalOcean API token'
  },
  {
    id: 'heroku_key',
    name: 'Heroku API Key',
    pattern: /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    replacement: '[HEROKU_KEY_REDACTED]',
    category: 'credentials',
    description: 'Heroku API key (UUID format)'
  },

  // === PAYMENT PROVIDERS ===
  {
    id: 'stripe_secret',
    name: 'Stripe Secret Key',
    pattern: /sk_live_[0-9a-zA-Z]{24,}/gi,
    replacement: '[STRIPE_SECRET_REDACTED]',
    category: 'credentials',
    description: 'Stripe secret key'
  },
  {
    id: 'stripe_test',
    name: 'Stripe Test Key',
    pattern: /sk_test_[0-9a-zA-Z]{24,}/gi,
    replacement: '[STRIPE_TEST_REDACTED]',
    category: 'credentials',
    description: 'Stripe test key'
  },
  {
    id: 'stripe_restricted',
    name: 'Stripe Restricted Key',
    pattern: /rk_live_[0-9a-zA-Z]{24,}/gi,
    replacement: '[STRIPE_RESTRICTED_REDACTED]',
    category: 'credentials',
    description: 'Stripe restricted key'
  },
  {
    id: 'paypal_braintree',
    name: 'PayPal/Braintree Token',
    pattern: /access_token\$production\$[0-9a-z]{16}\$[0-9a-f]{32}/gi,
    replacement: '[PAYPAL_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'PayPal/Braintree access token'
  },
  {
    id: 'square_token',
    name: 'Square Access Token',
    pattern: /sq0atp-[0-9A-Za-z\-_]{22}/gi,
    replacement: '[SQUARE_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'Square access token'
  },

  // === EMAIL/MESSAGING SERVICES ===
  {
    id: 'mailgun_key',
    name: 'Mailgun API Key',
    pattern: /key-[0-9a-zA-Z]{32}/gi,
    replacement: '[MAILGUN_KEY_REDACTED]',
    category: 'credentials',
    description: 'Mailgun API key'
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
    id: 'mailchimp_key',
    name: 'Mailchimp API Key',
    pattern: /[a-f0-9]{32}-us\d{1,2}/gi,
    replacement: '[MAILCHIMP_KEY_REDACTED]',
    category: 'credentials',
    description: 'Mailchimp API key'
  },
  {
    id: 'twilio_key',
    name: 'Twilio API Key',
    pattern: /SK[0-9a-fA-F]{32}/g,
    replacement: '[TWILIO_KEY_REDACTED]',
    category: 'credentials',
    description: 'Twilio API key'
  },
  {
    id: 'twilio_sid',
    name: 'Twilio Account SID',
    pattern: /AC[a-f0-9]{32}/gi,
    replacement: '[TWILIO_SID_REDACTED]',
    category: 'credentials',
    description: 'Twilio Account SID'
  },
  {
    id: 'firebase_key',
    name: 'Firebase Cloud Messaging',
    pattern: /AAAA[A-Za-z0-9_-]{7}:[A-Za-z0-9_-]{140}/g,
    replacement: '[FIREBASE_KEY_REDACTED]',
    category: 'credentials',
    description: 'Firebase Cloud Messaging key'
  },
  {
    id: 'telegram_token',
    name: 'Telegram Bot Token',
    pattern: /\d{9,10}:[A-Za-z0-9_-]{35}/g,
    replacement: '[TELEGRAM_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'Telegram bot token'
  },
  {
    id: 'discord_token',
    name: 'Discord Token',
    pattern: /[MN][A-Za-z\d]{23,}\.[\w-]{6}\.[\w-]{27}/g,
    replacement: '[DISCORD_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'Discord bot token'
  },
  {
    id: 'discord_webhook',
    name: 'Discord Webhook',
    pattern: /https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+/gi,
    replacement: '[DISCORD_WEBHOOK_REDACTED]',
    category: 'credentials',
    description: 'Discord webhook URL'
  },

  // === VERSION CONTROL ===
  {
    id: 'github_oauth',
    name: 'GitHub OAuth Token',
    pattern: /gho_[a-zA-Z0-9]{36}/gi,
    replacement: '[GITHUB_OAUTH_REDACTED]',
    category: 'credentials',
    description: 'GitHub OAuth access token'
  },
  {
    id: 'github_app_token',
    name: 'GitHub App Token',
    pattern: /ghu_[a-zA-Z0-9]{36}/gi,
    replacement: '[GITHUB_APP_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'GitHub App user token'
  },
  {
    id: 'gitlab_token',
    name: 'GitLab Token',
    pattern: /glpat-[a-zA-Z0-9_-]{20}/gi,
    replacement: '[GITLAB_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'GitLab personal access token'
  },
  {
    id: 'bitbucket_token',
    name: 'Bitbucket Token',
    pattern: /ATBB[a-zA-Z0-9]{32}/gi,
    replacement: '[BITBUCKET_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'Bitbucket access token'
  },

  // === DATABASE CONNECTIONS ===
  {
    id: 'mongodb_uri',
    name: 'MongoDB URI',
    pattern: /mongodb(\+srv)?:\/\/[^\s"'<>]+/gi,
    replacement: '[MONGODB_URI_REDACTED]',
    category: 'credentials',
    description: 'MongoDB connection strings'
  },
  {
    id: 'postgres_uri',
    name: 'PostgreSQL URI',
    pattern: /postgres(ql)?:\/\/[^\s"'<>]+/gi,
    replacement: '[POSTGRES_URI_REDACTED]',
    category: 'credentials',
    description: 'PostgreSQL connection strings'
  },
  {
    id: 'mysql_uri',
    name: 'MySQL URI',
    pattern: /mysql:\/\/[^\s"'<>]+/gi,
    replacement: '[MYSQL_URI_REDACTED]',
    category: 'credentials',
    description: 'MySQL connection strings'
  },
  {
    id: 'redis_uri',
    name: 'Redis URI',
    pattern: /redis(s)?:\/\/[^\s"'<>]+/gi,
    replacement: '[REDIS_URI_REDACTED]',
    category: 'credentials',
    description: 'Redis connection strings'
  },
  {
    id: 'elasticsearch_uri',
    name: 'Elasticsearch URI',
    pattern: /https?:\/\/[^:]+:[^@]+@[^\s"'<>]*elastic[^\s"'<>]*/gi,
    replacement: '[ELASTICSEARCH_URI_REDACTED]',
    category: 'credentials',
    description: 'Elasticsearch connection'
  },

  // === AUTHENTICATION ===
  {
    id: 'oauth_token',
    name: 'OAuth Token (UUID)',
    pattern: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
    replacement: '[OAUTH_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'OAuth 2.0 tokens (UUID format)'
  },
  {
    id: 'bearer_token',
    name: 'Bearer Token',
    pattern: /Bearer\s+[a-zA-Z0-9_-]+\.?[a-zA-Z0-9_-]*\.?[a-zA-Z0-9_-]*/gi,
    replacement: 'Bearer [REDACTED]',
    category: 'credentials',
    description: 'HTTP Bearer tokens'
  },
  {
    id: 'basic_auth',
    name: 'Basic Auth',
    pattern: /Basic\s+[A-Za-z0-9+/]+=*/gi,
    replacement: 'Basic [REDACTED]',
    category: 'credentials',
    description: 'HTTP Basic authentication'
  },
  {
    id: 'api_key_generic',
    name: 'Generic API Key',
    pattern: /api[_-]?key["'\s:=]+["']?[a-zA-Z0-9_-]{20,}["']?/gi,
    replacement: 'api_key=[REDACTED]',
    category: 'credentials',
    description: 'Generic API key patterns'
  },
  {
    id: 'secret_generic',
    name: 'Generic Secret',
    pattern: /secret["'\s:=]+["']?[a-zA-Z0-9_-]{16,}["']?/gi,
    replacement: 'secret=[REDACTED]',
    category: 'credentials',
    description: 'Generic secret patterns'
  },
  {
    id: 'private_key',
    name: 'Private Key',
    pattern: /-----BEGIN (RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY( BLOCK)?-----[\s\S]*?-----END (RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY( BLOCK)?-----/gi,
    replacement: '[PRIVATE_KEY_REDACTED]',
    category: 'credentials',
    description: 'PEM/SSH private keys'
  },
  {
    id: 'ssh_key',
    name: 'SSH Key',
    pattern: /ssh-(rsa|dss|ed25519|ecdsa)\s+[A-Za-z0-9+/]+[=]{0,2}/gi,
    replacement: '[SSH_KEY_REDACTED]',
    category: 'credentials',
    description: 'SSH public keys'
  },

  // === WEB/SESSION ===
  {
    id: 'cookie_session',
    name: 'Session Cookie',
    pattern: /(session|sess|sid|token|auth)[_-]?(id|token)?[=:]\s*["']?[a-zA-Z0-9_-]{20,}["']?/gi,
    replacement: '$1=[REDACTED]',
    category: 'credentials',
    description: 'Session cookies'
  },
  {
    id: 'url_params',
    name: 'Sensitive URL Parameters',
    pattern: /([?&])(token|key|secret|password|api[_-]?key|auth|session|sid)=[^&\s"']+/gi,
    replacement: '$1$2=[REDACTED]',
    category: 'credentials',
    description: 'Sensitive URL parameters'
  },
  {
    id: 'env_var',
    name: 'Environment Variable',
    pattern: /(PASSWORD|SECRET|KEY|TOKEN|CREDENTIAL|AUTH)[_A-Z]*[=:]\s*["']?[^\s"',;}{]+["']?/gi,
    replacement: '$1=[REDACTED]',
    category: 'credentials',
    description: 'Environment variables with secrets'
  },
  {
    id: 'docker_auth',
    name: 'Docker Auth',
    pattern: /"auth":\s*"[A-Za-z0-9+/=]+"/gi,
    replacement: '"auth":"[REDACTED]"',
    category: 'credentials',
    description: 'Docker registry auth'
  },

  // === EXTENDED PII ===
  {
    id: 'phone_intl',
    name: 'International Phone',
    pattern: /\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
    replacement: '[PHONE_INTL_REDACTED]',
    category: 'pii',
    description: 'International phone numbers'
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
    id: 'drivers_license',
    name: 'Drivers License',
    pattern: /\b[A-Z]\d{7,8}\b/g,
    replacement: '[LICENSE_REDACTED]',
    category: 'pii',
    description: 'Drivers license numbers'
  },
  {
    id: 'dob',
    name: 'Date of Birth',
    pattern: /\b(0[1-9]|1[0-2])[\/\-](0[1-9]|[12]\d|3[01])[\/\-](19|20)\d{2}\b/g,
    replacement: '[DOB_REDACTED]',
    category: 'pii',
    description: 'Date of birth (MM/DD/YYYY)'
  },

  // === NETWORK ===
  {
    id: 'ipv6',
    name: 'IPv6 Address',
    pattern: /(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}/gi,
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
    id: 'internal_url',
    name: 'Internal URL',
    pattern: /https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.[^\s]+|10\.[^\s]+|172\.(?:1[6-9]|2[0-9]|3[0-1])\.[^\s]+)[^\s"']*/gi,
    replacement: '[INTERNAL_URL_REDACTED]',
    category: 'network',
    description: 'Internal/local URLs'
  },

  // === FINANCIAL ===
  {
    id: 'bitcoin_address',
    name: 'Bitcoin Address',
    pattern: /\b(bc1|[13])[a-km-zA-HJ-NP-Z1-9]{25,39}\b/g,
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
    pattern: /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b/g,
    replacement: '[IBAN_REDACTED]',
    category: 'financial',
    description: 'International Bank Account Number'
  },
  {
    id: 'routing_number',
    name: 'Bank Routing Number',
    pattern: /\b\d{9}\b/g,
    replacement: '[ROUTING_REDACTED]',
    category: 'financial',
    description: 'US Bank routing numbers'
  },

  // === NPM/PACKAGE MANAGERS ===
  {
    id: 'npm_token',
    name: 'NPM Token',
    pattern: /npm_[a-zA-Z0-9]{36}/gi,
    replacement: '[NPM_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'NPM access token'
  },
  {
    id: 'pypi_token',
    name: 'PyPI Token',
    pattern: /pypi-[a-zA-Z0-9]{16,}/gi,
    replacement: '[PYPI_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'PyPI API token'
  },

  // === SOCIAL/SERVICES ===
  {
    id: 'facebook_token',
    name: 'Facebook Token',
    pattern: /EAA[a-zA-Z0-9]+/g,
    replacement: '[FB_TOKEN_REDACTED]',
    category: 'credentials',
    description: 'Facebook access token'
  },
  {
    id: 'twitter_bearer',
    name: 'Twitter Bearer Token',
    pattern: /AAAA[a-zA-Z0-9%]+/g,
    replacement: '[TWITTER_BEARER_REDACTED]',
    category: 'credentials',
    description: 'Twitter bearer token'
  },
  {
    id: 'linkedin_secret',
    name: 'LinkedIn Secret',
    pattern: /linkedin[_-]?secret["'\s:=]+["']?[a-zA-Z0-9]{16,}["']?/gi,
    replacement: 'linkedin_secret=[REDACTED]',
    category: 'credentials',
    description: 'LinkedIn client secret'
  },

  // === INFRASTRUCTURE ===
  {
    id: 'datadog_key',
    name: 'Datadog API Key',
    pattern: /[a-f0-9]{32}/gi,
    replacement: '[DATADOG_KEY_REDACTED]',
    category: 'credentials',
    description: 'Datadog API key'
  },
  {
    id: 'newrelic_key',
    name: 'New Relic Key',
    pattern: /NRAK-[a-zA-Z0-9]{27}/gi,
    replacement: '[NEWRELIC_KEY_REDACTED]',
    category: 'credentials',
    description: 'New Relic API key'
  },
  {
    id: 'sentry_dsn',
    name: 'Sentry DSN',
    pattern: /https:\/\/[a-f0-9]+@[a-z0-9]+\.ingest\.sentry\.io\/\d+/gi,
    replacement: '[SENTRY_DSN_REDACTED]',
    category: 'credentials',
    description: 'Sentry DSN'
  },
  {
    id: 'openai_key',
    name: 'OpenAI API Key',
    pattern: /sk-[a-zA-Z0-9]{48}/g,
    replacement: '[OPENAI_KEY_REDACTED]',
    category: 'credentials',
    description: 'OpenAI API key'
  },
  {
    id: 'anthropic_key',
    name: 'Anthropic API Key',
    pattern: /sk-ant-[a-zA-Z0-9-]+/g,
    replacement: '[ANTHROPIC_KEY_REDACTED]',
    category: 'credentials',
    description: 'Anthropic API key'
  }
];

export const TEAM_PATTERNS = [
  ...PRO_PATTERNS,
  // Additional enterprise patterns can be added here
  {
    id: 'custom_regex',
    name: 'Custom Pattern',
    pattern: /CUSTOM_PATTERN_PLACEHOLDER/g,
    replacement: '[CUSTOM_REDACTED]',
    category: 'credentials',
    description: 'Custom user-defined pattern'
  }
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
  const words = text.split(/[\s\n\r"':=,{}[\]]+/);
  const suspects = [];

  words.forEach(word => {
    // Only check strings that look like potential secrets
    if (word.length >= 16 && word.length <= 200) {
      // Check if it's mostly alphanumeric (likely a token/key)
      const alphanumericRatio = (word.match(/[a-zA-Z0-9]/g) || []).length / word.length;
      
      if (alphanumericRatio > 0.7) {
        const entropy = calculateEntropy(word);
        if (entropy >= threshold) {
          suspects.push({
            text: word,
            entropy: entropy.toFixed(2),
            type: 'high_entropy',
            confidence: entropy >= 5 ? 'high' : 'medium'
          });
        }
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
    case 'lifetime':
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

// Get pattern count by tier
export function getPatternCount(tier) {
  return getPatternsByTier(tier).length;
}

// Export pattern names for documentation
export function getPatternNames(tier) {
  return getPatternsByTier(tier).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category
  }));
}
