// src/App.jsx - WITH REACT ROUTER (including BlogPost)
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { licenseManager } from './lib/license';
import { ThemeProvider } from './hooks/useTheme';

// Pages
import HomePage from './pages/Home';
import AppPage from './pages/App';
import PricingPage from './pages/Pricing';
import FeaturesPage from './pages/Features';
import DocumentationPage from './pages/Documentation';
import AboutPage from './pages/About';
import BlogPage from './pages/Blog';
import BlogPostPage from './pages/BlogPost';
import PrivacyPage from './pages/Privacy';
import TermsPage from './pages/Terms';

function AppContent() {
  const [license, setLicense] = useState(null);

  useEffect(() => {
    licenseManager.loadLicense();
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
      starter: import.meta.env.VITE_GUMROAD_STARTER_URL,
      pro: import.meta.env.VITE_GUMROAD_PRO_URL,
      team: import.meta.env.VITE_GUMROAD_TEAM_URL,
      lifetime: import.meta.env.VITE_GUMROAD_LIFETIME_URL
    };

    const url = checkoutUrls[tier];
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Payment integration coming soon! For early access, email: hello@logshield.dev');
    }
  };

  return (
    <div className="min-h-screen gradient-bg transition-colors duration-300">
      <Header license={license} />
      
      <main className="min-h-[calc(100vh-80px)]">
        <Routes>
          <Route path="/" element={<HomePage onUpgrade={handleUpgradeClick} />} />
          <Route path="/app" element={<AppPage license={license} />} />
          <Route path="/pricing" element={<PricingPage onUpgrade={handleUpgradeClick} />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
