// src/hooks/useSEO.js - FIXED VERSION
import { useEffect } from 'react';

/**
 * Custom hook for dynamic SEO meta tags management
 * @param {Object} options - SEO configuration
 */
export const useSEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  type = 'website'
}) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title.includes('LogShield') ? title : `${title} | LogShield`;
    }

    // Helper function to update meta tags
    const updateMetaTag = (name, content) => {
      if (!content) return;

      let meta = document.querySelector(`meta[name="${name}"]`) || 
                  document.querySelector(`meta[property="${name}"]`);

      if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    };

    // Update description
    updateMetaTag('description', description || 'Remove API keys, tokens, emails, and PII from logs instantly. Privacy-first, browser-based tool.');

    // Update keywords
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Open Graph tags
    updateMetaTag('og:title', title || 'LogShield - Secure Log Sanitizer');
    updateMetaTag('og:description', description || 'Remove sensitive data from logs instantly. Privacy-first, 100% client-side processing.');
    updateMetaTag('og:type', type);
    updateMetaTag('og:image', image || 'https://logshield.dev/og-image.png');
    updateMetaTag('og:url', url || window.location.href);
    updateMetaTag('og:site_name', 'LogShield');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title || 'LogShield - Secure Log Sanitizer');
    updateMetaTag('twitter:description', description || 'Remove sensitive data from logs instantly.');
    updateMetaTag('twitter:image', image || 'https://logshield.dev/og-image.png');
    updateMetaTag('twitter:site', '@logshield');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url || window.location.href);

    // Structured data (JSON-LD)
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]#dynamic-seo');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      structuredDataScript.id = 'dynamic-seo';
      document.head.appendChild(structuredDataScript);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': title || 'LogShield',
      'description': description || 'Privacy-first log sanitizer',
      'url': url || window.location.href,
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Any',
      'browserRequirements': 'Requires JavaScript',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    };

    structuredDataScript.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, image, url, type]);
};

/**
 * Simpler hook for title only
 */
export const usePageTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = title.includes('LogShield') ? title : `${title} | LogShield`;
    }
  }, [title]);
};

export default useSEO;