import { useSEO } from './hooks/useSEO';

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

  useSEO({
    title: 'Blog | LogShield',
    description: 'Read the latest articles on log security, privacy, and developer tools from the LogShield team.',
    image: 'https://logshield.dev/og-image.png',
    url: 'https://logshield.dev/blog'
});

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

export default BlogPage;