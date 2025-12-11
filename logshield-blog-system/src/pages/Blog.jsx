// src/pages/Blog.jsx - Updated to use blog library
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO';
import { getAllPosts, getFeaturedPosts, getCategories, getPostsByCategory } from '../lib/blog';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const categories = getCategories();

  useEffect(() => {
    analytics.trackPageView('/blog');
    
    const featured = getFeaturedPosts()[0];
    setFeaturedPost(featured);
    
    const allPosts = getPostsByCategory(selectedCategory);
    // Exclude featured from main list
    setPosts(allPosts.filter(p => !p.featured));
  }, [selectedCategory]);

  useSEO({
    title: 'Blog | LogShield',
    description: 'Latest articles on log security, privacy best practices, and developer tools from the LogShield team.',
    url: 'https://logshield.dev/blog'
  });

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    analytics.trackEvent('blog_filter', { category });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container py-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Insights on log security, privacy, and developer tools
          </p>
        </div>

        {/* Categories */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && (
          <div className="max-w-4xl mx-auto mb-8">
            <Link to={`/blog/${featuredPost.slug}`}>
              <article className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    Featured
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {featuredPost.category}
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  {featuredPost.title}
                </h2>
                
                <p className="text-blue-100 mb-4 text-lg">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-blue-200">
                    <span>{featuredPost.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  
                  <span className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            </Link>
          </div>
        )}

        {/* Posts Grid */}
        <div className="max-w-4xl mx-auto space-y-6">
          {posts.map((post, idx) => (
            <Link key={idx} to={`/blog/${post.slug}`}>
              <article 
                className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                
                <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read more
                  <ArrowRight className="h-4 w-4" />
                </span>
              </article>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && !featuredPost && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No posts in this category yet. Check back soon!
            </p>
          </div>
        )}

        {/* Newsletter */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Stay Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get the latest articles on log security and privacy delivered to your inbox.
            </p>
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
