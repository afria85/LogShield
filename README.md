<!-- Dark-mode optimized README -->

# <img src="https://twemoji.maxcdn.com/v/latest/svg/1f31f.svg" width="28" height="28" style="vertical-align:middle;margin-right:8px"/> LogShield ? Secure, Local-First Log Sanitizer

**Enterprise-grade log sanitization. 100% client-side. No data ever leaves your device.**

<p align="center">
  <a href="https://logshield.dev/app">
    <img src="https://img.shields.io/badge/Launch_App-282C34?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
  <br />
  <img src="https://img.shields.io/badge/Client-Side-Only-0f172a?style=flat-square" />
  <img src="https://img.shields.io/badge/Zero-Telemetry-1e293b?style=flat-square" />
  <img src="https://img.shields.io/badge/70+_Patterns-334155?style=flat-square" />
</p>

---

## <img src="https://twemoji.maxcdn.com/v/latest/svg/1f680.svg" width="18" style="vertical-align:middle;margin-right:6px"/> Try LogShield Now

Live demo (no signup):  
?? **https://logshield.dev/app**

All sanitization logic runs **locally in your browser**.  
Nothing is uploaded ? ever.

---

## <img src="https://twemoji.maxcdn.com/v/latest/svg/1f6e1.svg" width="18" style="vertical-align:middle;margin-right:6px"/> Why LogShield?

### <img src="https://twemoji.maxcdn.com/v/latest/svg/1f512.svg" width="16" style="vertical-align:middle;margin-right:6px"/> Privacy & Security

- Local-first architecture
- Zero telemetry
- No backend, no storage, no cookies
- Auditable sanitization engine

### <img src="https://twemoji.maxcdn.com/v/latest/svg/26a1.svg" width="16" style="vertical-align:middle;margin-right:6px"/> Fast by Design

- Processes thousands of lines instantly
- Built with optimized regex + entropy heuristics
- Runs offline

### <img src="https://twemoji.maxcdn.com/v/latest/svg/1f4a1.svg" width="16" style="vertical-align:middle;margin-right:6px"/> Powerful Detection

- 70+ patterns: keys, secrets, IPs, emails, PII
- Pro mode: AI entropy detection
- Continuous updates

### <img src="https://twemoji.maxcdn.com/v/latest/svg/1f465.svg" width="16" style="vertical-align:middle;margin-right:6px"/> Team & Enterprise Ready

- Team dashboard
- SSO (coming soon)
- Audit logs
- Custom branding
- Dedicated support & SLA

---

## <img src="https://twemoji.maxcdn.com/v/latest/svg/1f4b0.svg" width="18" style="vertical-align:middle;margin-right:6px"/> Pricing

Dark-mode friendly table:

| **Tier**    | **Price** | **Best For**           | **Features**                                                                                     |
| ----------- | --------: | ---------------------- | ------------------------------------------------------------------------------------------------ |
| **Free**    |        $0 | Personal use           | ? 10 runs/mo<br>? 10k chars/run<br>? 10 patterns<br>? Community support                          |
| **Starter** |     $7/mo | Solo developers        | ? 100 runs/mo<br>? 50k chars/run<br>? 40+ patterns<br>? Export TXT/JSON<br>? Email support       |
| **Pro**     |    $19/mo | Security-focused teams | ? Unlimited runs<br>? 70+ patterns<br>? AI entropy<br>? All export formats<br>? Priority support |
| **Team**    |    $79/mo | Organizations          | ? Everything in Pro<br>? 10 team members<br>? SSO<br>? Audit logs<br>? SLA, dedicated support    |

> **14-day money-back guarantee on all paid tiers.**

---

## <img src="https://twemoji.maxcdn.com/v/latest/svg/1f4bb.svg" width="18" style="vertical-align:middle;margin-right:6px"/> Local Development

```bash
git clone https://github.com/afria85/LogShield.git
cd LogShield
npm install
npm run dev
```

Visit:

```
http://localhost:5173
```

