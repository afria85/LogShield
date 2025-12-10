
---

# **LogShield — Secure Log Sanitizer**

**Enterprise-grade log sanitizer** that processes all data **100% in your browser**.
Remove API keys, tokens, credentials, emails, IP addresses, and PII **securely and instantly**.

---

## 🚀 **Try It Now**

The fastest way to get started is to use the live web app — **no installation required**.

👉 **Open LogShield Web App**
[https://logshield.dev/app](https://logshield.dev/app)

---

## 📌 **Overview**

**LogShield** is a privacy-first developer tool that helps you safely share logs and debug data by automatically removing sensitive information.

All processing happens **locally in your browser** — your data **never leaves your device**.

### **Why Use LogShield?**

* 🔐 **Privacy by Design**
  100% client-side processing. Nothing is uploaded, nothing is stored.

* ⚡ **Instant & Powerful**
  Sanitize thousands of lines in milliseconds with **70+ built-in security patterns**.

* 🛡️ **Comprehensive Detection**
  Covers AWS, GCP, Azure, API keys, tokens, emails, personal data, and more.

* 👥 **Built for Teams**
  Custom patterns, batch processing, export options, and team features.

---

## 💳 **Plans & Pricing**

| Plan         | Price             | Best For                | Key Features                                                |
| ------------ | ----------------- | ----------------------- | ----------------------------------------------------------- |
| **Free**     | **$0 forever**    | Trying it out           | 3,000 chars/session, 5 uses/month, 10 basic patterns        |
| **Starter**  | **$7/month**      | Individual developers   | 10,000 chars/session, 50 uses/month, PDF/CSV export         |
| **Pro**      | **$19/month**     | Professional developers | Unlimited use, 70+ patterns, AI detection, batch processing |
| **Team**     | **$79/month**     | Teams & organizations   | 5 seats, shared library, REST API, SSO, usage analytics     |
| **Lifetime** | **$199 one-time** | Long-term users         | Everything in Team + lifetime access + all future updates   |

✔️ All paid plans include a **14-day money-back guarantee**.

🔗 **Full feature comparison and upgrades:**
[https://logshield.dev/pricing](https://logshield.dev/pricing)

---

## 👨‍💻 **For Developers — Run Locally**

If you'd like to run the development version:

### **1. Clone the repository**

```bash
git clone https://github.com/afria85/LogShield.git
cd LogShield
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Start development server**

```bash
npm run dev
```

### **4. Open the app**

```
http://localhost:5173
```

---

## 📂 **Project Structure**

```
LogShield/
├── src/
│   ├── components/   # React components (UI)
│   ├── lib/          # Sanitizer engine, patterns, licensing
│   └── ...
├── public/           # Static assets & legal pages
└── ...
```

---

## 🧭 **Planned Features**

These improvements are currently in development:

* 🔧 **CLI Tool** — Run LogShield from your terminal
* 🧩 **VS Code Extension** — Sanitize logs directly in your editor
* 🤖 **Enhanced AI Detection** — Smarter recognition for unknown secret formats
* 🔄 **GitHub Action** — CI/CD automatic sanitization
* 🏢 **Self-Hosted Version** — Deploy inside your private infrastructure

Have a feature request? Open an issue on GitHub!

---

## 🆘 **Support**

- **Community & Bug Reports**: [Open a GitHub Issue](https://github.com/afria85/LogShield/issues)
- **All Other Inquiries**: **hello@logshield.dev**

**Response Times:**
- **Free Tier**: Community-based (GitHub)
- **Paid Plans (Starter, Pro, Team, Lifetime)**: Guaranteed email response within **24 hours** on business days.

---

## 🔧 **Tech Stack & Architecture** ##

* LogShield is built with a privacy-conscious and modern architecture:
* Frontend & Hosting: React, Vite, and hosted globally on Vercel for optimal performance and reliability.
* Privacy-First Analytics: We use Plausible Analytics, a GDPR-compliant, cookieless platform, to understand usage trends without collecting any personal data.
* License Management: For paid plans, license validation is handled securely through serverless functions. User data and logs are never stored in these systems.

✨ This stack ensures LogShield remains fast, secure, and truly respectful of your privacy.

---

## 📜 **License**

* The **core sanitization engine** is open-source under the **MIT License**.
* The full application (UI, AI features, commercial modules) requires a **commercial license**.
  See: [https://logshield.dev/pricing](https://logshield.dev/pricing)

---

## 🙏 **Acknowledgments**

Built with:

* React
* Vite
* Tailwind CSS
* Lucide Icons

---

© **2025 LogShield** — All rights reserved.
**Website** • **Privacy Policy** • **Terms of Service**

---
