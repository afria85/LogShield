import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
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
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LogShield</span>
            </div>
            
            <p className="text-gray-400 mb-4 max-w-sm">
              Privacy-first log sanitizer for developers. 
              Remove sensitive data from logs securely, right in your browser.
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
                    className="text-gray-400 hover:text-white transition-colors"
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
            <ul className="space-y-2">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
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
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
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
            <ul className="space-y-2">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm">
            {/* Left: Copyright */}
            <p className="text-gray-400 text-center lg:text-left order-1">
              &copy; 2025 LogShield. All rights reserved.
            </p>
            
            {/* Center: Made with love - CENTERED on desktop */}
            <p className="text-gray-400 text-center order-3 lg:order-2">
              Made with &#x2764; for developers worldwide
            </p>
            
            {/* Right: Contact */}
            <a
              href="mailto:hello@logshield.dev"
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors order-2 lg:order-3"
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