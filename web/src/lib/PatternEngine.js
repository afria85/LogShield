// src/lib/PatternEngine.js
class PatternEngine {
    constructor() {
        this.patterns = new Map();
        this.categories = new Set();
        this.compiledRegexCache = new Map();
        this.initPatterns();
    }

    initPatterns() {
        // Load dari config atau default
        const defaultPatterns = [
            {
                id: 'email',
                name: 'Email Address',
                pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
                category: 'PII',
                severity: 'high',
                description: 'Detects email addresses',
                replacement: '[EMAIL_REDACTED]',
                enabled: true
            },
            // ... tambahkan 70+ pola lainnya
        ];

        defaultPatterns.forEach(p => this.addPattern(p));
    }

    addPattern(pattern) {
        const id = pattern.id || `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.patterns.set(id, { ...pattern, id });
        this.categories.add(pattern.category);
        
        // Pre-compile regex untuk performa
        try {
            const regex = new RegExp(pattern.pattern, pattern.flags || 'gi');
            this.compiledRegexCache.set(id, regex);
        } catch (e) {
            console.warn(`Invalid regex for pattern ${id}:`, e);
        }
    }

    scan(text, options = {}) {
        const { enabledOnly = true, categories = [] } = options;
        const matches = [];
        const processedText = text;
        
        for (const [id, pattern] of this.patterns) {
            if (enabledOnly && !pattern.enabled) continue;
            if (categories.length > 0 && !categories.includes(pattern.category)) continue;
            
            const regex = this.compiledRegexCache.get(id);
            if (!regex) continue;
            
            regex.lastIndex = 0; // Reset state regex global
            let match;
            while ((match = regex.exec(text)) !== null) {
                matches.push({
                    id,
                    patternName: pattern.name,
                    matchedText: match[0],
                    startIndex: match.index,
                    endIndex: match.index + match[0].length,
                    category: pattern.category,
                    severity: pattern.severity,
                    replacement: pattern.replacement || `[${pattern.category}_REDACTED]`
                });
            }
        }
        
        // Sort by position in text
        matches.sort((a, b) => a.startIndex - b.startIndex);
        
        // Sanitize text (replace matches from end to start to preserve indices)
        let sanitized = text;
        for (let i = matches.length - 1; i >= 0; i--) {
            const m = matches[i];
            sanitized = sanitized.substring(0, m.startIndex) + 
                       m.replacement + 
                       sanitized.substring(m.endIndex);
        }
        
        return {
            matches,
            sanitizedText: sanitized,
            stats: {
                totalMatches: matches.length,
                byCategory: this.groupByCategory(matches),
                riskLevel: this.calculateRiskLevel(matches)
            }
        };
    }

    // Helper methods
    groupByCategory(matches) {
        return matches.reduce((acc, match) => {
            acc[match.category] = (acc[match.category] || 0) + 1;
            return acc;
        }, {});
    }

    calculateRiskLevel(matches) {
        const highSeverity = matches.filter(m => m.severity === 'high').length;
        if (highSeverity > 5) return 'CRITICAL';
        if (highSeverity > 2) return 'HIGH';
        if (matches.length > 10) return 'MEDIUM';
        return 'LOW';
    }

    // Export/Import patterns
    exportPatterns() {
        return Array.from(this.patterns.values());
    }

    importPatterns(patternArray) {
        this.patterns.clear();
        this.compiledRegexCache.clear();
        patternArray.forEach(p => this.addPattern(p));
    }
}

// FILE LAMA: src/patterns.js (DIUBAH SEDIKIT untuk kompatibilitas)
import PatternEngine from './lib/PatternEngine.js';

// Buat instance untuk backward compatibility
const engine = new PatternEngine();

// Ekspor fungsi lama yang masih digunakan
export function scan(text) {
  const result = engine.scan(text);
  return result.matches; // Format yang sama dengan sebelumnya
}

// Ekspor pola untuk komponen yang masih menggunakan
export const patterns = Object.fromEntries(
  engine.exportPatterns().map(p => [p.id, p])
);

// Ekspor juga engine baru untuk penggunaan masa depan
export { engine, PatternEngine };