// src/pages/AboutPage.jsx
import { useSEO } from '../hooks/useSEO';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Globe, 
  Heart,
  Github,
  Twitter,
  Mail,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  useSEO({
    title: 'About - LogShield',
    description: 'Learn about LogShield, our mission, and the team behind the privacy-first log sanitization tool.',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in-up">
            About LogShield
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Building tools that respect your privacy while solving real problems.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-slate dark:prose-invert mx-auto">
            <h2>Our Story</h2>
            <p>
              LogShield was born from a simple frustration: every time we needed to share logs 
              with colleagues or in support tickets, we had to manually scrub sensitive data. 
              API keys, passwords, emails — they were everywhere.
            </p>
            <p>
              Existing solutions either required sending our data to third-party servers 
              (defeating the purpose) or complex setup with CLI tools. We wanted something 
              simpler: paste, click, done.
            </p>
            <p>
              That's why LogShield processes everything in your browser. Your logs never 
              leave your device. No accounts, no servers, no data collection. Just instant, 
              private sanitization.
            </p>

            <h2>Our Values</h2>
            
            <h3>🔒 Privacy First</h3>
            <p>
              We believe privacy is a fundamental right. LogShield is designed so we 
              literally cannot access your data — it never touches our servers.
            </p>

            <h3>⚡ Developer Experience</h3>
            <p>
              Tools should get out of your way. No signup, no configuration, no learning curve. 
              LogShield works instantly.
            </p>

            <h3>🌍 Open & Transparent</h3>
            <p>
              Our core sanitization engine is open source. You can inspect the code, suggest 
              improvements, or use it in your own projects.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Questions, feedback, or partnership inquiries? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hello@logshield.dev"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              hello@logshield.dev
            </a>
            <a
              href="https://github.com/afria85/LogShield"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
