// src/components/Footer.jsx
import { Shield, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Documentation', href: '#docs' },
      { name: 'API', href: '#api' }
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Contact', href: 'mailto:hello@logshield.dev' },
      { name: 'Changelog', href: '#changelog' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy.html' },
      { name: 'Terms of Service', href: '/terms.html' },
      { name: 'Refund Policy', href: '/refund.html' },
      { name: 'License', href: '#license' }
    ],
    social: [
      { name: 'GitHub', icon: Github, href: 'https://github.com/afria85/LogShield' },
      { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/logshield' },
      { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/logshield' }
    ]
  };

  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-gray-300 border-t border-gray-800 dark:border-slate-800 transition-colors duration-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg group-hover:shadow-blue-500/25 transition-shadow duration-300">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LogShield</span>
            </div>
            
            <p className="text-gray-400 mb-4 max-w-sm leading-relaxed">
              Privacy-first log sanitizer for developers. 
              Remove sensitive data from logs securely, right in your browser.
              No data leaves your device.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-800 dark:bg-slate-800 hover:bg-gray-700 dark:hover:bg-slate-700 text-gray-400 hover:text-white transition-all duration-200"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm hover:pl-1"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm hover:pl-1"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm hover:pl-1"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter (Optional) */}
        <div className="py-8 border-t border-gray-800 dark:border-slate-800 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-white font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get notified about new features, security updates, and tips.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 bg-gray-800 dark:bg-slate-800 border border-gray-700 dark:border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm">
            {/* Left: Copyright */}
            <p className="text-gray-500 text-center lg:text-left order-2 lg:order-1">
              © {currentYear} LogShield. All rights reserved.
            </p>
            
            {/* Center: Made with love */}
            <p className="text-gray-400 text-center order-1 lg:order-2 flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" /> for developers worldwide
            </p>
            
            {/* Right: Contact */}
            <a
              href="mailto:hello@logshield.dev"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 order-3"
            >
              <Mail className="h-4 w-4" />
              hello@logshield.dev
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
