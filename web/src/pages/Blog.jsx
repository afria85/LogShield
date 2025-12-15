// src/pages/Blog.jsx
// FIXED: Subscribe button overflow on mobile
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Tag,
  Search,
  Mail,
  CheckCircle,
  Loader2,
  BookOpen
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

// Blog posts data (would come from API/CMS in production)
const blogPosts = [
  {
    id: 'why-log-sanitization-matters',
    title: 'Why Log Sanitization Matters for Developer Security',
    excerpt: 'Learn why sanitizing logs before sharing is crucial for maintaining security and preventing accidental credential leaks.',
    date: '2025-01-10',
    readTime: '5 min read',
    category: 'Security',
    featured: true,
    image: '/blog/log-sanitization.jpg',
  },
  {
    id: 'top-10-secrets-exposed-in-logs',
    title: 'Top 10 Secrets Developers Accidentally Expose in Logs',
    excerpt: 'From API keys to database credentials, discover the most common secrets that end up in logs and how to prevent leaks.',
    date: '2025-01-05',
    readTime: '7 min read',
    category: 'Best Practices',
    featured: false,
  },
  {
    id: 'gdpr-compliance-logging',
    title: 'GDPR Compliance: What You Need to Know About Logging PII',
    excerpt: 'A comprehensive guide to handling personally identifiable information in your application logs while staying GDPR compliant.',
    date: '2024-12-28',
    readTime: '8 min read',
    category: 'Compliance',
    featured: false,
  },
  {
    id: 'regex-patterns-secret-detection',
    title: 'Building Effective Regex Patterns for Secret Detection',
    excerpt: 'Deep dive into creating accurate regex patterns that catch secrets without too many false positives.',
    date: '2024-12-20',
    readTime: '10 min read',
    category: 'Technical',
    featured: false,
  },
  {
    id: 'browser-based-security-tools',
    title: 'Why Browser-Based Security Tools Are the Future',
    excerpt: 'Explore the benefits of client-side processing for security tools and why your data should never leave your browser.',
    date: '2024-12-15',
    readTime: '6 min read',
    category: 'Privacy',
    featured: false,
  },
];

const categories = ['All', 'Security', 'Best Practices', 'Compliance', 'Technical', 'Privacy'];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle'); // idle, loading, success, error

  useSEO({
    title: 'Blog - LogShield',
    description: 'Tips, tutorials, and best practices for log sanitization, security, and privacy.',
  });

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || subscribeStatus === 'loading') return;

    setSubscribeStatus('loading');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In production, send to your email service (Mailchimp, ConvertKit, etc.)
    setSubscribeStatus('success');
    setEmail('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 animate-fade-in-up">
            <BookOpen className="w-4 h-4" />
            LogShield Blog
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Security Insights & Tips
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Learn about log sanitization, security best practices, and keeping your data safe.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && !searchQuery && (
          <Link 
            to={`/blog/${featuredPost.id}`}
            className="group block mb-12 animate-fade-in-up"
            style={{ animationDelay: '400ms' }}
          >
            <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 sm:p-12">
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                  <Tag className="w-4 h-4" />
                  Featured
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:underline decoration-2 underline-offset-4">
                  {featuredPost.title}
                </h2>
                <p className="text-white/80 text-lg mb-6 max-w-2xl">
                  {featuredPost.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featuredPost.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPosts.filter(p => !p.featured || selectedCategory !== 'All' || searchQuery).map((post, index) => (
            <Link 
              to={`/blog/${post.id}`}
              key={post.id}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${(index + 5) * 100}ms` }}
            >
              <article className="h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Image placeholder */}
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                </div>
                
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium mb-3">
                    {post.category}
                  </span>
                  
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* No results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No articles found matching your criteria.
            </p>
          </div>
        )}

        {/* Newsletter Subscription - FIXED MOBILE OVERFLOW */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 lg:p-12 animate-fade-in-up">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-white/80 mb-8">
              Get the latest security tips and LogShield updates delivered to your inbox.
            </p>

            {subscribeStatus === 'success' ? (
              <div className="flex items-center justify-center gap-2 text-white animate-fade-in-up">
                <CheckCircle className="w-6 h-6 text-emerald-300" />
                <span className="text-lg font-medium">Thanks for subscribing!</span>
              </div>
            ) : (
              /* FIXED: Stack vertically on mobile, use full width */
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === 'loading'}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-white/90 disabled:opacity-70 transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {subscribeStatus === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="text-white/60 text-sm mt-4">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
