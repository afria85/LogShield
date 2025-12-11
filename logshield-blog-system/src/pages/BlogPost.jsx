// src/pages/BlogPost.jsx
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Share2, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO';
import { getBlogPost, getAllPosts } from '../lib/blog';

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [copied, setCopied] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const postData = getBlogPost(slug);
    if (!postData) {
      navigate('/blog');
      return;
    }
    setPost(postData);
    
    // Get related posts (same category, exclude current)
    const allPosts = getAllPosts();
    const related = allPosts
      .filter(p => p.slug !== slug && p.category === postData.category)
      .slice(0, 2);
    setRelatedPosts(related);
    
    analytics.trackPageView(`/blog/${slug}`);
  }, [slug, navigate]);

  useSEO({
    title: post?.title ? `${post.title} | LogShield Blog` : 'Blog | LogShield',
    description: post?.excerpt || 'LogShield Blog',
    url: `https://logshield.dev/blog/${slug}`
  });

  const handleShare = async (platform) => {
    const url = window.location.href;
    const text = post?.title || 'Check out this article';
    
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    analytics.trackEvent('share_post', { platform, slug });
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <article className="container py-12">
        {/* Back Link */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {post.excerpt}
            </p>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Share:</span>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Copy link"
              >
                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-600 dark:prose-p:text-gray-300
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-code:bg-gray-100 dark:prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:text-gray-100
              prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              prose-li:text-gray-600 dark:prose-li:text-gray-300
              prose-strong:text-gray-900 dark:prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* TL;DR Box */}
          {post.tldr && (
            <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3">📌 TL;DR</h3>
              <div 
                className="text-blue-800 dark:text-blue-200 text-sm space-y-2"
                dangerouslySetInnerHTML={{ __html: post.tldr }}
              />
            </div>
          )}

          {/* Author & CTA */}
          <div className="mt-12 p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Written by the LogShield Team
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  We're developers who've leaked enough secrets to know better. Now we build tools to help others avoid the same mistakes.
                </p>
                <Link 
                  to="/app"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Try LogShield Free
                </Link>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="font-bold text-gray-900 dark:text-white mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedPosts.map((related, idx) => (
                  <Link
                    key={idx}
                    to={`/blog/${related.slug}`}
                    className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                  >
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {related.category}
                    </span>
                    <h4 className="font-semibold text-gray-900 dark:text-white mt-1">
                      {related.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
