# SecureOps AI — Security Operations Chatbot

A professional AI-powered cybersecurity dashboard for threat detection, log analysis, and security assistance.

## Features

- **Log Analysis**: Upload `.log`, `.txt`, or `.csv` files for instant AI analysis
- **Threat Detection**: 12+ rule-based detection patterns (Brute Force, SQLi, XSS, Port Scan, DDoS, C2, etc.)
- **Threat Intelligence Panel**: Color-coded severity, filtering, sorting, export to JSON
- **AI Chatbot**: Gemini-style security assistant for threat explanations and recommendations
- **Dashboard**: Real-time stats, charts, and alerts feed
- **Dark SOC Aesthetic**: Professional cybersecurity UI with terminal elements

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with custom cybersecurity theme
- **Charts**: Recharts
- **State**: React Context + localStorage persistence
- **AI**: Mocked Gemini AI responses (ready for real API integration)

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── features/      # LogUpload, ThreatPanel, ChatBot, etc.
│   └── layout/        # Sidebar, Header
├── pages/             # Dashboard, NotFound
├── lib/               # logParser, threatDetector, chatResponses
├── stores/            # Security state management
├── providers/         # SecurityProvider
├── types/             # TypeScript definitions
└── constants/         # App constants, sample log
```

## Threat Detection Rules

The AI agent detects:

| Threat                   | Severity |
| ------------------------ | -------- |
| Brute Force Attack       | High     |
| SQL Injection            | High     |
| Directory Traversal      | High     |
| Command Injection        | High     |
| DDoS Attempt             | High     |
| Malware C2 Communication | High     |
| Data Exfiltration        | High     |
| XSS Attempt              | Medium   |
| Port Scan                | Medium   |
| Privilege Escalation     | Medium   |
| Suspicious Login         | Low      |
| Reconnaissance           | Low      |

## Backend Integration (Future)

To add a real Python/Flask backend, deploy it separately and update the API calls in `src/lib/threatDetector.ts` to call your endpoints.

For real Gemini AI integration, use OnSpace Cloud Edge Functions with the Gemini API key stored in Secrets.
