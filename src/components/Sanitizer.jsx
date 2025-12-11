// src/components/Sanitizer.jsx
import { useState, useEffect, useCallback } from 'react';
import { 
  Wand2, Copy, Download, AlertCircle, Check, 
  FileText, Zap, BarChart3, Settings, X, Upload,
  Sparkles, Timer, Shield, RefreshCw
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
  const [dragOver, setDragOver] = useState(false);

  const tierInfo = licenseManager.getTierInfo();
  const usageStats = licenseManager.getUsageStats();
  const patterns = getPatternsByTier(license?.tier || 'free');
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

  // Keyboard shortcut: Ctrl/Cmd + Enter to sanitize
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSanitize();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputText, isOverLimit, isOverUsage]);

  const handleSanitize = useCallback(() => {
    // Validation
    if (!inputText.trim()) {
      setError('Please enter some text to sanitize');
      return;
    }

    if (isOverLimit) {
      setError(`Text exceeds ${charLimit.toLocaleString()} character limit. Please upgrade or reduce text.`);
      return;
    }

    if (isOverUsage) {
      setError('Monthly usage limit reached. Please upgrade to continue.');
      return;
    }

    setError('');
    setProcessing(true);

    // Use requestAnimationFrame for smoother UI
    requestAnimationFrame(() => {
      setTimeout(() => {
        const sanitizer = new SanitizerLib(filteredPatterns, {
          detectEntropy: tierInfo.features?.entropy || false,
          showStats: true
        });

        const result = sanitizer.sanitize(inputText);
        
        if (result.success) {
          setOutputText(result.sanitized);
          setStats(result.stats);
          setShowStats(true);
          onSanitizeComplete?.(result.stats);
        } else {
          setError(result.error || 'Sanitization failed');
        }

        setProcessing(false);
      }, 300); // Small delay for UX feedback
    });
  }, [inputText, filteredPatterns, tierInfo, charLimit, isOverLimit, isOverUsage, onSanitizeComplete]);

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
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sanitized-log-${Date.now()}.${format}`;
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
        setOutputText('');
        setStats(null);
      }
    };
    reader.readAsText(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'text/plain' || file.name.endsWith('.log') || file.name.endsWith('.txt') || file.name.endsWith('.json'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          setInputText(text);
          setOutputText('');
          setStats(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setStats(null);
    setError('');
    setShowStats(false);
  };

  const usagePercentage = usageStats.limit === Infinity 
    ? 0 
    : Math.min((usageStats.used / usageStats.limit) * 100, 100);

  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              Log Sanitizer
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Remove sensitive data from your logs securely • 100% client-side
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
              <Zap className="h-3 w-3 mr-1" />
              {(license?.tier || 'free').toUpperCase()}
            </Badge>
            
            {license?.tier === 'free' && (
              <Button onClick={onUpgrade} size="sm" variant="outline">
                Upgrade for More
              </Button>
            )}
          </div>
        </div>

        {/* Usage Stats */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 animate-slide-up animation-delay-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Usage This Month
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {usageStats.used} / {usageStats.limit === Infinity ? '∞' : usageStats.limit}
                  </span>
                </div>
                {usageStats.limit !== Infinity && (
                  <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        usagePercentage > 80 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Timer className="h-4 w-4" />
              Resets {usageStats.resetDate.toLocaleDateString()}
            </div>
          </div>
        </Card>

        {/* Error Alert */}
        {error && (
          <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
              <button 
                onClick={() => setError('')} 
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </Card>
        )}

        {/* Pattern Category Selector */}
        <Card className="p-4 animate-slide-up animation-delay-200">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-white">Detection Categories</span>
            <Badge className="ml-2">{filteredPatterns.length} patterns</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {PATTERN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }
                `}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Main Editor Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card 
            className={`p-6 space-y-4 animate-slide-up animation-delay-300 transition-all duration-200 ${
              dragOver ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Input</h2>
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
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your logs here or drag & drop a file..."
                className="textarea h-96"
              />
              {dragOver && (
                <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-500">
                  <p className="text-blue-600 dark:text-blue-400 font-medium">Drop file here</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className={`${isOverLimit ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                {charCount.toLocaleString()} / {charLimit === Infinity ? '∞' : charLimit.toLocaleString()} characters
              </span>
              
              <Button
                onClick={handleSanitize}
                disabled={processing || isOverLimit || isOverUsage || !inputText.trim()}
                className="btn-primary px-6"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Sanitize Now
                    <span className="hidden sm:inline ml-2 text-xs opacity-70">⌘↵</span>
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Output */}
          <Card className="p-6 space-y-4 animate-slide-up animation-delay-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Output</h2>
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
                      <Check className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
                
                {tierInfo.features?.export && (
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
              className="textarea h-96 bg-gray-50 dark:bg-slate-800/50"
            />

            {stats && showStats && (
              <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
                    <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-green-900 dark:text-green-300">
                      Sanitization Complete!
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-green-800 dark:text-green-400">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span><strong>{stats.totalReplacements}</strong> items redacted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        <span><strong>{stats.processingTime}ms</strong> processing</span>
                      </div>
                    </div>
                    
                    {stats.matches.length > 0 && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-medium text-green-900 dark:text-green-300 hover:text-green-700 dark:hover:text-green-400">
                          View detailed breakdown
                        </summary>
                        <div className="mt-2 space-y-1 text-sm text-green-700 dark:text-green-400">
                          {stats.matches.map((match, i) => (
                            <div key={i} className="flex justify-between items-center py-1 border-b border-green-200 dark:border-green-800 last:border-0">
                              <span>{match.pattern}</span>
                              <Badge className="bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-300">
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
        {license?.tier === 'free' && (
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden relative animate-slide-up animation-delay-500">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                  <Sparkles className="h-6 w-6" />
                  Unlock Advanced Features
                </h3>
                <p className="text-blue-100">
                  Get unlimited sanitization, 70+ patterns, AI entropy detection, and more
                </p>
              </div>
              
              <Button
                onClick={onUpgrade}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-lg hover:shadow-xl transition-all duration-200"
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
