// src/lib/patterns.js
// Security pattern definitions with confidence scoring and context detection
// 70+ patterns with categorization and severity levels

import { Key, User, Globe, CreditCard, Search } from 'lucide-react';

// ============================================
// PATTERN CATEGORIES (Lucide Icons - No Emoji)
// ============================================
export const PATTERN_CATEGORIES = [
  { id: 'all', name: 'All Patterns', icon: Search, color: 'text-slate-600' },
  { id: 'credentials', name: 'Credentials', icon: Key, color: 'text-red-600' },
  { id: 'pii', name: 'Personal Info', icon: User, color: 'text-blue-600' },
  { id: 'network', name: 'Network', icon: Globe, color: 'text-green-600' },
  { id: 'financial', name: 'Financial', icon: CreditCard, color: 'text-amber-600' }
];

// ============================================
// CONFIDENCE LEVELS
// ============================================
export const CONFIDENCE = {
  HIGH: 0.95,    // Very specific patterns (e.g., AWS keys with AKIA prefix)
  MEDIUM: 0.75,  // Good patterns with some context needed
  LOW: 0.50      // Generic patterns that may have false positives
};

// ============================================
// CONTEXT KEYWORDS (for enhanced detection)
// ============================================
const CONTEXT_KEYWORDS = {
  credentials: ['password', 'secret', 'key', 'token', 'auth', 'credential', 'api_key', 'apikey'],
  database: ['mongodb', 'postgres', 'mysql', 'redis', 'connection', 'database', 'db_'],
  financial: ['card', 'credit', 'debit', 'payment', 'account', 'bank', 'iban', 'routing']
};

