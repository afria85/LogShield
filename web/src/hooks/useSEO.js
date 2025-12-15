// src/hooks/useSEO.js
import { useEffect } from 'react';

const DEFAULT_TITLE = 'LogShield - Privacy-First Log Sanitizer';
const DEFAULT_DESCRIPTION = 'Remove API keys, tokens, credentials, and PII from logs instantly. 100% client-side processing.';

/**
 * Hook to manage SEO meta tags
 * @param {Object} options - SEO options
 * @param {string} options.title - Page title
 * @param {string} options.description - Meta description
 * @param {string} options.image - OG image URL
 * @param {string} options.url - Canonical URL
 * @param {string} options.type - OG type (default: website)
 */
export function useSEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = '/og-image.png',
  url,
  type = 'website',
} = {}) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMeta = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`) ||
                 document.querySelector(`meta[name="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Standard meta tags
    updateMeta('description', description);

    // Open Graph tags
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:image', image);
    updateMeta('og:type', type);
    if (url) {
      updateMeta('og:url', url);
    }

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // Cleanup function
    return () => {
      // Reset to defaults when component unmounts
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, image, url, type]);
}

export default useSEO;
