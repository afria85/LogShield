import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Sanitizer from './components/Sanitizer';
import Pricing from './components/Pricing';
import Features from './components/Features';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { licenseManager } from './lib/license';
import { ThemeProvider, useTheme } from './hooks/useTheme';

function AppContent() {
  const [currentSection, setCurrentSection] = useState('home');
  const [license, setLicense] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    setLicense(licenseManager.currentLicense);
    if (window.plausible) {
      window.plausible('pageview');
    }
  }, []);

  const handleUpgradeClick = (tier) => {
    if (window.plausible) {
      window.plausible('Upgrade Click', { props: { tier } });
    }
    
    const checkoutUrls = {
      starter: import.meta.env.VITE_GUMROAD_STARTER_URL || import.meta.env.VITE_LEMON_STARTER_URL,
      pro: import.meta.env.VITE_GUMROAD_PRO_URL || import.meta.env.VITE_LEMON_PRO_URL,
      team: import.meta.env.VITE_GUMROAD_TEAM_URL || import.meta.env.VITE_LEMON_TEAM_URL,
      lifetime: import.meta.env.VITE_GUMROAD_LIFETIME_URL || import.meta.env.VITE_LEMON_LIFETIME_URL
    };

    const url = checkoutUrls[tier];
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Payment integration coming soon! For early access, email: hello@logshield.dev');
    }
  };

  const handleSanitizeComplete = (stats) => {
    if (window.plausible) {
      window.plausible('Sanitize', {
        props: {
          tier: license?.tier || 'free',
          patterns: stats?.totalReplacements || 0
        }
      });
    }
    licenseManager.trackUsage();
    setLicense(licenseManager.currentLicense);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <>
            <Hero onGetStarted={() => setCurrentSection('app')} />
            <Features />
            <Pricing onUpgrade={handleUpgradeClick} license={license} />
          </>
        );
      case 'app':
        return (
          <Sanitizer
            license={license}
            onUpgrade={() => setCurrentSection('pricing')}
            onSanitizeComplete={handleSanitizeComplete}
          />
        );
      case 'pricing':
        return <Pricing onUpgrade={handleUpgradeClick} license={license} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-bg transition-colors duration-300">
      <Helmet>
        <title>LogShield - Privacy Log Sanitizer for Developers</title>
        <meta name="description" content="Sanitize logs client-side to remove API keys, PII, and sensitive data. The ultimate privacy tool for developers in 2025 — secure, fast, and free to start." />
        <meta name="keywords" content="log sanitizer, privacy log tool, log redaction tool, developer privacy tools, API key remover, sensitive data cleaner, client-side log sanitizer, log monitoring privacy" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.logshield.dev/" />
        
        {/* Open Graph */}
        <meta property="og:title" content="LogShield: Secure Your Logs with Privacy-First Sanitization" />
        <meta property="og:description" content="Remove sensitive info from logs instantly. Perfect for devs sharing code safely." />
        <meta property="og:image" content="https://www.logshield.dev/og-image.png" />
        <meta property="og:url" content="https://www.logshield.dev/" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LogShield - Privacy Log Tool for Developers" />
        <meta name="twitter:description" content="Client-side log sanitizer to protect your data. Start free today!" />
        <meta name="twitter:image" content="https://www.logshield.dev/og-image.png" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content={theme === 'dark' ? '#0f172a' : '#f8fafc'} />
        <meta name="google-site-verification" content="85Gk802UJeWAcLxyMkz_fbX5s5HR7hDI2WCxlR0LkPY" />
      </Helmet>
      
      <Header
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        license={license}
      />
      
      <main className="min-h-[calc(100vh-80px)]">
        {renderSection()}
      </main>

      <Footer />
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
