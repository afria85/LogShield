// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ChevronDown,
  Sparkles,
  Crown
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLicense } from '../contexts/LicenseContext'; // NEW IMPORT

export default function Header() { // Hilangkan { license }
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme, isDark } = useTheme();
  const location = useLocation();
  const licenseManager = useLicense(); // NEW: Gunakan context
  const license = licenseManager.getLicense(); // Akses dari manager

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/docs', label: 'Docs' },
    { href: '/blog', label: 'Blog' },
  ];

  const isActive = (path) => location.pathname === path;

  const tierBadge = license?.tier && license.tier !== 'free' ? (
    <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white">
      <Crown className="w-3 h-3" />
      {license.tier.toUpperCase()}
    </span>
  ) : null;

  return (
    <>
      <header 
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300 ease-out
          ${isScrolled 
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20' 
            : 'bg-transparent'
          }
        `}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                LogShield
              </span>
              {tierBadge}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive(link.href)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Theme toggle */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <div className="relative w-5 h-5">
                  <Sun className={`w-5 h-5 absolute transition-all duration-300 ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                  <Moon className={`w-5 h-5 absolute transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
                </div>
              </button>

              {/* CTA Button - Desktop */}
              <Link
                to="/app"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                Try Free
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="relative w-5 h-5">
                  <Menu className={`w-5 h-5 absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                  <X className={`w-5 h-5 absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`} />
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div 
          className={`
            md:hidden overflow-hidden
            transition-all duration-300 ease-out
            ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`
                    block px-4 py-3 rounded-lg text-base font-medium
                    transition-all duration-200
                    animate-fade-in-up
                    ${isActive(link.href)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile CTA */}
              <Link
                to="/app"
                className="block mt-4 px-4 py-3 rounded-lg text-base font-medium text-center text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: '200ms' }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Try Free
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
}
