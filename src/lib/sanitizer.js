// src/lib/sanitizer.js - FIXED VERSION
import { detectHighEntropy } from './patterns';

export class Sanitizer {
  constructor(patterns = [], options = {}) {
    this.patterns = patterns;
    this.options = {
      detectEntropy: options.detectEntropy || false,
      preserveFormatting: options.preserveFormatting !== false,
      showStats: options.showStats !== false,
      ...options
    };
    this.stats = {
      matches: [],
      totalReplacements: 0,
      entropyDetections: [],
      processingTime: 0
    };
  }

  sanitize(text) {
    const startTime = performance.now();
    
    if (!text || typeof text !== 'string') {
      return {
        sanitized: '',
        stats: this.stats,
        success: false,
        error: 'Invalid input'
      };
    }

    let sanitized = text;
    this.stats.matches = [];
    this.stats.totalReplacements = 0;

    // Apply all patterns
    this.patterns.forEach(pattern => {
      try {
        const matches = this.countMatches(sanitized, pattern);
        if (matches > 0) {
          this.stats.matches.push({
            pattern: pattern.name,
            count: matches,
            category: pattern.category
          });
          this.stats.totalReplacements += matches;
          
          // Create new regex to ensure fresh state
          const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
          sanitized = sanitized.replace(regex, pattern.replacement);
        }
      } catch (err) {
        console.warn(`Pattern ${pattern.name} failed:`, err.message);
      }
    });

    // Detect high entropy strings (AI-based detection)
    if (this.options.detectEntropy) {
      try {
        this.stats.entropyDetections = detectHighEntropy(sanitized);
        this.stats.entropyDetections.forEach(detection => {
          // Escape special regex characters in the detected text
          const escapedText = detection.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const entropyRegex = new RegExp(escapedText, 'g');
          sanitized = sanitized.replace(
            entropyRegex,
            `[HIGH_ENTROPY_REDACTED]`
          );
          this.stats.totalReplacements++;
        });
      } catch (err) {
        console.warn('Entropy detection failed:', err.message);
      }
    }

    this.stats.processingTime = (performance.now() - startTime).toFixed(2);

    return {
      sanitized,
      stats: this.stats,
      success: true
    };
  }

  // FIXED: Menggunakan match() instead of exec() untuk menghindari infinite loop
  countMatches(text, pattern) {
    try {
      // Create new regex with global flag for counting
      const flags = pattern.pattern.flags.includes('g') 
        ? pattern.pattern.flags 
        : pattern.pattern.flags + 'g';
      const regex = new RegExp(pattern.pattern.source, flags);
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    } catch (err) {
      return 0;
    }
  }

  // Batch processing for multiple files
  sanitizeBatch(texts) {
    return texts.map(text => this.sanitize(text));
  }

  // Export sanitized content
  exportAs(sanitized, format = 'text') {
    switch (format) {
      case 'json':
        return JSON.stringify({
          sanitized,
          stats: this.stats,
          timestamp: new Date().toISOString()
        }, null, 2);
      
      case 'csv':
        return this.toCsv(sanitized);
      
      case 'markdown':
        return this.toMarkdown(sanitized);
      
      default:
        return sanitized;
    }
  }

  toCsv(sanitized) {
    let csv = 'Type,Count,Category\n';
    this.stats.matches.forEach(match => {
      csv += `"${match.pattern}",${match.count},"${match.category}"\n`;
    });
    csv += '\n--- Sanitized Content ---\n';
    csv += sanitized.replace(/"/g, '""');
    return csv;
  }

  toMarkdown(sanitized) {
    let md = '# Sanitization Report\n\n';
    md += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
    md += `**Processing Time:** ${this.stats.processingTime}ms\n\n`;
    md += `**Total Replacements:** ${this.stats.totalReplacements}\n\n`;
    
    if (this.stats.matches.length > 0) {
      md += '## Detected Patterns\n\n';
      md += '| Pattern | Count | Category |\n';
      md += '|---------|-------|----------|\n';
      this.stats.matches.forEach(match => {
        md += `| ${match.pattern} | ${match.count} | ${match.category} |\n`;
      });
      md += '\n';
    }

    if (this.stats.entropyDetections && this.stats.entropyDetections.length > 0) {
      md += '## High Entropy Detections\n\n';
      md += '| String (truncated) | Entropy Score |\n';
      md += '|-------------------|---------------|\n';
      this.stats.entropyDetections.forEach(detection => {
        const truncated = detection.text.length > 20 
          ? detection.text.substring(0, 20) + '...' 
          : detection.text;
        md += `| \`${truncated}\` | ${detection.entropy} |\n`;
      });
      md += '\n';
    }

    md += '## Sanitized Content\n\n';
    md += '```\n';
    md += sanitized;
    md += '\n```\n';

    return md;
  }

  // Reset stats
  reset() {
    this.stats = {
      matches: [],
      totalReplacements: 0,
      entropyDetections: [],
      processingTime: 0
    };
  }
}

// Utility function for quick sanitization
export function quickSanitize(text, patterns) {
  const sanitizer = new Sanitizer(patterns);
  return sanitizer.sanitize(text);
}

// Check if text contains sensitive data
export function hasSensitiveData(text, patterns) {
  return patterns.some(pattern => {
    try {
      return pattern.pattern.test(text);
    } catch {
      return false;
    }
  });
}

// Get sanitization preview
export function getPreview(text, patterns, maxLength = 100) {
  const previews = [];
  
  patterns.forEach(pattern => {
    try {
      const matches = text.match(pattern.pattern);
      if (matches) {
        matches.slice(0, 3).forEach(match => { // Limit to 3 previews per pattern
          const start = Math.max(0, text.indexOf(match) - 20);
          const end = Math.min(text.length, text.indexOf(match) + match.length + 20);
          previews.push({
            pattern: pattern.name,
            preview: '...' + text.substring(start, end) + '...',
            match: match.length > 50 ? match.substring(0, 50) + '...' : match
          });
        });
      }
    } catch {
      // Skip invalid patterns
    }
  });

  return previews;
}
