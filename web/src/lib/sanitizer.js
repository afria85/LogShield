// src/lib/sanitizer.js
// Core sanitization engine with security improvements and performance optimizations

import { detectHighEntropy } from './patterns';

// ============================================
// CONSTANTS
// ============================================
const MAX_INPUT_SIZE = 10 * 1024 * 1024; // 10MB max input
const MAX_PATTERN_MATCHES = 10000; // Prevent DoS via regex
const PROCESSING_TIMEOUT = 30000; // 30 second timeout

// ============================================
// INPUT VALIDATION
// ============================================

/**
 * Validate and sanitize input before processing
 */
function validateInput(text) {
  if (text === null || text === undefined) {
    return { valid: false, error: 'Input is null or undefined', sanitized: '' };
  }

  if (typeof text !== 'string') {
    return { valid: false, error: 'Input must be a string', sanitized: '' };
  }

  if (text.length === 0) {
    return { valid: false, error: 'Input is empty', sanitized: '' };
  }

  if (text.length > MAX_INPUT_SIZE) {
    return { 
      valid: false, 
      error: `Input exceeds maximum size of ${(MAX_INPUT_SIZE / 1024 / 1024).toFixed(0)}MB`,
      sanitized: '' 
    };
  }

  return { valid: true, error: null, sanitized: text };
}

/**
 * Escape HTML to prevent XSS when displaying results
 */
export function escapeHtml(text) {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, char => htmlEntities[char]);
}

// ============================================
// SANITIZER CLASS
// ============================================

export class Sanitizer {
  constructor(patterns = [], options = {}) {
    this.patterns = this.validatePatterns(patterns);
    this.options = {
      detectEntropy: options.detectEntropy ?? false,
      entropyThreshold: options.entropyThreshold ?? 4.5,
      preserveFormatting: options.preserveFormatting ?? true,
      showStats: options.showStats ?? true,
      maxMatches: options.maxMatches ?? MAX_PATTERN_MATCHES,
      timeout: options.timeout ?? PROCESSING_TIMEOUT,
      ...options
    };
    
    this.stats = this.createEmptyStats();
    this.abortController = null;
  }

  /**
   * Validate patterns array
   */
  validatePatterns(patterns) {
    if (!Array.isArray(patterns)) {
      console.warn('Patterns must be an array, using empty array');
      return [];
    }

    return patterns.filter(pattern => {
      if (!pattern || typeof pattern !== 'object') return false;
      if (!pattern.pattern || !(pattern.pattern instanceof RegExp)) {
        console.warn(`Invalid pattern: ${pattern?.name || 'unknown'}`);
        return false;
      }
      return true;
    });
  }

  /**
   * Create empty stats object
   */
  createEmptyStats() {
    return {
      matches: [],
      totalReplacements: 0,
      entropyDetections: [],
      processingTime: 0,
      inputLength: 0,
      outputLength: 0,
      patternsApplied: 0
    };
  }

  /**
   * Main sanitization method
   */
  sanitize(text) {
    const startTime = performance.now();
    this.stats = this.createEmptyStats();

    // Validate input
    const validation = validateInput(text);
    if (!validation.valid) {
      return {
        sanitized: '',
        stats: this.stats,
        success: false,
        error: validation.error
      };
    }

    this.stats.inputLength = text.length;
    let sanitized = text;
    let totalMatches = 0;

    try {
      // Apply all patterns
      for (const pattern of this.patterns) {
        if (totalMatches >= this.options.maxMatches) {
          console.warn('Max matches limit reached, stopping pattern matching');
          break;
        }

        const result = this.applyPattern(sanitized, pattern);
        if (result.count > 0) {
          this.stats.matches.push({
            pattern: pattern.name,
            count: result.count,
            category: pattern.category,
            severity: pattern.severity,
            confidence: pattern.confidence
          });
          this.stats.totalReplacements += result.count;
          sanitized = result.text;
          totalMatches += result.count;
        }
      }

      this.stats.patternsApplied = this.patterns.length;

      // Detect high entropy strings if enabled
      if (this.options.detectEntropy) {
        const entropyResult = this.applyEntropyDetection(sanitized);
        sanitized = entropyResult.text;
        this.stats.entropyDetections = entropyResult.detections;
        this.stats.totalReplacements += entropyResult.count;
      }

      this.stats.outputLength = sanitized.length;
      this.stats.processingTime = (performance.now() - startTime).toFixed(2);

      return {
        sanitized,
        stats: this.stats,
        success: true,
        error: null
      };

    } catch (error) {
      console.error('Sanitization error:', error);
      this.stats.processingTime = (performance.now() - startTime).toFixed(2);
      
      return {
        sanitized: text, // Return original on error
        stats: this.stats,
        success: false,
        error: error.message || 'Unknown sanitization error'
      };
    }
  }

