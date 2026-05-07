<div align="center">

# 🛡️ SecureOps AI

### AI-Powered Security Operations Center (SOC) Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

*An intelligent, real-time cybersecurity dashboard for threat detection, log file analysis, and AI-driven security recommendations — built with a professional dark SOC aesthetic.*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Threat Detection Engine](#-threat-detection-engine)
- [AI Chatbot](#-ai-chatbot)
- [Log File Analysis Pipeline](#-log-file-analysis-pipeline)
- [Configuration](#-configuration)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**SecureOps AI** is a modern, frontend-first Security Operations Center (SOC) platform designed to assist security analysts and IT teams in identifying, triaging, and responding to cybersecurity threats. It combines a rule-based threat detection engine with an AI-powered chatbot assistant to provide actionable intelligence from raw log files — all within a sleek, terminal-inspired dark-mode interface.

> Designed for SOC analysts, DevSecOps engineers, and security researchers who need fast, intelligent log analysis without heavy enterprise overhead.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📁 **Log File Upload** | Drag-and-drop or browse to upload `.log`, `.txt`, or `.csv` files for instant analysis |
| 🔍 **Threat Detection** | 12+ rule-based patterns covering the most common attack vectors (OWASP Top 10 and beyond) |
| 🧠 **AI Security Chatbot** | Conversational Gemini-powered assistant for threat explanations, recommendations, and SOC guidance |
| 📊 **Live Dashboard** | Real-time stats, severity charts (Recharts), and an active alerts feed |
| 🗂️ **Threat Intelligence Panel** | Color-coded threat cards with severity filtering, sorting, and JSON export |
| 🌑 **SOC Dark UI** | Professional cybersecurity aesthetic with terminal elements and monospace typography |
| 💾 **Persistent State** | Analysis results and chat history preserved across sessions via `localStorage` |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.3 | UI component framework |
| **TypeScript** | 5.5 | Type-safe development |
| **Vite** | 5.4 | Build tooling & dev server |
| **Tailwind CSS** | 3.4 | Utility-first styling with custom cybersecurity theme |
| **Recharts** | 2.12 | Threat severity charts and data visualizations |
| **Framer Motion** | 12.x | Smooth animations and transitions |
| **Radix UI** | latest | Accessible headless UI primitives |
| **Lucide React** | 0.462 | Icon library |

### State & Data
| Technology | Purpose |
|---|---|
| **React Context + localStorage** | Global security state with session persistence |
| **Zustand** | Lightweight client-side state management |
| **TanStack Query** | Async data fetching and caching |
| **Zod** | Runtime schema validation |

### AI & Analysis
| Technology | Purpose |
|---|---|
| **`@google/generative-ai`** | Gemini AI SDK for chatbot responses |
| **Custom Rule Engine** | In-house `threatDetector.ts` with 12+ regex-based detection rules |
| **`logParser.ts`** | Structured parser for common log formats (Apache, syslog, JSON, etc.) |

---

## 📁 Project Structure

```
secure-ops-ai/
├── public/                     # Static assets (favicon, icons)
├── src/
│   ├── components/
│   │   ├── features/           # Core feature components
│   │   │   ├── AlertsFeed.tsx      # Live security alerts stream
│   │   │   ├── ChatBot.tsx         # AI-powered security assistant
│   │   │   ├── LogUpload.tsx       # Drag-and-drop log file uploader
│   │   │   ├── StatsOverview.tsx   # Dashboard KPI cards
│   │   │   ├── ThreatCard.tsx      # Individual threat detail card
│   │   │   ├── ThreatChart.tsx     # Recharts severity distribution chart
│   │   │   └── ThreatPanel.tsx     # Full threat intelligence panel with filters
│   │   ├── layout/             # Sidebar, Header, navigation
│   │   └── ui/                 # Reusable Radix UI / shadcn components
│   ├── constants/              # App-wide constants and sample log data
│   ├── hooks/                  # Custom React hooks
│   ├── lib/
│   │   ├── chatResponses.ts    # AI chatbot response logic
│   │   ├── logParser.ts        # Multi-format log file parser
│   │   ├── threatDetector.ts   # Core threat detection rule engine
│   │   └── utils.ts            # Shared utilities
│   ├── pages/                  # Route-level pages (Dashboard, NotFound)
│   ├── providers/              # SecurityProvider (global context)
│   ├── stores/                 # State stores (security state)
│   ├── types/                  # TypeScript type definitions
│   ├── App.tsx                 # Root application component
│   └── main.tsx                # Application entry point
├── index.html                  # App shell with SEO meta tags
├── vite.config.ts              # Vite build configuration
├── tailwind.config.ts          # Custom Tailwind theme (cybersecurity palette)
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9+ or **bun**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/GayatriSawant02/Secure_OpsAI.git
cd Secure_OpsAI

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Add your Gemini API key (see Configuration section)

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint for code quality checks |

---

## 🔐 Threat Detection Engine

SecureOps AI includes a powerful, in-house rule-based detection engine (`src/lib/threatDetector.ts`) that analyzes parsed log lines against 12+ curated threat patterns. Threats are deduplicated by IP address and type, then sorted by severity before display.

### Detection Rules

| # | Threat Type | Severity | Detection Logic |
|---|---|---|---|
| 1 | **Brute Force Attack** | 🔴 High | ≥5 failed login attempts from the same IP |
| 2 | **SQL Injection** | 🔴 High | SQLi payloads: `UNION SELECT`, `DROP TABLE`, `exec()`, etc. |
| 3 | **Directory Traversal** | 🔴 High | Path traversal sequences: `../`, `%2e%2e/`, etc. |
| 4 | **Command Injection** | 🔴 High | Shell injection patterns: `cmd=`, `shell_exec`, `%60`, etc. |
| 5 | **DDoS Attempt** | 🔴 High | Abnormally high request rates (>500 req/10s) |
| 6 | **Malware C2 Communication** | 🔴 High | Known C2 ports (4444, 1337, 31337) or botnet keywords |
| 7 | **Data Exfiltration** | 🔴 High | Large outbound data transfers to external IPs |
| 8 | **XSS Attempt** | 🟡 Medium | Script tags, `javascript:` URIs, event handlers |
| 9 | **Port Scan** | 🟡 Medium | Sequential port access patterns or scan keywords |
| 10 | **Privilege Escalation** | 🟡 Medium | `sudo`, `su root`, `chmod 777`, `chown root` patterns |
| 11 | **Suspicious Login** | 🟢 Low | Successful logins from non-RFC1918 (external) IPs |
| 12 | **Reconnaissance** | 🟢 Low | Probing of admin paths: `/wp-admin`, `/.env`, `/phpmyadmin` |

### Analysis Output

Each detected threat includes:
- **Severity level** (High / Medium / Low / Info)
- **Affected IP address** and **username** (when available)
- **Descriptive message** with context
- **Actionable recommendation** for remediation
- **Raw log line** for forensic reference
- **Occurrence count** for recurring events

---

## 🤖 AI Chatbot

The built-in **Security Assistant** chatbot provides:

- Natural language explanations of detected threats
- Step-by-step remediation guidance
- General cybersecurity Q&A (OWASP, CVEs, SOC procedures)
- Context-aware responses based on the current analysis session

The chatbot is powered by the **Google Gemini API** (`@google/generative-ai`). Responses are generated with security-domain context prepended to each conversation turn, ensuring technically accurate and relevant answers.

---

## 📈 Log File Analysis Pipeline

```
User Uploads File
       │
       ▼
 logParser.ts  ──► Parses lines into structured { ip, timestamp, user, message, status, port }
       │
       ▼
threatDetector.ts ──► Runs 12+ detection rules against each parsed line
       │
       ▼
  Deduplication ──► Groups threats by (rule + IP), prevents duplicate alerts
       │
       ▼
Severity Sorting ──► High → Medium → Low → Info
       │
       ▼
 SecurityStore  ──► Updates global state (context + localStorage)
       │
       ▼
Dashboard / ThreatPanel / AlertsFeed ──► Rendered to UI
```

**Supported log formats:**
- Apache / Nginx access logs
- Syslog / system event logs
- Firewall and network device logs
- JSON-structured logs
- Generic `[TIMESTAMP] [LEVEL] message` formats

---

## ⚙️ Configuration

Create a `.env` file in the project root:

```env
# Google Gemini API Key (required for AI chatbot)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** The application functions fully for log analysis and threat detection without an API key. The AI chatbot will fall back to curated local responses when no key is configured.

To obtain a Gemini API key, visit [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 🗺️ Roadmap

- [ ] **Real-time log streaming** — WebSocket/SSE support for live log ingestion
- [ ] **Python/Flask backend** — Offload analysis to a dedicated API service
- [ ] **SIEM integration** — Connect to Splunk, Elastic, or Datadog
- [ ] **Custom detection rules** — UI editor for user-defined threat patterns
- [ ] **PDF/CSV export** — Full incident reports with executive summary
- [ ] **Multi-file analysis** — Correlate threats across multiple log sources
- [ ] **Geo-IP threat mapping** — Interactive world map of attack origins
- [ ] **User authentication** — Role-based access (Analyst / Manager / Admin)
- [ ] **Alerting & notifications** — Email/Slack/webhook integrations

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** this repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add your feature'`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages and ensure `npm run lint` passes before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built with ❤️ by [Gayatri Sawant](https://github.com/GayatriSawant02)

*If you find this project useful, please consider giving it a ⭐*

</div>
