// src/hooks/useSEO.jsx
import { useEffect } from 'react';

/**
 * Custom hook for managing SEO meta tags
 * Updates document title and meta tags dynamically
 */
export function useSEO({
  title = 'LogShield',
  description = 'Privacy-first log sanitizer for developers',
  keywords = '',
  image = 'https://logshield.dev/og-image.png',
  url = 'https://logshield.dev',
  type = 'website'
}) {
  useEffect(() => {
    // Update document title
    const fullTitle = title.includes('LogShield') ? title : `${title} | LogShield`;
    document.title = fullTitle;

    // Helper to update or create meta tag
    const updateMeta = (selector, content, attr = 'content') => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attr, content);
      }
    };

    // Update standard meta tags
    updateMeta('meta[name="description"]', description);
    if (keywords) {
      updateMeta('meta[name="keywords"]', keywords);
    }

    // Update Open Graph tags
    updateMeta('meta[property="og:title"]', fullTitle);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:image"]', image);
    updateMeta('meta[property="og:url"]', url);
    updateMeta('meta[property="og:type"]', type);

    // Update Twitter Card tags
    updateMeta('meta[name="twitter:title"]', fullTitle);
    updateMeta('meta[name="twitter:description"]', description);
    updateMeta('meta[name="twitter:image"]', image);
    updateMeta('meta[name="twitter:url"]', url);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    }

  }, [title, description, keywords, image, url, type]);
}

export default useSEO;
