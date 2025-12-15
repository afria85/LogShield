use regex::Regex;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Action {
    Redact,
    WarnOnly,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Severity {
    Low,
    Medium,
    High,
    Critical,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Rule {
    pub id: String,
    pub pattern: String,
    pub action: Action,
    pub severity: Severity,
}

#[derive(Debug, Clone)]
struct CompiledRule {
    rule: Rule,
    regex: Regex,
}

#[derive(Debug, Serialize)]
pub struct Finding {
    pub rule_id: String,
    pub start: usize,
    pub end: usize,
    pub action: Action,
    pub severity: Severity,
}

#[derive(Debug, Serialize)]
pub struct ScanResult {
    pub findings: Vec<Finding>,
    pub redacted_text: String,
}

pub fn compile_rules(rules: &[Rule]) -> Result<Vec<CompiledRule>, String> {
    rules
        .iter()
        .map(|r| {
            Regex::new(&r.pattern)
                .map(|regex| CompiledRule {
                    rule: r.clone(),
                    regex,
                })
                .map_err(|e| format!("Invalid pattern {}: {}", r.id, e))
        })
        .collect()
}

pub fn scan_text(input: &str, rules: &[CompiledRule]) -> ScanResult {
    let mut findings = Vec::new();
    let mut output = input.to_string();

    for rule in rules {
        for m in rule.regex.find_iter(input) {
            findings.push(Finding {
                rule_id: rule.rule.id.clone(),
                start: m.start(),
                end: m.end(),
                action: rule.rule.action.clone(),
                severity: rule.rule.severity.clone(),
            });

            if matches!(rule.rule.action, Action::Redact) {
                output = output.replace(m.as_str(), "[REDACTED]");
            }
        }
    }

    ScanResult {
        findings,
        redacted_text: output,
    }
}
