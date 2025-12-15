import { ArrowLeft, Shield, Code, Zap, Lock, FileText, BookOpen, Users, MessageCircle } from 'lucide-react';

// ============================================
// FEATURES PAGE
// ============================================
function FeaturesPage() {
  const features = [
    {
      category: "Core Features",
      icon: Shield,
      items: [
        {
          title: "70+ Security Patterns",
          description: "Comprehensive coverage for AWS, GCP, Azure, Stripe, MongoDB, PostgreSQL, and more. Regularly updated with new patterns."
        },
        {
          title: "AI-Powered Detection",
          description: "Advanced entropy analysis automatically detects unknown secrets and high-risk patterns that traditional regex might miss."
        },
        {
          title: "Batch Processing",
          description: "Sanitize multiple files at once with drag-and-drop support. Perfect for cleaning entire log directories."
        },
        {
          title: "Custom Patterns",
          description: "Add your own regex patterns for company-specific secrets or internal conventions. Save and reuse across sessions."
        }
      ]
    },
    {
      category: "Privacy & Security",
      icon: Lock,
      items: [
        {
          title: "100% Client-Side",
          description: "All processing happens in your browser. Your logs never leave your device, ensuring complete privacy."
        },
        {
          title: "Zero Data Storage",
          description: "We don't store, log, or transmit your data. What you sanitize stays with you."
        },
        {
          title: "GDPR Compliant",
          description: "Privacy-first design that meets GDPR, CCPA, and HIPAA requirements out of the box."
        },
        {
          title: "No Tracking",
          description: "We use privacy-friendly analytics (Plausible) with no cookies or personal data collection."
        }
      ]
    },
    {
      category: "Export & Integration",
      icon: FileText,
      items: [
        {
          title: "Multiple Export Formats",
          description: "Export sanitized logs as plain text, JSON, CSV, or PDF with detailed reports."
        },
        {
          title: "API Access",
          description: "REST API for programmatic access. Integrate LogShield into your CI/CD pipelines."
        },
        {
          title: "CLI Tool",
          description: "Command-line interface for batch processing and automation. Perfect for DevOps workflows."
        },
        {
          title: "VS Code Extension",
          description: "Sanitize logs directly in your editor. Right-click and clean without leaving your IDE."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="container py-12">
        <a href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </a>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Features that <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">empower developers</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl">
          Everything you need to safely share logs without compromising security
        </p>

        {features.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{section.category}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {section.items.map((item, i) => (
                  <div key={i} className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-16 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-blue-100 mb-6">Try LogShield now ? no signup required</p>
          <a href="/#app" className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Start Sanitizing Free
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DOCUMENTATION PAGE
// ============================================
function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      content: [
        { title: "Quick Start", desc: "Get up and running in 2 minutes" },
        { title: "How It Works", desc: "Understanding the sanitization process" },
        { title: "Supported Patterns", desc: "Complete list of 70+ patterns" }
      ]
    },
    {
      title: "Usage Guides",
      content: [
        { title: "Basic Sanitization", desc: "Paste, click, done" },
        { title: "Batch Processing", desc: "Handle multiple files at once" },
        { title: "Custom Patterns", desc: "Create your own patterns" },
        { title: "Export Options", desc: "Choose the right format" }
      ]
    },
    {
      title: "API Reference",
      content: [
        { title: "Authentication", desc: "Using API keys" },
        { title: "Endpoints", desc: "Available API endpoints" },
        { title: "Rate Limits", desc: "Understanding limits" },
        { title: "Error Handling", desc: "Common errors and fixes" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="container py-12">
        <a href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </a>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Documentation
              </h3>
              <nav className="space-y-2">
                {sections.map((section, idx) => (
                  <div key={idx}>
                    <button className="text-sm text-gray-700 hover:text-blue-600 font-medium w-full text-left py-2">
                      {section.title}
                    </button>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
            <p className="text-xl text-gray-600 mb-8">
              Everything you need to know about using LogShield
            </p>

            {sections.map((section, idx) => (
              <div key={idx} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
                <div className="grid gap-4">
                  {section.content.map((item, i) => (
                    <div key={i} className="p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? We're here to help.
              </p>
              <a href="mailto:hello@logshield.dev" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ABOUT PAGE
// ============================================
function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="container py-12">
        <a href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </a>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About LogShield
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Privacy-first log sanitization for developers worldwide
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="p-8 bg-white rounded-xl border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                LogShield was born from a simple need: developers need to share logs for debugging, 
                but those logs often contain sensitive data that shouldn't be exposed.
              </p>
              <p className="text-gray-600 mb-4">
                After seeing countless incidents where API keys, tokens, and credentials were 
                accidentally leaked in GitHub issues, Stack Overflow posts, and support tickets, 
                we knew there had to be a better way.
              </p>
              <p className="text-gray-600">
                We built LogShield to be the tool we wished existed: fast, private, and 
                comprehensive. No complex setup, no data upload, just paste and sanitize.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-white rounded-xl border border-gray-200 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-sm text-gray-600">Client-Side Processing</div>
              </div>
              <div className="p-6 bg-white rounded-xl border border-gray-200 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">70+</div>
                <div className="text-sm text-gray-600">Security Patterns</div>
              </div>
              <div className="p-6 bg-white rounded-xl border border-gray-200 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-sm text-gray-600">Developers Trust Us</div>
              </div>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">?? Privacy First</h3>
                  <p className="text-gray-600">
                    Your data never leaves your browser. We don't store, log, or transmit 
                    anything you sanitize.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">?? Developer Experience</h3>
                  <p className="text-gray-600">
                    Built by developers for developers. Simple, fast, and effective?no 
                    unnecessary complexity.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">?? Open Source</h3>
                  <p className="text-gray-600">
                    Core sanitization engine is open source. Transparency builds trust.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">?? Continuous Improvement</h3>
                  <p className="text-gray-600">
                    We regularly update patterns and add features based on community feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
              <p className="text-blue-100 mb-6">
                Connect with other developers, share feedback, and help shape the future of LogShield
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://github.com/afria85/LogShield" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  GitHub
                </a>
                <a href="mailto:hello@logshield.dev" className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// BLOG PAGE
// ============================================
function BlogPage() {
  const posts = [
    {
      title: "Introducing LogShield: The Privacy-First Log Sanitizer",
      excerpt: "Learn how LogShield helps developers safely share logs without exposing sensitive data.",
      date: "January 10, 2025",
      readTime: "5 min read",
      category: "Product"
    },
    {
      title: "10 Common Ways Secrets Leak in Logs",
      excerpt: "Understanding the most common patterns of credential exposure and how to prevent them.",
      date: "January 8, 2025",
      readTime: "8 min read",
      category: "Security"
    },
    {
      title: "Building a Client-Side Log Sanitizer",
      excerpt: "Technical deep-dive into how we process sensitive data entirely in your browser.",
      date: "January 5, 2025",
      readTime: "12 min read",
      category: "Technical"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="container py-12">
        <a href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </a>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-600 mb-12">
          Insights on log security, privacy, and developer tools
        </p>

        <div className="max-w-4xl mx-auto space-y-8">
          {posts.map((post, idx) => (
            <article key={idx} className="p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">{post.date}</span>
                <span className="text-sm text-gray-500">?</span>
                <span className="text-sm text-gray-500">{post.readTime}</span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-600 mb-4">
                {post.excerpt}
              </p>
              
              <button className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-2">
                Read more
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            </article>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <p className="text-gray-700 mb-4">
            Want to stay updated? Subscribe to our newsletter.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP WITH ROUTING
// ============================================
export default function App() {
  const [currentPage, setCurrentPage] = React.useState('features');

  const pages = {
    features: <FeaturesPage />,
    docs: <DocsPage />,
    about: <AboutPage />,
    blog: <BlogPage />
  };

  return (
    <div>
      {/* Navigation */}
      <div className="p-4 bg-white border-b flex gap-4 justify-center">
        {Object.keys(pages).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
      </div>

      {/* Page Content */}
      {pages[currentPage]}
    </div>
  );
}