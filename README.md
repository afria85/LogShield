````markdown
# 🔒 LogShield - Secure Log Sanitizer

**Enterprise-grade log sanitizer that never leaves your browser.**  
Remove API keys, tokens, credentials, emails, IP addresses, and PII → securely and instantly.

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/afria85/LogShield)  
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

⚡ **Live Demo:** [https://logshield.dev](https://logshield.dev)  
📖 **Documentation:** [https://docs.logshield.dev](https://docs.logshield.dev)

---

## ⚙️ Features

### 🆓 Free Tier

- 3,000 characters/session
- 5 uses/month
- 10 basic patterns (AWS, emails, IPs, etc.)
- 100% client-side (GDPR-friendly)
- No tracking, no data transfer

### 💎 Pro Tier ($19/mo)

- Unlimited characters & usage
- 70+ advanced security patterns
- AI-powered entropy detection
- Batch file processing
- Export to PDF/CSV/JSON
- Custom pattern library
- Priority support

### 👥 Team Tier ($79/mo)

- Everything in Pro
- 5 team seats
- Shared pattern library
- REST API access
- Usage analytics
- SSO (Google/GitHub)

---

## 🚀 Quick Start

### Option 1 – Use Online (Recommended)

Just visit **[https://logshield.dev](https://logshield.dev)** → no installation required.

### Option 2 – Run Locally

```bash
# Clone repository
git clone https://github.com/afria85/LogShield.git
cd LogShield

# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```
````

---

## 📦 Installation Guide

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

## 🗂 Project Structure

```
LogShield/
├─ public/
│  ├─ favicon.ico
│  └─ robots.txt
├─ src/
│  ├─ components/
│  │  ├─ Header.jsx
│  │  ├─ Hero.jsx
│  │  ├─ Sanitizer.jsx
│  │  ├─ Pricing.jsx
│  │  ├─ Features.jsx
│  │  └─ ui/
│  │     ├─ Button.jsx
│  │     ├─ Card.jsx
│  │     ├─ Input.jsx
│  │     └─ Badge.jsx
│  ├─ lib/
│  │  ├─ patterns.js
│  │  ├─ sanitizer.js
│  │  ├─ license.js
│  │  ├─ analytics.js
│  │  └─ storage.js
│  ├─ hooks/
│  │  ├─ useLocalStorage.js
│  │  └─ useLicense.js
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
└─ README.md
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file:

```bash
# Lemon Squeezy Checkout URLs
VITE_LEMON_STARTER_URL=...
VITE_LEMON_PRO_URL=...
VITE_LEMON_TEAM_URL=...
VITE_LEMON_LIFETIME_URL=...

# Analytics
VITE_PLAUSIBLE_DOMAIN=logshield.dev

# App
VITE_APP_URL=https://logshield.dev
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Add `.env` variables in Vercel > Project Settings.

### Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### GitHub Pages

```bash
npm run build
npm install -g gh-pages
gh-pages -d dist
```

---

### Plans

```
Starter – $7/mo
Pro – $19/mo
Team – $79/mo
Lifetime – $199 one-time
```

Include checkout URLs in `.env`.

---

## 📊 Analytics (Plausible)

```javascript
plausible("Sanitize", { props: { tier: "free" } });
plausible("Upgrade", { props: { plan: "pro" } });
```

## ⚠️ Troubleshooting

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

## 📝 License

- Core sanitizer engine: MIT (open source)
- Full application: Commercial license
  Purchase at [https://logshield.dev/pricing](https://logshield.dev/pricing)

---

## 💬 Support

- GitHub Issues: [https://github.com/afria85/LogShield/issues](https://github.com/afria85/LogShield/issues)
- Discord: [https://discord.gg/logshield](https://discord.gg/logshield)
- Email (Pro/Team): [support@logshield.dev](mailto:support@logshield.dev) (response <4h)

---

## 🙏 Acknowledgments

Built with React, Vite, Tailwind CSS, Lucide Icons, Lemon Squeezy.

---

## 🛣 Roadmap

### Q1 2025

- Core sanitizer, 70+ patterns, Licensing, Payments
- CLI, API docs (pending)

### Q2 2025

- VS Code extension, GitHub Action, Slack integration, Mobile app, Self-hosted

### Q3 2025

- ML-based detection, Monitoring, Team collaboration, Advanced analytics

---

## 📧 Contact

- Email: [hello@logshield.dev](mailto:hello@logshield.dev)
- Website: [https://logshield.dev](https://logshield.dev)
- GitHub: [@afria85](https://github.com/afria85)

---

Made with ❤️ for Developers
© 2025 LogShield. All rights reserved.

```

```
