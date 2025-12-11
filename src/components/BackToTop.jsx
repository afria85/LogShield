// src/components/BackToTop.jsx
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Track event
    if (window.plausible) {
      window.plausible('Back to Top Click');
    }
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed bottom-6 right-6 z-50
        p-3 rounded-full
        bg-gradient-to-r from-blue-600 to-purple-600
        text-white shadow-lg
        transition-all duration-300 ease-out
        hover:shadow-xl hover:scale-110
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-slate-900
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
        ${isHovered ? 'animate-bounce-up' : ''}
      `}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
      
      {/* Ripple effect on hover */}
      <span 
        className={`
          absolute inset-0 rounded-full
          bg-white/20
          transition-transform duration-300
          ${isHovered ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}
        `}
      />
    </button>
  );
}