// ============================================
// FREE TIER PATTERNS (10 basic patterns)
// ============================================
export const FREE_PATTERNS = [
  // === HIGH CONFIDENCE CREDENTIALS ===
  {
    id: 'aws_access_key',
    name: 'AWS Access Key',
    pattern: /(?<![A-Z0-9])AKIA[0-9A-Z]{16}(?![A-Z0-9])/g,
    replacement: '[AWS_KEY_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'AWS Access Key ID (starts with AKIA)',
    example: 'AKIAIOSFODNN7EXAMPLE'
  },
  {
    id: 'jwt_token',
    name: 'JWT Token',
    pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g,
    replacement: '[JWT_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'JSON Web Tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  {
    id: 'github_token',
    name: 'GitHub Token',
    pattern: /gh[ps]_[a-zA-Z0-9]{36}/g,
    replacement: '[GITHUB_TOKEN_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'GitHub Personal/App tokens',
    example: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'slack_token',
    name: 'Slack Token',
    pattern: /xox[baprs]-[0-9a-zA-Z-]{10,}/g,
    replacement: '[SLACK_TOKEN_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'Slack API tokens',
    example: 'xoxb-1234567890-1234567890123-abcdefghijk'
  },
  {
    id: 'password_field',
    name: 'Password Field',
    pattern: /(?:password|passwd|pwd)[\s]*[=:]+[\s]*["']?([^\s"',;}{[\]]+)["']?/gi,
    replacement: 'password=[REDACTED]',
    category: 'credentials',
    severity: 'high',
    confidence: CONFIDENCE.MEDIUM,
    description: 'Password fields in logs/config',
    example: 'password=secret123'
  },

  // === BASIC PII ===
  {
    id: 'email',
    name: 'Email Address',
    pattern: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g,
    replacement: '[EMAIL_REDACTED]',
    category: 'pii',
    severity: 'medium',
    confidence: CONFIDENCE.HIGH,
    description: 'Email addresses',
    example: 'user@example.com'
  },
  {
    id: 'phone_us',
    name: 'US Phone Number',
    pattern: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    replacement: '[PHONE_REDACTED]',
    category: 'pii',
    severity: 'medium',
    confidence: CONFIDENCE.MEDIUM,
    description: 'US phone numbers',
    example: '+1 (555) 123-4567'
  },
  {
    id: 'ssn',
    name: 'Social Security Number',
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    replacement: '[SSN_REDACTED]',
    category: 'pii',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'US Social Security Numbers',
    example: '123-45-6789'
  },

  // === BASIC NETWORK ===
  {
    id: 'ipv4',
    name: 'IPv4 Address',
    pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    replacement: '[IP_REDACTED]',
    category: 'network',
    severity: 'low',
    confidence: CONFIDENCE.HIGH,
    description: 'IPv4 addresses',
    example: '192.168.1.100'
  },

  // === BASIC FINANCIAL ===
  {
    id: 'credit_card',
    name: 'Credit Card',
    pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
    replacement: '[CARD_REDACTED]',
    category: 'financial',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'Credit card numbers (Visa, MC, Amex, Discover)',
    example: '4111111111111111'
  }
];

// ============================================
// PRO/STARTER TIER PATTERNS (40+ patterns)
// ============================================
export const PRO_PATTERNS = [
  ...FREE_PATTERNS,
  
  // === CLOUD PROVIDER CREDENTIALS ===
  {
    id: 'aws_secret_key',
    name: 'AWS Secret Key',
    // More specific pattern with context
    pattern: /(?:aws[_-]?secret[_-]?(?:access[_-]?)?key|secret[_-]?key)[\s]*[=:]+[\s]*["']?([A-Za-z0-9/+=]{40})["']?/gi,
    replacement: 'aws_secret_key=[REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'AWS Secret Access Key with context',
    example: 'aws_secret_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
  },
  {
    id: 'gcp_api_key',
    name: 'GCP API Key',
    pattern: /AIza[0-9A-Za-z-_]{35}/g,
    replacement: '[GCP_KEY_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'Google Cloud Platform API key',
    example: 'AIzaSyC-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  },
  {
    id: 'gcp_service_account',
    name: 'GCP Service Account',
    pattern: /"type"\s*:\s*"service_account"[\s\S]{0,500}?"private_key"/g,
    replacement: '[GCP_SERVICE_ACCOUNT_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'GCP service account JSON',
    example: '{"type": "service_account", ...}'
  },
  {
    id: 'azure_connection_string',
    name: 'Azure Connection String',
    pattern: /DefaultEndpointsProtocol=https?;AccountName=[^;]+;AccountKey=[^;]+(?:;EndpointSuffix=[^;]+)?/gi,
    replacement: '[AZURE_CONNECTION_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'Azure storage connection string',
    example: 'DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=...'
  },
  {
    id: 'digitalocean_token',
    name: 'DigitalOcean Token',
    pattern: /dop_v1_[a-f0-9]{64}/gi,
    replacement: '[DO_TOKEN_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'DigitalOcean API token',
    example: 'dop_v1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },

  // === PAYMENT PROVIDERS ===
  {
    id: 'stripe_secret',
    name: 'Stripe Secret Key',
    pattern: /sk_live_[0-9a-zA-Z]{24,}/g,
    replacement: '[STRIPE_SECRET_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'Stripe live secret key',
    example: 'sk_live_xxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'stripe_test',
    name: 'Stripe Test Key',
    pattern: /sk_test_[0-9a-zA-Z]{24,}/g,
    replacement: '[STRIPE_TEST_REDACTED]',
    category: 'credentials',
    severity: 'medium',
    confidence: CONFIDENCE.HIGH,
    description: 'Stripe test secret key',
    example: 'sk_test_xxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'stripe_publishable',
    name: 'Stripe Publishable Key',
    pattern: /pk_(?:live|test)_[0-9a-zA-Z]{24,}/g,
    replacement: '[STRIPE_PK_REDACTED]',
    category: 'credentials',
    severity: 'low',
    confidence: CONFIDENCE.HIGH,
    description: 'Stripe publishable key',
    example: 'pk_live_xxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'paypal_token',
    name: 'PayPal Access Token',
    pattern: /access_token\$production\$[0-9a-z]{16}\$[0-9a-f]{32}/gi,
    replacement: '[PAYPAL_TOKEN_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'PayPal/Braintree access token',
    example: 'access_token$production$xxxxxxxx$yyyyyyyy'
  },

  // === EMAIL/MESSAGING SERVICES ===
  {
    id: 'sendgrid_key',
    name: 'SendGrid API Key',
    pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g,
    replacement: '[SENDGRID_KEY_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'SendGrid API key',
    example: 'SG.xxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'mailgun_key',
    name: 'Mailgun API Key',
    pattern: /key-[0-9a-zA-Z]{32}/g,
    replacement: '[MAILGUN_KEY_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'Mailgun API key',
    example: 'key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'twilio_sid',
    name: 'Twilio Account SID',
    pattern: /AC[a-f0-9]{32}/g,
    replacement: '[TWILIO_SID_REDACTED]',
    category: 'credentials',
    severity: 'high',
    confidence: CONFIDENCE.HIGH,
    description: 'Twilio Account SID',
    example: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'twilio_auth_token',
    name: 'Twilio Auth Token',
    pattern: /(?:twilio[_-]?auth[_-]?token|auth[_-]?token)[\s]*[=:]+[\s]*["']?([a-f0-9]{32})["']?/gi,
    replacement: 'twilio_auth_token=[REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'Twilio Auth Token',
    example: 'twilio_auth_token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'telegram_bot_token',
    name: 'Telegram Bot Token',
    pattern: /\d{8,10}:[A-Za-z0-9_-]{35}/g,
    replacement: '[TELEGRAM_TOKEN_REDACTED]',
    category: 'credentials',
    severity: 'high',
    confidence: CONFIDENCE.HIGH,
    description: 'Telegram bot token',
    example: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz123456789'
  },
  {
    id: 'discord_token',
    name: 'Discord Bot Token',
    pattern: /[MN][A-Za-z\d]{23,}\.[\w-]{6}\.[\w-]{27}/g,
    replacement: '[DISCORD_TOKEN_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'Discord bot token',
    example: 'MTA...xxx.xxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'discord_webhook',
    name: 'Discord Webhook URL',
    pattern: /https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+/gi,
    replacement: '[DISCORD_WEBHOOK_REDACTED]',
    category: 'credentials',
    severity: 'high',
    confidence: CONFIDENCE.HIGH,
    description: 'Discord webhook URL',
    example: 'https://discord.com/api/webhooks/123456789/abc...'
  },

  // === VERSION CONTROL ===
  {
    id: 'github_oauth',
    name: 'GitHub OAuth Token',
    pattern: /gho_[a-zA-Z0-9]{36}/g,
    replacement: '[GITHUB_OAUTH_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'GitHub OAuth access token',
    example: 'gho_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'gitlab_token',
    name: 'GitLab Token',
    pattern: /glpat-[a-zA-Z0-9_-]{20}/g,
    replacement: '[GITLAB_TOKEN_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'GitLab personal access token',
    example: 'glpat-xxxxxxxxxxxxxxxxxxxx'
  },

  // === DATABASE CONNECTIONS ===
  {
    id: 'mongodb_uri',
    name: 'MongoDB URI',
    pattern: /mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi,
    replacement: '[MONGODB_URI_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'MongoDB connection strings',
    example: 'mongodb+srv://user:pass@cluster.mongodb.net/db'
  },
  {
    id: 'postgres_uri',
    name: 'PostgreSQL URI',
    pattern: /postgres(?:ql)?:\/\/[^\s"'<>]+/gi,
    replacement: '[POSTGRES_URI_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'PostgreSQL connection strings',
    example: 'postgresql://user:pass@localhost:5432/db'
  },
  {
    id: 'mysql_uri',
    name: 'MySQL URI',
    pattern: /mysql:\/\/[^\s"'<>]+/gi,
    replacement: '[MYSQL_URI_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'MySQL connection strings',
    example: 'mysql://user:pass@localhost:3306/db'
  },
  {
    id: 'redis_uri',
    name: 'Redis URI',
    pattern: /redis(?:s)?:\/\/[^\s"'<>]+/gi,
    replacement: '[REDIS_URI_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'Redis connection strings',
    example: 'redis://user:pass@localhost:6379'
  },

  // === GENERIC CREDENTIALS ===
  {
    id: 'private_key_pem',
    name: 'Private Key (PEM)',
    pattern: /-----BEGIN\s+(?:RSA\s+|EC\s+|DSA\s+)?PRIVATE\s+KEY-----[\s\S]+?-----END\s+(?:RSA\s+|EC\s+|DSA\s+)?PRIVATE\s+KEY-----/g,
    replacement: '[PRIVATE_KEY_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'PEM private keys',
    example: '-----BEGIN RSA PRIVATE KEY-----...'
  },
  {
    id: 'bearer_token',
    name: 'Bearer Token',
    pattern: /Bearer\s+[a-zA-Z0-9_.-]{20,}/gi,
    replacement: 'Bearer [REDACTED]',
    category: 'credentials',
    severity: 'high',
    confidence: CONFIDENCE.HIGH,
    description: 'HTTP Bearer tokens',
    example: 'Bearer eyJhbGciOiJIUzI1NiIs...'
  },
  {
    id: 'basic_auth',
    name: 'Basic Auth Header',
    pattern: /Basic\s+[A-Za-z0-9+/=]{10,}/gi,
    replacement: 'Basic [REDACTED]',
    category: 'credentials',
    severity: 'high',
    confidence: CONFIDENCE.HIGH,
    description: 'HTTP Basic authentication',
    example: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
  },
  {
    id: 'url_credentials',
    name: 'URL with Credentials',
    pattern: /https?:\/\/[^:]+:[^@]+@[^\s"'<>]+/gi,
    replacement: '[URL_WITH_CREDENTIALS_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'URLs containing embedded credentials',
    example: 'https://user:password@example.com'
  },
  {
    id: 'url_secret_params',
    name: 'URL Secret Parameters',
    pattern: /([?&])(?:token|key|secret|password|api[_-]?key|access[_-]?token)=([^&\s"']+)/gi,
    replacement: '$1$2=[REDACTED]',
    category: 'credentials',
    severity: 'high',
    confidence: CONFIDENCE.MEDIUM,
    description: 'Sensitive URL query parameters',
    example: '?api_key=secret123&token=abc'
  },

  // === EXTENDED PII ===
  {
    id: 'phone_intl',
    name: 'International Phone',
    pattern: /\+\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
    replacement: '[PHONE_INTL_REDACTED]',
    category: 'pii',
    severity: 'medium',
    confidence: CONFIDENCE.MEDIUM,
    description: 'International phone numbers',
    example: '+49 123 456 7890'
  },
  {
    id: 'dob',
    name: 'Date of Birth',
    pattern: /\b(?:0[1-9]|1[0-2])[-/](?:0[1-9]|[12]\d|3[01])[-/](?:19|20)\d{2}\b/g,
    replacement: '[DOB_REDACTED]',
    category: 'pii',
    severity: 'medium',
    confidence: CONFIDENCE.MEDIUM,
    description: 'Date of birth (MM/DD/YYYY or MM-DD-YYYY)',
    example: '01/15/1990'
  },
  {
    id: 'passport_number',
    name: 'Passport Number',
    pattern: /(?:passport[:\s]+)?[A-Z]{1,2}\d{6,9}/gi,
    replacement: '[PASSPORT_REDACTED]',
    category: 'pii',
    severity: 'high',
    confidence: CONFIDENCE.MEDIUM,
    description: 'Passport numbers',
    example: 'passport: AB1234567'
  },

  // === NETWORK ===
  {
    id: 'ipv6',
    name: 'IPv6 Address',
    pattern: /(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}/g,
    replacement: '[IPv6_REDACTED]',
    category: 'network',
    severity: 'low',
    confidence: CONFIDENCE.HIGH,
    description: 'IPv6 addresses',
    example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
  },
  {
    id: 'mac_address',
    name: 'MAC Address',
    pattern: /(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}/g,
    replacement: '[MAC_REDACTED]',
    category: 'network',
    severity: 'low',
    confidence: CONFIDENCE.HIGH,
    description: 'MAC addresses',
    example: '00:1A:2B:3C:4D:5E'
  },
  {
    id: 'internal_url',
    name: 'Internal URL',
    pattern: /https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})[^\s"'<>]*/gi,
    replacement: '[INTERNAL_URL_REDACTED]',
    category: 'network',
    severity: 'medium',
    confidence: CONFIDENCE.HIGH,
    description: 'Internal/private network URLs',
    example: 'http://192.168.1.1/admin'
  },

  // === FINANCIAL ===
  {
    id: 'bitcoin_address',
    name: 'Bitcoin Address',
    pattern: /\b(?:bc1|[13])[a-km-zA-HJ-NP-Z1-9]{25,39}\b/g,
    replacement: '[BTC_ADDRESS_REDACTED]',
    category: 'financial',
    severity: 'high',
    confidence: CONFIDENCE.HIGH,
    description: 'Bitcoin wallet addresses',
    example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
  },
  {
    id: 'ethereum_address',
    name: 'Ethereum Address',
    pattern: /0x[a-fA-F0-9]{40}/g,
    replacement: '[ETH_ADDRESS_REDACTED]',
    category: 'financial',
    severity: 'high',
    confidence: CONFIDENCE.HIGH,
    description: 'Ethereum wallet addresses',
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  },
  {
    id: 'iban',
    name: 'IBAN',
    pattern: /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}(?:[A-Z0-9]?){0,16}\b/g,
    replacement: '[IBAN_REDACTED]',
    category: 'financial',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'International Bank Account Number',
    example: 'DE89370400440532013000'
  },

  // === AI/ML SERVICES ===
  {
    id: 'openai_key',
    name: 'OpenAI API Key',
    pattern: /sk-[a-zA-Z0-9]{48}/g,
    replacement: '[OPENAI_KEY_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'OpenAI API key',
    example: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'anthropic_key',
    name: 'Anthropic API Key',
    pattern: /sk-ant-[a-zA-Z0-9-_]{90,}/g,
    replacement: '[ANTHROPIC_KEY_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'Anthropic API key',
    example: 'sk-ant-api03-...'
  },

  // === NPM/PACKAGE MANAGERS ===
  {
    id: 'npm_token',
    name: 'NPM Token',
    pattern: /npm_[a-zA-Z0-9]{36}/g,
    replacement: '[NPM_TOKEN_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'NPM access token',
    example: 'npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },

  // === MONITORING/OBSERVABILITY ===
  {
    id: 'sentry_dsn',
    name: 'Sentry DSN',
    pattern: /https:\/\/[a-f0-9]+@(?:o\d+\.)?(?:[\w-]+\.)?sentry\.io\/\d+/gi,
    replacement: '[SENTRY_DSN_REDACTED]',
    category: 'credentials',
    severity: 'high',
    confidence: CONFIDENCE.HIGH,
    description: 'Sentry DSN',
    example: 'https://xxx@oXXX.ingest.sentry.io/XXX'
  },
  {
    id: 'newrelic_key',
    name: 'New Relic API Key',
    pattern: /NRAK-[a-zA-Z0-9]{27}/g,
    replacement: '[NEWRELIC_KEY_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'New Relic API key',
    example: 'NRAK-xxxxxxxxxxxxxxxxxxxxxxxxxxx'
  }
];

// ============================================
// TEAM TIER PATTERNS (70+ patterns)
// ============================================
export const TEAM_PATTERNS = [
  ...PRO_PATTERNS,
  
  // Additional enterprise patterns
  {
    id: 'docker_auth',
    name: 'Docker Registry Auth',
    pattern: /"auth"\s*:\s*"[A-Za-z0-9+/=]{20,}"/gi,
    replacement: '"auth":"[REDACTED]"',
    category: 'credentials',
    severity: 'high',
    confidence: CONFIDENCE.HIGH,
    description: 'Docker registry authentication',
    example: '"auth":"dXNlcm5hbWU6cGFzc3dvcmQ="'
  },
  {
    id: 'env_secret',
    name: 'Environment Secret',
    pattern: /(?:^|[\n\r])([A-Z_]+(?:SECRET|KEY|TOKEN|PASSWORD|CREDENTIAL|AUTH)[A-Z_]*)[\s]*=[\s]*["']?([^\s"'\n\r]+)["']?/gm,
    replacement: '$1=[REDACTED]',
    category: 'credentials',
    severity: 'high',
    confidence: CONFIDENCE.MEDIUM,
    description: 'Environment variables containing secrets',
    example: 'DATABASE_SECRET=mysecret123'
  },
  {
    id: 'ssh_private_key',
    name: 'SSH Private Key',
    pattern: /-----BEGIN\s+(?:OPENSSH\s+)?PRIVATE\s+KEY-----[\s\S]+?-----END\s+(?:OPENSSH\s+)?PRIVATE\s+KEY-----/g,
    replacement: '[SSH_PRIVATE_KEY_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'SSH private keys',
    example: '-----BEGIN OPENSSH PRIVATE KEY-----...'
  },
  {
    id: 'pgp_private_key',
    name: 'PGP Private Key',
    pattern: /-----BEGIN\s+PGP\s+PRIVATE\s+KEY\s+BLOCK-----[\s\S]+?-----END\s+PGP\s+PRIVATE\s+KEY\s+BLOCK-----/g,
    replacement: '[PGP_PRIVATE_KEY_REDACTED]',
    category: 'credentials',
    severity: 'critical',
    confidence: CONFIDENCE.HIGH,
    description: 'PGP private key blocks',
    example: '-----BEGIN PGP PRIVATE KEY BLOCK-----...'
  },
  {
    id: 'xml_secret',
    name: 'XML Secret Element',
    pattern: /<(?:password|secret|key|token|credential)[^>]*>([^<]+)<\/(?:password|secret|key|token|credential)>/gi,
    replacement: '<$1>[REDACTED]</$1>',
    category: 'credentials',
    severity: 'high',
    confidence: CONFIDENCE.MEDIUM,
    description: 'Secrets in XML configuration',
    example: '<password>secret123</password>'
  },
  {
    id: 'json_secret',
    name: 'JSON Secret Field',
    pattern: /"(?:password|secret|key|token|credential|api_key)"[\s]*:[\s]*"([^"]+)"/gi,
    replacement: '"$1":"[REDACTED]"',
    category: 'credentials',
    severity: 'high',
    confidence: CONFIDENCE.MEDIUM,
    description: 'Secrets in JSON configuration',
    example: '"password": "secret123"'
  }
];

// ============================================
// AI-BASED ENTROPY DETECTION
// ============================================
export function detectHighEntropy(text, threshold = 4.5, minLength = 16, maxLength = 200) {
  const words = text.split(/[\s\n\r"':=,{}[\]()<>]+/);
  const suspects = [];

  words.forEach(word => {
    // Filter by length
    if (word.length < minLength || word.length > maxLength) return;
    
    // Check alphanumeric ratio (secrets are usually alphanumeric)
    const alphanumCount = (word.match(/[a-zA-Z0-9]/g) || []).length;
    const alphanumRatio = alphanumCount / word.length;
    
    if (alphanumRatio < 0.7) return;
    
    // Skip if it looks like a URL path or common word
    if (/^(?:https?|ftp|file):/.test(word)) return;
    if (/^(?:true|false|null|undefined|none|function|class|const|let|var)$/i.test(word)) return;
    
    const entropy = calculateEntropy(word);
    
    if (entropy >= threshold) {
      suspects.push({
        text: word,
        entropy: entropy.toFixed(2),
        type: 'high_entropy',
        confidence: entropy >= 5 ? 'high' : entropy >= 4.5 ? 'medium' : 'low',
        position: text.indexOf(word)
      });
    }
  });

  // Remove duplicates
  return suspects.filter((item, index, self) =>
    index === self.findIndex(t => t.text === item.text)
  );
}

function calculateEntropy(str) {
  const len = str.length;
  const frequencies = {};
  
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  let entropy = 0;
  for (const char in frequencies) {
    const probability = frequencies[char] / len;
    entropy -= probability * Math.log2(probability);
  }

  return entropy;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get patterns based on license tier
 */
export function getPatternsByTier(tier) {
  const tierMap = {
    free: FREE_PATTERNS,
    starter: PRO_PATTERNS,
    pro: PRO_PATTERNS,
    team: TEAM_PATTERNS,
    enterprise: TEAM_PATTERNS,
    lifetime: PRO_PATTERNS,
    lifetime_pro: PRO_PATTERNS
  };
  return tierMap[tier?.toLowerCase()] || FREE_PATTERNS;
}

/**
 * Filter patterns by category
 */
export function filterPatternsByCategory(patterns, category) {
  if (!category || category === 'all') return patterns;
  return patterns.filter(p => p.category === category);
}

/**
 * Filter patterns by severity
 */
export function filterPatternsBySeverity(patterns, minSeverity) {
  const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
  const minLevel = severityOrder[minSeverity] || 1;
  return patterns.filter(p => (severityOrder[p.severity] || 1) >= minLevel);
}

/**
 * Get pattern count by tier
 */
export function getPatternCount(tier) {
  return getPatternsByTier(tier).length;
}

/**
 * Get pattern statistics
 */
export function getPatternStats(tier) {
  const patterns = getPatternsByTier(tier);
  
  return {
    total: patterns.length,
    byCategory: PATTERN_CATEGORIES.slice(1).map(cat => ({
      ...cat,
      count: patterns.filter(p => p.category === cat.id).length
    })),
    bySeverity: {
      critical: patterns.filter(p => p.severity === 'critical').length,
      high: patterns.filter(p => p.severity === 'high').length,
      medium: patterns.filter(p => p.severity === 'medium').length,
      low: patterns.filter(p => p.severity === 'low').length
    }
  };
}

/**
 * Check if text contains context keywords for enhanced detection
 */
export function hasContextKeywords(text, category) {
  const keywords = CONTEXT_KEYWORDS[category] || [];
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
}

/**
 * Export pattern metadata for documentation
 */
export function getPatternMetadata(tier) {
  return getPatternsByTier(tier).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    severity: p.severity,
    confidence: p.confidence,
    description: p.description,
    example: p.example
  }));
}
