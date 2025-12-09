---

# ?? LogShield ? Secure Log Sanitizer

**Enterprise-grade log sanitizer that never leaves your browser.**
Remove API keys, tokens, credentials, emails, IP addresses, and PII ? securely and instantly.

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/afria85/LogShield)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

?? **Live Demo:** [https://logshield.io](https://logshield.io)
?? **Documentation:** [https://docs.logshield.io](https://docs.logshield.io)

---

## ? Features

### ?? Free Tier

- ? 3,000 characters/session
- ? 5 uses/month
- ? 10 basic patterns (AWS, emails, IPs, etc.)
- ? 100% client-side (GDPR-friendly)
- ? No tracking, no data transfer

### ?? Pro Tier ($19/mo)

- ? Unlimited characters & usage
- ? 70+ advanced security patterns
- ? AI-powered entropy detection
- ? Batch file processing
- ? Export to PDF/CSV/JSON
- ? Custom pattern library
- ? Priority support

### ?? Team Tier ($79/mo)

- ? Everything in Pro
- ? 5 team seats
- ? Shared pattern library
- ? REST API access
- ? Usage analytics
- ? SSO (Google/GitHub)

---

## ?? Quick Start

### Option 1 ? **Use Online (Recommended)**

Just visit **[https://logshield.io](https://logshield.io)** ? no installation required.

### Option 2 ? **Run Locally**

```bash
# Clone repository
git clone https://github.com/afria85/LogShield.git
cd LogShield

# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

---

## ?? Installation Guide

### Requirements

- Node.js 18+
- npm or yarn

### Steps

```bash
# 1. Create new project
npm create vite@latest logshield -- --template react
cd logshield

# 2. Install dependencies
npm install lucide-react clsx tailwind-merge

# 3. Install dev tools
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Copy all LogShield source files

# 5. Start development
npm run dev
```

---

## ?? Project Structure

```
logshield/
³ÄÄ public/
³   ÃÄÄ favicon.ico
³   ÀÄÄ robots.txt
³
³ÄÄ src/
³   ÃÄÄ components/
³   ³   ÃÄÄ Header.jsx
³   ³   ÃÄÄ Hero.jsx
³   ³   ÃÄÄ Sanitizer.jsx
³   ³   ÃÄÄ Pricing.jsx
³   ³   ÃÄÄ Features.jsx
³   ³   ÀÄÄ ui/
³   ³       ÃÄÄ Button.jsx
³      	    ÃÄÄ Card.jsx
³           ÃÄÄ Input.jsx
³           ÀÄÄ Badge.jsx
³
³   ÃÄÄ lib/
³   ³   ÃÄÄ patterns.js
³   ³   ÃÄÄ sanitizer.js
³   ³   ÃÄÄ license.js
³   ³   ÃÄÄ analytics.js
³   ³   ÀÄÄ storage.js
³
³   ÃÄÄ hooks/
³   ³   ÃÄÄ useLocalStorage.js
³   ³   ÀÄÄ useLicense.js
³
³   ÃÄÄ App.jsx
³   ÃÄÄ main.jsx
³   ÀÄÄ index.css
³
ÃÄÄ package.json
ÃÄÄ vite.config.js
ÃÄÄ tailwind.config.js
ÃÄÄ postcss.config.js
ÀÄÄ README.md
```

---

## ?? Configuration

### Environment Variables

Create a `.env` file:

```bash
# Lemon Squeezy Checkout URLs
VITE_LEMON_STARTER_URL=...
VITE_LEMON_PRO_URL=...
VITE_LEMON_TEAM_URL=...
VITE_LEMON_LIFETIME_URL=...

# Analytics
VITE_PLAUSIBLE_DOMAIN=logshield.io

# App
VITE_APP_URL=https://logshield.io
```

---

## ?? Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Add `.env` variables in Vercel > Project Settings.

---

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

### Deploy to GitHub Pages

```bash
npm run build
npm install -g gh-pages
gh-pages -d dist
```

---

## ?? Monetization (Lemon Squeezy)

### Why Lemon Squeezy?

- Supports Indonesian payments
- No US/EU company required
- VAT handled automatically
- Easy setup
- 5% + $0.50 per transaction

### Plans

```
Starter ? $7/mo
Pro ? $19/mo
Team ? $79/mo
Lifetime ? $199 one-time
```

Include checkout URLs in `.env`.

---

## ?? Analytics (Plausible)

Custom events:

```javascript
plausible("Sanitize", { props: { tier: "free" } });
plausible("Upgrade", { props: { plan: "pro" } });
```

---

## ?? Revenue Projections (12 Months)

| Month | Free Users | Paid Users | MRR    | Revenue |
| ----- | ---------- | ---------- | ------ | ------- |
| 1?3   | 5,000      | 70         | $1,883 | $5,649  |
| 4?6   | 15,000     | 215        | $2,585 | $7,755  |
| 7?12  | 30,000     | 430        | $5,170 | $31,020 |

**Total Year 1: ~$44,424**

---

## ?? Launch Strategy

### Pre-Launch

- Domain
- Payments
- Analytics
- Landing page
- Email list
- Blog post

### Launch Day

- Product Hunt
- Hacker News
- LinkedIn/Twitter
- Reddit
- Dev.to
- Email blast

### Post-Launch

- Fix bugs
- Publish content
- Tutorials
- Email sequences

### Growth

- SEO
- Blog content
- YouTube
- CLI tool
- VS Code extension
- API documentation
- Affiliate program

---

## ???? Indonesian Tax & Legal

### Options

| Option        | Cost    | Timeline  | Tax             |
| ------------- | ------- | --------- | --------------- |
| CV            | 5?10 jt | 2?4 weeks | 0.5%            |
| PT Perorangan | 1?2 jt  | 1?2 weeks | 0.5%            |
| Personal      | Free    | Instant   | Report manually |

**Recommended: PT Perorangan**

---

## ???? Germany (as Student)

- Passive income allowed
- ?520/month tax-free
- Register as _Kleinunternehmer_ (< ?22k/year)
- No VAT needed
- Must file annual tax return

---

## ?? Troubleshooting

### Build fails

```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }]
    }
  ]
}
```

---

## ?? License

- **Core sanitizer engine:** MIT (open source)
- **Full application:** Commercial

Buy commercial license ? [https://logshield.io/pricing](https://logshield.io/pricing)

---

## ?? Support

### Community

GitHub Issues: [https://github.com/afria85/LogShield/issues](https://github.com/afria85/LogShield/issues)
Discord: [https://discord.gg/logshield](https://discord.gg/logshield)

### Priority Support (Pro/Team)

Email: [support@logshield.io](mailto:support@logshield.io)
Response < 4 hours

---

## ?? Acknowledgments

Built with React, Vite, Tailwind CSS, Lucide Icons, Lemon Squeezy.

---

## ?? Roadmap

### Q1 2024

- [x] Core sanitizer
- [x] 70+ patterns
- [x] Licensing
- [x] Payments
- [ ] CLI
- [ ] API docs

### Q2 2024

- [ ] VS Code extension
- [ ] GitHub Action
- [ ] Slack integration
- [ ] Mobile app
- [ ] Self-hosted

### Q3 2024

- [ ] ML-based detection
- [ ] Monitoring
- [ ] Team collaboration
- [ ] Advanced analytics

---

## ?? Contact

**Email:** [hello@logshield.io](mailto:hello@logshield.io)
**Website:** [https://logshield.io](https://logshield.io)
**GitHub:** [https://github.com/afria85](https://github.com/afria85)

---

Made with ?? for Developers
? 20254 LogShield ? All rights reserved.

---
