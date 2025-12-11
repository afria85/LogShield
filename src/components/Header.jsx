// src/components/Header.jsx
import { Shield, Menu, X, Zap, Moon, Sun, Monitor } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useTheme } from '../hooks/useTheme';

export default function Header({ currentSection, onNavigate, license }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'App', id: 'app' },
    { name: 'Pricing', id: 'pricing' }
  ];

  const tierColors = {
    free: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    starter: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
    pro: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200',
    team: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200',
    lifetime: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg transition-colors duration-300">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-md group-hover:shadow-lg transition-shadow duration-200">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold gradient-text">
              LogShield
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">
              Secure Log Sanitizer
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`
                text-sm font-medium transition-all duration-200 
                hover:text-blue-600 dark:hover:text-blue-400
                relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
                after:bg-gradient-to-r after:from-blue-600 after:to-purple-600
                after:transition-all after:duration-200
                ${currentSection === item.id
                  ? 'text-blue-600 dark:text-blue-400 after:w-full'
                  : 'text-gray-700 dark:text-gray-300 after:w-0 hover:after:w-full'
                }
              `}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Right side: Theme toggle, License Badge & CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </button>

          {license && (
            <Badge className={tierColors[license.tier]}>
              <Zap className="h-3 w-3 mr-1" />
              {license.tier.toUpperCase()}
            </Badge>
          )}
          
          {license?.tier === 'free' && (
            <Button
              onClick={() => onNavigate('pricing')}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Upgrade
            </Button>
          )}
        </div>

        {/* Mobile: Theme toggle + Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </button>

          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`
          md:hidden border-t border-gray-200 dark:border-slate-700 
          bg-white dark:bg-slate-900
          overflow-hidden transition-all duration-300 ease-out
          ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="container py-4 space-y-3">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`
                block w-full text-left px-4 py-3 rounded-lg text-sm font-medium 
                transition-all duration-200
                ${currentSection === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }
              `}
            >
              {item.name}
            </button>
          ))}
          
          {license && (
            <div className="px-4 py-2">
              <Badge className={`${tierColors[license.tier]} text-sm`}>
                <Zap className="h-3 w-3 mr-1" />
                {license.tier.toUpperCase()} Plan
              </Badge>
            </div>
          )}

          {license?.tier === 'free' && (
            <div className="px-4 pt-2">
              <Button
                onClick={() => {
                  onNavigate('pricing');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-md"
              >
                Upgrade Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
