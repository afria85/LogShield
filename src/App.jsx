// src/App.jsx
// Main application with React Router
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { analytics } from './lib/analytics';
import { LicenseProvider } from './contexts/LicenseContext'; // NEW IMPORT

// Layout components
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

// Pages - ONLY ONE PRICING PAGE (uses component internally)
import HomePage from './pages/HomePage';
import AppPage from './pages/AppPage';
import PricingPage from './pages/PricingPage';
import FeaturesPage from './pages/FeaturesPage';
import DocumentationPage from './pages/DocumentationPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/Blog';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import RefundPage from './pages/RefundPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Track page views
function PageTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    analytics.pageview(pathname);
  }, [pathname]);

  return null;
}

// App content
function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <PageTracker />

      <Header /> {/* No license prop */}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<AppPage />} /> {/* No license prop */}
          <Route path="/pricing" element={<PricingPage />} /> {/* No license prop */}
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          
          {/* Legal pages */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund" element={<RefundPage />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

// 404 Page
function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-200 dark:text-slate-700 mb-4">404</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">Page not found</p>
        <a 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

// App with providers
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <LicenseProvider> {/* NEW WRAPPER */}
          <AppContent />
        </LicenseProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}