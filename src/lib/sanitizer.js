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
        error: 'Invalid input'
      };
    }

    let sanitized = text;
    this.stats.matches = [];
    this.stats.totalReplacements = 0;

    // Apply all patterns
    this.patterns.forEach(pattern => {
      const matches = this.findMatches(sanitized, pattern);
      if (matches.length > 0) {
        this.stats.matches.push({
          pattern: pattern.name,
          count: matches.length,
          category: pattern.category
        });
        this.stats.totalReplacements += matches.length;
        sanitized = sanitized.replace(pattern.pattern, pattern.replacement);
      }
    });

    // Detect high entropy strings (AI-based detection)
    if (this.options.detectEntropy) {
      this.stats.entropyDetections = detectHighEntropy(sanitized);
      this.stats.entropyDetections.forEach(detection => {
        sanitized = sanitized.replace(
          detection.text,
          `[HIGH_ENTROPY_${detection.entropy}_REDACTED]`
        );
        this.stats.totalReplacements++;
      });
    }

    this.stats.processingTime = (performance.now() - startTime).toFixed(2);

    return {
      sanitized,
      stats: this.stats,
      success: true
    };
  }

  findMatches(text, pattern) {
    const matches = [];
    let match;
    const regex = new RegExp(pattern.pattern);
    
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        text: match[0],
        index: match.index
      });
      if (!regex.global) break;
    }
    
    return matches;
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
    let csv = 'Type,Count\n';
    this.stats.matches.forEach(match => {
      csv += `${match.pattern},${match.count}\n`;
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
      md += '| String | Entropy Score |\n';
      md += '|--------|---------------|\n';
      this.stats.entropyDetections.forEach(detection => {
        md += `| ${detection.text.substring(0, 20)}... | ${detection.entropy} |\n`;
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
  return patterns.some(pattern => pattern.pattern.test(text));
}

// Get sanitization preview (first 100 chars of each match)
export function getPreview(text, patterns, maxLength = 100) {
  const previews = [];
  
  patterns.forEach(pattern => {
    const matches = text.match(pattern.pattern);
    if (matches) {
      matches.forEach(match => {
        const start = Math.max(0, text.indexOf(match) - 20);
        const end = Math.min(text.length, text.indexOf(match) + match.length + 20);
        previews.push({
          pattern: pattern.name,
          preview: '...' + text.substring(start, end) + '...',
          match: match
        });
      });
    }
  });

  return previews;
}
