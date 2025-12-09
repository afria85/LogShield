// src/components/Sanitizer.jsx
import { useState, useEffect } from 'react';
import { 
  Wand2, Copy, Download, AlertCircle, Check, 
  FileText, Zap, BarChart3, Settings, X, Upload
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Sanitizer as SanitizerLib } from '../lib/sanitizer';
import { getPatternsByTier, PATTERN_CATEGORIES, filterPatternsByCategory } from '../lib/patterns';
import { licenseManager } from '../lib/license';

export default function Sanitizer({ license, onUpgrade, onSanitizeComplete }) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [stats, setStats] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showStats, setShowStats] = useState(false);
  const [error, setError] = useState('');

  const tierInfo = licenseManager.getTierInfo();
  const usageStats = licenseManager.getUsageStats();
  const patterns = getPatternsByTier(license.tier);
  const filteredPatterns = filterPatternsByCategory(patterns, selectedCategory);

  // Check limits
  const charCount = inputText.length;
  const charLimit = tierInfo.charLimit;
  const isOverLimit = charLimit !== Infinity && charCount > charLimit;
  const isOverUsage = usageStats.used >= usageStats.limit && usageStats.limit !== Infinity;

  useEffect(() => {
    // Load sample text for demo
    const sampleText = `API Response:
{
  "user": "john.doe@company.com",
  "api_key": "AKIAIOSFODNN7EXAMPLE",
  "database": "mongodb://admin:password123@localhost:27017",
  "stripe_key": "sk_live_4eC39HqLyjWDarjtT1zdp7dc"
}

Server logs:
[2024-01-15] User 192.168.1.100 accessed dashboard
[2024-01-15] JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
    
    setInputText(sampleText);
  }, []);

  const handleSanitize = () => {
    // Validation
    if (!inputText.trim()) {
      setError('Please enter some text to sanitize');
      return;
    }

    if (isOverLimit) {
      setError(`Text exceeds ${charLimit} character limit. Please upgrade or reduce text.`);
      return;
    }

    if (isOverUsage) {
      setError('Monthly usage limit reached. Please upgrade to continue.');
      return;
    }

    setError('');
    setProcessing(true);

    // Simulate processing delay for UX
    setTimeout(() => {
      const sanitizer = new SanitizerLib(filteredPatterns, {
        detectEntropy: tierInfo.features.entropy,
        showStats: true
      });

      const result = sanitizer.sanitize(inputText);
      
      if (result.success) {
        setOutputText(result.sanitized);
        setStats(result.stats);
        setShowStats(true);
        onSanitizeComplete(result.stats);
      } else {
        setError(result.error || 'Sanitization failed');
      }

      setProcessing(false);
    }, 500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      if (window.plausible) {
        window.plausible('Copy Output');
      }
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleDownload = (format = 'txt') => {
    const sanitizer = new SanitizerLib(filteredPatterns);
    const content = sanitizer.exportAs(outputText, format);
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sanitized-log.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.plausible) {
      window.plausible('Download', { props: { format } });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setInputText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setStats(null);
    setError('');
  };

  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Log Sanitizer</h1>
            <p className="text-gray-600 mt-1">
              Remove sensitive data from your logs securely
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800">
              <Zap className="h-3 w-3 mr-1" />
              {license.tier.toUpperCase()}
            </Badge>
            
            {license.tier === 'free' && (
              <Button onClick={onUpgrade} size="sm" variant="outline">
                Upgrade for More
              </Button>
            )}
          </div>
        </div>

        {/* Usage Stats */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Usage This Month: {usageStats.used} / {usageStats.limit === Infinity ? '∞' : usageStats.limit}
                </div>
                <div className="text-xs text-gray-600">
                  {usageStats.remaining === Infinity ? 'Unlimited' : `${usageStats.remaining} remaining`}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Resets on {usageStats.resetDate.toLocaleDateString()}
            </div>
          </div>
        </Card>

        {/* Error Alert */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                <X className="h-5 w-5" />
              </button>
            </div>
          </Card>
        )}

        {/* Pattern Category Selector */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Detection Categories</span>
            <Badge>{filteredPatterns.length} patterns active</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {PATTERN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Main Editor Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                <h2 className="font-semibold text-gray-900">Input</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".txt,.log,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button size="sm" variant="outline" as="span">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </label>
                
                <Button onClick={handleClear} size="sm" variant="outline">
                  Clear
                </Button>
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your logs here..."
              className="w-full h-96 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            <div className="flex items-center justify-between text-sm">
              <span className={`${isOverLimit ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                {charCount.toLocaleString()} / {charLimit === Infinity ? '∞' : charLimit.toLocaleString()} characters
              </span>
              
              <Button
                onClick={handleSanitize}
                disabled={processing || isOverLimit || isOverUsage || !inputText.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Sanitize Now
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Output */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <h2 className="font-semibold text-gray-900">Output</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopy}
                  disabled={!outputText}
                  size="sm"
                  variant="outline"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
                
                {tierInfo.features.export && (
                  <Button
                    onClick={() => handleDownload('txt')}
                    disabled={!outputText}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            </div>

            <textarea
              value={outputText}
              readOnly
              placeholder="Sanitized output will appear here..."
              className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg resize-none"
            />

            {stats && showStats && (
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-green-900">
                      Sanitization Complete!
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-green-800">
                      <div>
                        <span className="font-medium">{stats.totalReplacements}</span> patterns matched
                      </div>
                      <div>
                        <span className="font-medium">{stats.processingTime}ms</span> processing time
                      </div>
                    </div>
                    
                    {stats.matches.length > 0 && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-medium text-green-900 hover:text-green-700">
                          View Details
                        </summary>
                        <div className="mt-2 space-y-1 text-sm text-green-700">
                          {stats.matches.map((match, i) => (
                            <div key={i} className="flex justify-between">
                              <span>{match.pattern}</span>
                              <Badge className="bg-green-100 text-green-800">
                                {match.count}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </Card>
        </div>

        {/* Upgrade CTA */}
        {license.tier === 'free' && (
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  Unlock Advanced Features
                </h3>
                <p className="text-blue-100">
                  Get unlimited sanitization, 70+ patterns, AI detection, and more
                </p>
              </div>
              
              <Button
                onClick={onUpgrade}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 font-bold shadow-lg"
              >
                View Plans
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}