---

## <img src="https://twemoji.maxcdn.com/v/latest/svg/1f4c2.svg" width="18" style="vertical-align:middle;margin-right:6px"/> Project Structure

```
LogShield/
ÃÄÄ src/
³   ÃÄÄ App.jsx              # Main router
³   ÃÄÄ pages/               # Page components
³   ³   ÃÄÄ Home.jsx
³   ³   ÃÄÄ App.jsx          # Sanitizer tool
³   ³   ÃÄÄ Pricing.jsx
³   ³   ÃÄÄ Features.jsx
³   ³   ÃÄÄ Documentation.jsx
³   ³   ÃÄÄ About.jsx
³   ³   ÃÄÄ Blog.jsx
³   ³   ÃÄÄ Privacy.jsx
³   ³   ÀÄÄ Terms.jsx
³   ÃÄÄ components/
³   ³   ÃÄÄ Header.jsx
³   ³   ÀÄÄ Footer.jsx
³   ÃÄÄ hooks/
³   ³   ÃÄÄ useTheme.jsx
³   ³   ÀÄÄ useSEO.jsx
³   ÀÄÄ lib/
³       ÃÄÄ sanitizer/
³       ÃÄÄ patterns.js
³       ÀÄÄ analytics.js
ÀÄÄ public/
```

---

## <img src="https://twemoji.maxcdn.com/v/latest/svg/1f310.svg" width="18" style="vertical-align:middle;margin-right:6px"/> Routes

| Route       | Description      |
| ----------- | ---------------- |
| `/`         | Home / Landing   |
| `/app`      | Log sanitizer    |
| `/pricing`  | Pricing page     |
| `/features` | Feature list     |
| `/docs`     | Documentation    |
| `/about`    | About LogShield  |
| `/blog`     | Blog             |
| `/privacy`  | Privacy Policy   |
| `/terms`    | Terms of Service |

### SPA Routing for Vercel

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## <img src="https://twemoji.maxcdn.com/v/latest/svg/1f6e0.svg" width="18" style="vertical-align:middle;margin-right:6px"/> Roadmap

- VS Code extension
- CLI tool
- GitHub Action support
- AI-enhanced detection
- Enterprise self-hosted edition
- Custom pattern builder
- REST API

Submit feature requests:  
?? https://github.com/afria85/LogShield/issues

---

## <img src="https://twemoji.maxcdn.com/v/latest/svg/1f4e9.svg" width="18" style="vertical-align:middle;margin-right:6px"/> Support

| Tier    | Support Level           |
| ------- | ----------------------- |
| Free    | Community / GitHub      |
| Starter | Standard email          |
| Pro     | Priority                |
| Team    | Dedicated support + SLA |

?? **hello@logshield.dev**

---

## <img src="https://twemoji.maxcdn.com/v/latest/svg/1f5a5.svg" width="18" style="vertical-align:middle;margin-right:6px"/> Tech Stack

- React + Vite
- React Router
- Tailwind CSS
- Lucide Icons
- Plausible (cookieless analytics)
- Custom sanitization engine (MIT)

---

## <img src="https://twemoji.maxcdn.com/v/latest/svg/1f4d1.svg" width="18" style="vertical-align:middle;margin-right:6px"/> License

- Core engine: **MIT License**
- Full application: **Commercial License**  
  ? https://logshield.dev/pricing

---

## <img src="https://twemoji.maxcdn.com/v/latest/svg/2764.svg" width="18" style="vertical-align:middle;margin-right:6px"/> Acknowledgments

Built with React, Vite, Tailwind, Lucide Icons, and a custom sanitization engine.

<p align="center" style="margin-top:18px">
  <small>&copy; 2025 LogShield ? All rights reserved.<br/>
  <a href="https://logshield.dev">Website</a> &bull; 
  <a href="httpsshield.dev/privacy">Privacy</a> &bull; 
  <a href="https://logshield.dev/terms">Terms</a></small>
</p>
