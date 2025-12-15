
use regex::Regex;
use serde::{Deserialize, Serialize};

#[derive(Debug)]
pub enum LogShieldError {
    InvalidPattern { rule_id: String, message: String },
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Action {
    REDACT,
    WARN_ONLY,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Ord, PartialOrd, Eq)]
pub enum Severity {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RuleConfig {
    pub id: String,
    pub pattern: String,
    pub action: Action,
    pub severity: Severity,
}

#[derive(Debug, Clone)]
pub struct Rule {
    pub id: String,
    pub matcher: Regex,
    pub action: Action,
    pub severity: Severity,
}

#[derive(Debug, Clone, Serialize)]
pub struct Finding {
    pub rule_id: String,
    pub start: usize,
    pub end: usize,
    pub severity: Severity,
    pub action: Action,
}

#[derive(Debug, Clone, Serialize)]
pub struct ScanResult {
    pub findings: Vec<Finding>,
    pub redacted_text: String,
}

pub fn compile_rules(configs: Vec<RuleConfig>) -> Result<Vec<Rule>, LogShieldError> {
    configs.into_iter().map(|cfg| {
        let matcher = Regex::new(&cfg.pattern)
            .map_err(|e| LogShieldError::InvalidPattern {
                rule_id: cfg.id.clone(),
                message: e.to_string(),
            })?;

        Ok(Rule {
            id: cfg.id,
            matcher,
            action: cfg.action,
            severity: cfg.severity,
        })
    }).collect()
}

pub fn scan_text(input: &str, rules: &[Rule]) -> ScanResult {
    let mut findings = Vec::new();
    let mut redacted = input.to_string();

    for rule in rules {
        for m in rule.matcher.find_iter(input) {
            findings.push(Finding {
                rule_id: rule.id.clone(),
                start: m.start(),
                end: m.end(),
                severity: rule.severity.clone(),
                action: rule.action.clone(),
            });

            if rule.action == Action::REDACT {
                redacted = redacted.replace(&input[m.start()..m.end()], "[REDACTED]");
            }
        }
    }

    ScanResult { findings, redacted_text: redacted }
}

pub fn highest_severity(findings: &[Finding]) -> Option<Severity> {
    findings.iter().map(|f| &f.severity).max().cloned()
}
