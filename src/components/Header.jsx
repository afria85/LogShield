// src/components/Header.jsx
import { Shield, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export default function Header({ currentSection, onNavigate, license }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'App', id: 'app' },
    { name: 'Pricing', id: 'pricing' }
  ];

  const tierColors = {
    free: 'bg-gray-100 text-gray-800',
    starter: 'bg-blue-100 text-blue-800',
    pro: 'bg-purple-100 text-purple-800',
    team: 'bg-green-100 text-green-800',
    lifetime: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LogShield
            </span>
            <span className="text-xs text-gray-500 -mt-1">
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
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                currentSection === item.id
                  ? 'text-blue-600'
                  : 'text-gray-700'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* License Badge & CTA */}
        <div className="hidden md:flex items-center gap-3">
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Upgrade
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container py-4 space-y-3">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentSection === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
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
              <div className="px-4">
                <Button
                  onClick={() => {
                    onNavigate('pricing');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Upgrade Now
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}