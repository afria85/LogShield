// src/components/Sanitizer.jsx
import { useState, useCallback, useMemo } from 'react';
import { 
  Shield, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Eye,
  EyeOff,
  Settings,
  FileText
} from 'lucide-react';
import { quickSanitize, getSanitizationStats } from '../lib/sanitizer';
import { PATTERN_CATEGORIES } from '../lib/patterns';
import { licenseManager } from '../lib/license';
import { analytics } from '../lib/analytics';
import { useLicense } from '../contexts/LicenseContext';


export default function Sanitizer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [error, setError] = useState(null);

  const licenseManager = useLicense(); // NEW

  // Get tier info
  const tierInfo = useMemo(() => licenseManager.getTierInfo(), []);

  // Get usage stats
  const usageStats = useMemo(() => licenseManager.getUsageStats(), []);

  // Check if can sanitize
  const canSanitize = useMemo(() => {
    return usageStats.remaining > 0;
  }, [usageStats]);

  // Handle sanitization
  const handleSanitize = useCallback(async () => {
    if (!input.trim()) {
      setError('Please enter some text to sanitize');
      return;
    }

    if (!canSanitize) {
      setError('Monthly limit reached. Upgrade for more sanitizations.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate slight delay for UX
      await new Promise(resolve => setTimeout(resolve, 100));

      const startTime = performance.now();
      
      // Perform sanitization
      const result = quickSanitize(input, patterns, {
        detectEntropy: tierInfo.features?.entropy || false,
      });
      
      const endTime = performance.now();

      // Get stats
      const sanitizationStats = getSanitizationStats(input, result.text);
      sanitizationStats.processingTime = Math.round(endTime - startTime);

      setOutput(result.text);
      setStats(sanitizationStats);

      // Track usage
      licenseManager.trackUsage();

      // Track analytics
      analytics.trackSanitize(tierInfo.tier, sanitizationStats);
    } catch (err) {
      setError(err.message || 'An error occurred during sanitization');
      analytics.trackError('sanitization', err.message);
    } finally {
      setIsProcessing(false);
    }
  }, [input, canSanitize, selectedCategories, tierInfo]);

  // Handle copy
  const handleCopy = useCallback(async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      analytics.trackCopy(tierInfo.tier);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  }, [output, tierInfo.tier]);

  // Handle file upload
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB for free, 10MB for paid)
    const maxSize = tierInfo.tier === 'free' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File too large. Maximum size: ${maxSize / 1024 / 1024}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(event.target.result);
      setOutput('');
      setStats(null);
      setError(null);
      analytics.trackFileUpload(file.type, file.size);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = '';
  }, [tierInfo.tier]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!output) return;

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sanitized-log-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    analytics.trackExport('txt', tierInfo.tier);
  }, [output, tierInfo.tier]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setStats(null);
    setError(null);
  }, []);

  // Toggle category
  const toggleCategory = useCallback((category) => {
    setSelectedCategories(prev => {
      if (category === 'all') {
        return ['all'];
      }
      
      const newCategories = prev.filter(c => c !== 'all');
      
      if (newCategories.includes(category)) {
        const filtered = newCategories.filter(c => c !== category);
        return filtered.length === 0 ? ['all'] : filtered;
      } else {
        return [...newCategories, category];
      }
    });
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
      {/* Usage indicator */}
      <div className="mb-6 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              usageStats.percentUsed >= 90 
                ? 'bg-red-100 dark:bg-red-900/30' 
                : 'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              <Shield className={`w-5 h-5 ${
                usageStats.percentUsed >= 90 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-blue-600 dark:text-blue-400'
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {tierInfo.name} Plan
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {usageStats.remaining} of {usageStats.limit} sanitizations remaining
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex-1 max-w-xs">
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  usageStats.percentUsed >= 90 
                    ? 'bg-red-500' 
                    : usageStats.percentUsed >= 70 
                      ? 'bg-amber-500' 
                      : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(usageStats.percentUsed, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
              Resets {usageStats.resetDate?.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3 animate-fade-in-up">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
            {!canSanitize && (
              <a 
                href="/pricing" 
                className="text-sm text-red-600 dark:text-red-400 hover:underline mt-1 inline-block"
              >
                Upgrade your plan &rarr;
              </a>
            )}
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Pattern Categories</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategories.includes('all')
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Patterns
          </button>
          {Object.entries(PATTERN_CATEGORIES).map(([key, category]) => (
            <button
              key={key}
              onClick={() => toggleCategory(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                selectedCategories.includes(key) && !selectedCategories.includes('all')
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {category.icon && <category.icon className="w-4 h-4" />}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main editor area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Input Log
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".txt,.log,.json,.xml,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200">
                  <Upload className="w-4 h-4" />
                  Upload
                </span>
              </label>
              {input && (
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  title="Clear"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder="Paste your log content here...

Example:
{
  &quot;api_key&quot;: &quot;sk_live_abc123xyz&quot;,
  &quot;email&quot;: &quot;john@example.com&quot;,
  &quot;password&quot;: &quot;secret123&quot;
}"
            className="w-full h-80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{input.length.toLocaleString()} characters</span>
            <span>Max: {(tierInfo.charLimit || 5000).toLocaleString()} chars</span>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              Sanitized Output
            </label>
            {output && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPreview ? 'Raw' : 'Preview'}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className={`p-1.5 rounded-lg transition-colors duration-200 ${
                    copied 
                      ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                      : 'text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                  title={copied ? 'Copied!' : 'Copy'}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              placeholder="Sanitized output will appear here..."
              className="w-full h-80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 font-mono text-sm resize-none focus:outline-none"
            />
            {!output && !isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-slate-400">
                  <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Your sanitized log will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sanitize button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSanitize}
          disabled={!input.trim() || isProcessing || !canSanitize}
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 disabled:hover:translate-y-0"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Sanitize Now
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mt-8 p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-fade-in-up">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            Sanitization Complete
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalReplacements}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Secrets Found</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.patternsMatched}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Patterns Matched</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.processingTime}ms
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Processing Time</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats.sensitivityScore}%
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sensitivity Score</p>
            </div>
          </div>

          {/* Pattern breakdown */}
          {stats.patternBreakdown && Object.keys(stats.patternBreakdown).length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Detected patterns:
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.patternBreakdown).map(([pattern, count]) => (
                  <span 
                    key={pattern}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium"
                  >
                    {pattern}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pro tip */}
      <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Pro tip:</strong> Your data never leaves your browser. All sanitization happens locally on your device.
          </p>
        </div>
      </div>
    </div>
  );
}
