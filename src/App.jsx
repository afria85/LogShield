import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Sanitizer from './components/Sanitizer';
import Pricing from './components/Pricing';
import Features from './components/Features';
import Footer from './components/Footer';
import { licenseManager } from './lib/license';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [license, setLicense] = useState(null);

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
      starter: import.meta.env.VITE_LEMON_STARTER_URL,
      pro: import.meta.env.VITE_LEMON_PRO_URL,
      team: import.meta.env.VITE_LEMON_TEAM_URL,
      lifetime: import.meta.env.VITE_LEMON_LIFETIME_URL
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
          tier: license.tier,
          patterns: stats.totalReplacements
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <Header
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        license={license}
      />
      
      <main className="min-h-[calc(100vh-80px)]">
        {renderSection()}
      </main>

      <Footer />
    </div>
  );
}

export default App;