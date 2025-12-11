# ?? LogShield - Secure Log Sanitizer

**Enterprise-grade log sanitizer that processes data 100% in your browser.**

Remove API keys, tokens, credentials, emails, IP addresses, and PII from your logs ? securely and instantly.

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/afria85/LogShield)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/??-Try%20Live-8A2BE2.svg)](https://logshield.dev)

---

## ?? Try It Now

The fastest way to get started is to use the live web app. No installation needed.

**?? [Open LogShield Web App](https://logshield.dev)**

---

## ? Overview

LogShield is a **privacy-first developer tool** that helps you safely share logs and debug data by automatically removing sensitive information. All processing happens locally in your browser?**your data never leaves your computer.**

### Why Use LogShield?

- **?? Privacy by Design**: 100% client-side processing. We never see, store, or transmit your logs.
- **? Instant & Powerful**: Sanitize thousands of lines in milliseconds using 70+ built-in security patterns.
- **??? Comprehensive Detection**: Covers AWS, GCP, Azure, API keys, tokens, emails, PII, and more.
- **?? Built for Teams**: Supports custom patterns, batch processing, and multiple export formats.

---

## ?? Plans & Pricing

| Plan         | Price         | Best For                | Key Features                                                |
| :----------- | :------------ | :---------------------- | :---------------------------------------------------------- |
| **Free**     | $0 forever    | Trying it out           | 10,000 chars/session, 10 basic patterns                     |
| **Starter**  | $7/month      | Individual developers   | 50,000 chars/session, 50 uses/month, PDF/CSV export         |
| **Pro**      | $19/month     | Professional developers | Unlimited use, 70+ patterns, AI detection, batch processing |
| **Team**     | $79/month     | Teams & organizations   | 10 seats, shared library, REST API, SSO, usage analytics    |
| **Lifetime** | $199 one-time | Long-term value         | Everything in Team, lifetime access, all future updates     |

**All paid plans include a 14-day money-back guarantee.**

?? **View detailed feature comparison and upgrade: [https://logshield.dev/pricing](https://logshield.dev/pricing)**

---

## ??? For Developers: Run Locally

If you want to run the development version locally:

```bash
# 1. Clone the repository
git clone [https://github.com/afria85/LogShield.git](https://github.com/afria85/LogShield.git)
cd LogShield

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser and navigate to
# http://localhost:5173
```

Project Structure
LogShield/
ÃÄÄ src/
³ ÃÄÄ components/ # React components (UI)
³ ÃÄÄ lib/ # Core logic (sanitizer, patterns, license)
³ ÀÄÄ ...
ÃÄÄ public/ # Static assets & legal pages
ÀÄÄ ...
?? Planned Features
We're actively working on improving LogShield. Here's what's next:

CLI Tool: Run LogShield directly from your terminal.

VS Code Extension: Sanitize logs without leaving your editor.

GitHub Action: Automatically sanitize logs in your CI/CD pipelines.

Enhanced AI Detection: Improved pattern recognition for unknown secret formats.

Self-Hosted Version: Deploy LogShield within your private infrastructure.

Have a feature request? Open an issue on GitHub!

? Support
Community & Bugs: GitHub Issues

Email (General): hello@logshield.dev

Email (Paid Plans): support@logshield.dev

?? License
The core sanitization engine is open-source under the MIT License.

The full application, including the web interface and commercial features, requires a commercial license. See logshield.dev/pricing for details.

?? Acknowledgments
Built with modern web technologies: React, Vite, Tailwind CSS, Lucide Icons.

? 2025 LogShield. All rights reserved. | Website | Privacy Policy | Terms of Service
