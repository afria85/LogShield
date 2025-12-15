// src/pages/DocumentationPage.jsx
import { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { 
  Book, 
  Code, 
  Terminal, 
  FileText, 
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Search
} from 'lucide-react';

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Book,
    content: `
## Quick Start

LogShield works entirely in your browser - no installation required!

1. **Paste your logs** in the input area
2. **Click Sanitize** to remove sensitive data
3. **Copy or download** the sanitized output

That's it! Your data never leaves your device.

## Free Tier Limits

- 20 sanitizations per month
- Up to 5,000 characters per sanitization
- 10 basic pattern categories
    `,
  },
  {
    id: 'patterns',
    title: 'Pattern Guide',
    icon: Code,
    content: `
## Built-in Patterns

LogShield includes 70+ regex patterns organized into categories:

### API Keys
- AWS Access Keys (AKIA...)
- Stripe Keys (sk_live_...)
- GitHub Tokens (ghp_...)
- And many more...

### PII Data
- Email addresses
- Phone numbers
- Social Security Numbers
- Credit card numbers

### Credentials
- Passwords in various formats
- Bearer tokens
- JWT tokens
- Basic auth headers

### Database URIs
- MongoDB connection strings
- PostgreSQL URIs
- MySQL credentials
- Redis URLs
    `,
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: Terminal,
    content: `
## Coming Soon: REST API

We're building a REST API for automated sanitization:

\`\`\`bash
curl -X POST https://api.logshield.dev/v1/sanitize \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "api_key=sk_live_abc123"}'
\`\`\`

**Expected Response:**

\`\`\`json
{
  "sanitized": "api_key=[API_KEY_REDACTED]",
  "stats": {
    "patterns_matched": 1,
    "processing_time_ms": 12
  }
}
\`\`\`

Sign up for early access at hello@logshield.dev
    `,
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: FileText,
    content: `
## Frequently Asked Questions

### Is my data really private?

Yes! LogShield processes everything in your browser using JavaScript. Your logs never leave your device, and we have no way to access them.

### Can I use LogShield offline?

Yes! Once the page is loaded, LogShield works completely offline. This makes it perfect for air-gapped environments.

### What if I need more sanitizations?

You can upgrade to our Pro or Team plans for higher limits. Visit our pricing page for details.

### Can I add custom patterns?

Custom patterns are coming in a future update! For now, contact us if you need specific patterns added.

### Is there a CLI tool?

A CLI tool is in development. Sign up for our newsletter to be notified when it's ready.
    `,
  },
];

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useSEO({
    title: 'Documentation - LogShield',
    description: 'Learn how to use LogShield to sanitize your logs. Guides, API reference, and FAQ.',
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Documentation
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Learn how to use LogShield effectively
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeSection === section.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.title}</span>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                    activeSection === section.id ? 'rotate-90' : ''
                  }`} />
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <div className="flex items-center gap-3 mb-6">
                <currentSection.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">
                  {currentSection.title}
                </h2>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
                <div 
                  className="prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-pre:bg-slate-100 dark:prose-pre:bg-slate-900"
                  dangerouslySetInnerHTML={{ __html: currentSection.content.replace(/`{3}(\w+)?\n([\s\S]*?)`{3}/g, '<pre class="rounded-lg p-4 overflow-x-auto"><code>$2</code></pre>').replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-sm">$1</code>').replace(/### (.*)/g, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>').replace(/## (.*)/g, '<h2 class="text-xl font-bold mt-8 mb-4">$1</h2>').replace(/- (.*)/g, '<li class="ml-4">$1</li>').replace(/\n\n/g, '</p><p class="mb-4">').replace(/^/, '<p class="mb-4">').replace(/$/, '</p>') }}
                />
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
