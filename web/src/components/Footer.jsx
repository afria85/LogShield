// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Github, 
  Twitter, 
  Mail,
  Heart,
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Changelog', href: '/changelog' },
    ],
    resources: [
      { label: 'Blog', href: '/blog' },
      { label: 'API Reference', href: '/docs#api' },
      { label: 'Pattern Guide', href: '/docs#patterns' },
      { label: 'FAQ', href: '/docs#faq' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: 'mailto:hello@logshield.dev', external: true },
      { label: 'GitHub', href: 'https://github.com/afria85/LogShield', external: true },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refund Policy', href: '/refund' },
    ],
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                LogShield
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
              Privacy-first log sanitization for developers. Remove secrets instantly, right in your browser.
            </p>
            
            {/* Social links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/afria85/LogShield"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/logshield"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@logshield.dev"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar - FIXED LAYOUT */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright - Left */}
            <p className="text-sm text-slate-500 dark:text-slate-400 order-2 sm:order-1">
              &copy; {currentYear} LogShield. All rights reserved.
            </p>

            {/* Made with love - Center */}
            <p className="text-sm text-slate-500 dark:text-slate-400 order-1 sm:order-2 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Germany
            </p>

            {/* Email - Right */}
            <a
              href="mailto:hello@logshield.dev"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200 order-3"
            >
              hello@logshield.dev
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
