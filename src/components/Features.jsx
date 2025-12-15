// src/components/Features.jsx
import { 
  Shield, 
  Zap, 
  Lock, 
  Code2, 
  Globe, 
  FileText,
  Eye,
  Database,
  Key,
  Mail,
  CreditCard,
  Server,
  Cpu,
  Layers,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '70+ Detection Patterns',
    description: 'Comprehensive regex patterns for API keys, passwords, tokens, PII, and more.',
    color: 'blue',
  },
  {
    icon: Lock,
    title: '100% Client-Side',
    description: 'Your data never leaves your browser. Zero server processing, complete privacy.',
    color: 'emerald',
  },
  {
    icon: Zap,
    title: 'Instant Processing',
    description: 'Real-time sanitization with millisecond response times.',
    color: 'amber',
  },
  {
    icon: Eye,
    title: 'Preview Mode',
    description: 'See what will be redacted before processing. Full control over your data.',
    color: 'purple',
  },
  {
    icon: Code2,
    title: 'Developer Friendly',
    description: 'Works with JSON, XML, YAML, and plain text logs. No configuration needed.',
    color: 'pink',
  },
  {
    icon: Globe,
    title: 'Works Offline',
    description: 'Once loaded, LogShield works without internet. Perfect for air-gapped environments.',
    color: 'cyan',
  },
];

const patternCategories = [
  { icon: Key, name: 'API Keys', count: 15, examples: ['AWS', 'Stripe', 'GitHub'] },
  { icon: Database, name: 'Database URIs', count: 8, examples: ['MongoDB', 'PostgreSQL', 'Redis'] },
  { icon: Mail, name: 'PII Data', count: 12, examples: ['Email', 'Phone', 'SSN'] },
  { icon: CreditCard, name: 'Financial', count: 10, examples: ['Credit Card', 'Bank Account'] },
  { icon: Server, name: 'Infrastructure', count: 15, examples: ['IP Address', 'Hostname', 'URL'] },
  { icon: Lock, name: 'Credentials', count: 10, examples: ['Password', 'Token', 'Secret'] },
];

export default function Features() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4 animate-fade-in-up">
            <Cpu className="w-4 h-4" />
            Powerful Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Everything You Need for
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Secure Log Handling
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Built for developers who value privacy and security without compromising on convenience.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 mb-4`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Pattern categories */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 sm:p-12">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              70+ Built-in Patterns
            </h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Automatically detect and sanitize sensitive data across all common formats.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {patternCategories.map((category, index) => (
              <div 
                key={category.name}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <category.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {category.name}
                      </h4>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {category.count} patterns
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {category.examples.map((example) => (
                        <span 
                          key={example}
                          className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>SOC 2 Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>No Data Collection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>Open Source Core</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