  /**
   * Apply a single pattern to text
   */
  applyPattern(text, pattern) {
    try {
      // Create fresh regex instance to reset lastIndex
      const flags = pattern.pattern.flags.includes('g') 
        ? pattern.pattern.flags 
        : pattern.pattern.flags + 'g';
      const regex = new RegExp(pattern.pattern.source, flags);
      
      // Count matches first
      const matches = text.match(regex);
      const count = matches ? matches.length : 0;
      
      if (count === 0) {
        return { text, count: 0 };
      }

      // Apply replacement
      const sanitizedText = text.replace(regex, pattern.replacement);
      
      return {
        text: sanitizedText,
        count
      };
    } catch (error) {
      console.warn(`Pattern ${pattern.name} failed:`, error.message);
      return { text, count: 0 };
    }
  }

  /**
   * Apply entropy-based detection
   */
  applyEntropyDetection(text) {
    try {
      const detections = detectHighEntropy(text, this.options.entropyThreshold);
      let sanitizedText = text;
      let count = 0;

      // Sort by position descending to replace from end to start
      detections.sort((a, b) => (b.position || 0) - (a.position || 0));

      for (const detection of detections) {
        // Escape special regex characters
        const escapedText = detection.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedText, 'g');
        
        if (regex.test(sanitizedText)) {
          sanitizedText = sanitizedText.replace(regex, '[HIGH_ENTROPY_REDACTED]');
          count++;
        }
      }

      return {
        text: sanitizedText,
        detections,
        count
      };
    } catch (error) {
      console.warn('Entropy detection failed:', error.message);
      return { text, detections: [], count: 0 };
    }
  }

  /**
   * Batch processing for multiple texts
   */
  sanitizeBatch(texts) {
    if (!Array.isArray(texts)) {
      return [{ success: false, error: 'Input must be an array' }];
    }

    return texts.map((text, index) => {
      const result = this.sanitize(text);
      return { ...result, index };
    });
  }

  /**
   * Get preview of what will be sanitized (without actually replacing)
   */
  preview(text, limit = 10) {
    const validation = validateInput(text);
    if (!validation.valid) {
      return { success: false, error: validation.error, previews: [] };
    }

    const previews = [];

    for (const pattern of this.patterns) {
      if (previews.length >= limit) break;

      try {
        const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
        const matches = text.match(regex);
        
        if (matches) {
          for (const match of matches.slice(0, 3)) {
            const index = text.indexOf(match);
            const start = Math.max(0, index - 20);
            const end = Math.min(text.length, index + match.length + 20);
            
            previews.push({
              pattern: pattern.name,
              category: pattern.category,
              severity: pattern.severity,
              match: match.length > 50 ? match.slice(0, 47) + '...' : match,
              context: '...' + text.slice(start, end) + '...',
              replacement: pattern.replacement
            });
          }
        }
      } catch {
        // Skip invalid patterns
      }
    }

    return {
      success: true,
      error: null,
      previews: previews.slice(0, limit)
    };
  }

  /**
   * Export sanitized content in various formats
   */
  exportAs(sanitized, format = 'text') {
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify({
          content: sanitized,
          stats: this.stats,
          timestamp: new Date().toISOString(),
          version: '3.0.0'
        }, null, 2);
      
      case 'csv':
        return this.toCsv(sanitized);
      
      case 'markdown':
      case 'md':
        return this.toMarkdown(sanitized);
      
      default:
        return sanitized;
    }
  }

  /**
   * Convert to CSV format
   */
  toCsv(sanitized) {
    const lines = [
      'Pattern,Count,Category,Severity',
      ...this.stats.matches.map(m => 
        `"${m.pattern}",${m.count},"${m.category}","${m.severity}"`
      ),
      '',
      '--- Sanitized Content ---',
      sanitized.replace(/"/g, '""')
    ];
    return lines.join('\n');
  }

  /**
   * Convert to Markdown format
   */
  toMarkdown(sanitized) {
    const lines = [
      '# LogShield Sanitization Report',
      '',
      `**Generated:** ${new Date().toLocaleString()}`,
      `**Processing Time:** ${this.stats.processingTime}ms`,
      `**Total Replacements:** ${this.stats.totalReplacements}`,
      `**Input Size:** ${this.stats.inputLength.toLocaleString()} characters`,
      `**Output Size:** ${this.stats.outputLength.toLocaleString()} characters`,
      ''
    ];

    if (this.stats.matches.length > 0) {
      lines.push('## Detected Patterns', '');
      lines.push('| Pattern | Count | Category | Severity |');
      lines.push('|---------|-------|----------|----------|');
      
      for (const match of this.stats.matches) {
        lines.push(`| ${match.pattern} | ${match.count} | ${match.category} | ${match.severity} |`);
      }
      lines.push('');
    }

    if (this.stats.entropyDetections?.length > 0) {
      lines.push('## High Entropy Detections', '');
      lines.push('| String (truncated) | Entropy | Confidence |');
      lines.push('|-------------------|---------|------------|');
      
      for (const detection of this.stats.entropyDetections) {
        const truncated = detection.text.length > 20 
          ? detection.text.slice(0, 17) + '...' 
          : detection.text;
        lines.push(`| \`${truncated}\` | ${detection.entropy} | ${detection.confidence} |`);
      }
      lines.push('');
    }

    lines.push('## Sanitized Content', '', '```', sanitized, '```');

    return lines.join('\n');
  }

  /**
   * Reset stats
   */
  reset() {
    this.stats = this.createEmptyStats();
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Quick sanitization without creating instance
 */
export function quickSanitize(text, patterns, options = {}) {
  const sanitizer = new Sanitizer(patterns, options);
  return sanitizer.sanitize(text);
}

/**
 * Check if text contains sensitive data
 */
export function hasSensitiveData(text, patterns) {
  if (!text || !patterns?.length) return false;
  
  return patterns.some(pattern => {
    try {
      // Create new regex to avoid lastIndex issues
      const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
      return regex.test(text);
    } catch {
      return false;
    }
  });
}

/**
 * Get sensitivity score (0-100)
 */
export function getSensitivityScore(text, patterns) {
  if (!text || !patterns?.length) return 0;
  
  let score = 0;
  const severityWeights = {
    critical: 25,
    high: 15,
    medium: 10,
    low: 5
  };

  for (const pattern of patterns) {
    try {
      const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
      const matches = text.match(regex);
      if (matches) {
        const weight = severityWeights[pattern.severity] || 5;
        score += matches.length * weight;
      }
    } catch {
      continue;
    }
  }

  return Math.min(100, score);
}

/**
 * Get preview of sensitive data locations
 */
export function getSensitiveDataPreview(text, patterns, maxPreviews = 5) {
  const previews = [];
  
  for (const pattern of patterns) {
    if (previews.length >= maxPreviews) break;
    
    try {
      const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
      let match;
      
      while ((match = regex.exec(text)) !== null && previews.length < maxPreviews) {
        const start = Math.max(0, match.index - 20);
        const end = Math.min(text.length, match.index + match[0].length + 20);
        
        previews.push({
          pattern: pattern.name,
          severity: pattern.severity,
          position: match.index,
          context: '...' + text.slice(start, end) + '...'
        });
        
        // Prevent infinite loop for patterns without global flag
        if (!regex.global) break;
      }
    } catch {
      continue;
    }
  }
  
  return previews;
}

// Fungsi baru untuk hitung stats sanitization (jika belum ada)
export function getSanitizationStats(sanitizedText, originalText, patterns) {
  const stats = {
    totalMatches: 0,
    patternBreakdown: {},
    sensitivityScore: getSensitivityScore(originalText, patterns), // Reuse fungsi existing
    processingTime: 0, // Bisa tambah timer jika perlu
  };

  // Hitung matches
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags + 'g');
    const matches = originalText.match(regex) || [];
    if (matches.length > 0) {
      stats.patternBreakdown[pattern.name] = matches.length;
      stats.totalMatches += matches.length;
    }
  }

  return stats;
}

export default Sanitizer;
