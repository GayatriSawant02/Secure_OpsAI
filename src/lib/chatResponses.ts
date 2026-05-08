// ============================================================
// SecureOps AI – AI Chatbot Response Engine
// Tries Gemini API first; silently falls back to local engine
// ============================================================

import type { Threat } from "@/types";

interface ChatContext {
  threats: Threat[];
  lastAnalysis: string | null;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Build a focused system prompt so Gemini stays in-character
 * as a cybersecurity SOC assistant.
 */
function buildSystemPrompt(threats: Threat[]): string {
  const threatSummary =
    threats.length === 0
      ? "No threats have been detected in the current session."
      : `Detected threats (${threats.length} total):\n` +
        threats
          .slice(0, 10)
          .map(
            (t) =>
              `- ${t.type} | Severity: ${t.severity} | IP: ${t.ip} | ${t.message}`
          )
          .join("\n");

  return `You are SecureOps AI, an expert cybersecurity SOC (Security Operations Center) assistant embedded inside the SecureOps AI platform. You help security analysts understand threats, explain attack techniques, and recommend defensive actions.

Current security context:
${threatSummary}

Guidelines:
- Keep responses concise and actionable.
- Use markdown-like formatting with **bold** for emphasis and bullet points where helpful.
- Focus only on cybersecurity topics.
- If asked about something unrelated, steer back to security.
- Never reveal that you are powered by Google Gemini or any external API.`;
}

/**
 * Call the Gemini API. Returns the response text or throws on failure.
 */
async function callGeminiAPI(
  userMessage: string,
  threats: Threat[]
): Promise<string> {
  const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: buildSystemPrompt(threats) }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Gemini API error ${response.status}: ${errorBody}`
    );
  }

  const data = await response.json();
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini API returned an empty or unexpected response.");
  }

  return text.trim();
}

/**
 * Generate a response based on user query and current threat context.
 * Tries Gemini API first; silently falls back to local rule-based engine.
 */
export async function generateChatResponse(
  userMessage: string,
  context: ChatContext
): Promise<string> {
  const { threats } = context;

  // ── Try Gemini API ──────────────────────────────────────────
  if (GEMINI_API_KEY) {
    try {
      const geminiResponse = await callGeminiAPI(userMessage, threats);
      return geminiResponse;
    } catch (err) {
      // Log to console only — the user will never see this
      console.warn("[SecureOps AI] Gemini API unavailable, using local engine.", err);
    }
  } else {
    console.warn("[SecureOps AI] VITE_GEMINI_API_KEY not set. Using local engine.");
  }

  // ── Fallback: local rule-based engine ───────────────────────
  // Simulate a short "thinking" delay for UX consistency
  await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 500));
  return getLocalResponse(userMessage, threats);
}

// ============================================================
// Rule-based local response engine (fallback)
// ============================================================
function getLocalResponse(userMessage: string, threats: Threat[]): string {
  const msg = userMessage.toLowerCase();

  // --- Greeting ---
  if (/^(hi|hello|hey|greetings|good\s+\w+)/i.test(msg)) {
    return `Hello! I'm **SecureOps AI**, your cybersecurity operations assistant.\n\nI can help you:\n• 🔍 **Analyze** detected threats\n• 💡 **Explain** attack techniques\n• 🛡️ **Recommend** defensive actions\n• 📊 **Summarize** your security posture\n\nTry asking: *"Explain the brute force attack"* or *"What should I do about high severity threats?"*`;
  }

  // --- Help ---
  if (/help|what can you|capabilities/i.test(msg)) {
    return `I can assist with:\n\n**📋 Threat Analysis**\n• "Explain [threat type]"\n• "What is a brute force attack?"\n• "Show recent threats"\n\n**🛡️ Security Recommendations**\n• "What action should I take?"\n• "How do I prevent SQL injection?"\n• "Recommend firewall rules"\n\n**📊 Status Reports**\n• "Summary of current threats"\n• "Show high severity alerts"\n• "How many threats detected?"\n\n**🔬 Log Analysis**\n• Upload a log file to start analysis\n• "What does this log entry mean?"`;
  }

  // --- Show threats / recent alerts ---
  if (/show.*threats|recent.*threats|recent.*alerts|list.*threats|all.*threats/i.test(msg)) {
    if (threats.length === 0) {
      return `**No threats detected** in the current analysis session.\n\nTo start threat detection:\n1. Navigate to the **Upload Log** section\n2. Upload a \`.log\` or \`.txt\` file\n3. The AI agent will analyze it automatically\n\nYou can also try the **Sample Log** button to see a demonstration.`;
    }
    const high = threats.filter((t) => t.severity === "High");
    const medium = threats.filter((t) => t.severity === "Medium");
    const low = threats.filter((t) => t.severity === "Low");

    return `**Current Threat Summary** (${threats.length} total)\n\n🔴 **High Severity:** ${high.length}\n${high.slice(0, 3).map((t) => `  • ${t.type} from \`${t.ip}\``).join("\n")}\n\n🟠 **Medium Severity:** ${medium.length}\n${medium.slice(0, 2).map((t) => `  • ${t.type} from \`${t.ip}\``).join("\n")}\n\n🟡 **Low Severity:** ${low.length}\n${low.slice(0, 2).map((t) => `  • ${t.type} from \`${t.ip}\``).join("\n")}\n\nType *"explain [threat name]"* for detailed analysis of any specific threat.`;
  }

  // --- Summary ---
  if (/summary|overview|status|posture|report/i.test(msg)) {
    if (threats.length === 0) {
      return `**Security Posture: Unknown** — No log analysis has been performed yet.\n\nUpload a log file to generate a comprehensive security report.`;
    }
    const uniqueIPs = new Set(threats.map((t) => t.ip)).size;
    const highCount = threats.filter((t) => t.severity === "High").length;
    const posture = highCount > 3 ? "🔴 CRITICAL" : highCount > 0 ? "🟠 AT RISK" : "🟡 MODERATE";

    return `**Security Posture Assessment: ${posture}**\n\n**Detected Threats:** ${threats.length}\n**Unique Attacker IPs:** ${uniqueIPs}\n**Critical Issues:** ${highCount}\n\n${highCount > 0 ? `⚠️ **Immediate attention required** for ${highCount} high-severity threats. The most critical finding is a **${threats[0]?.type}** from IP \`${threats[0]?.ip}\`.\n\n` : ""}**Top Recommendations:**\n1. Block all flagged IP addresses at the firewall\n2. Enable Multi-Factor Authentication (MFA)\n3. Review and patch vulnerable application endpoints\n4. Set up real-time SIEM alerting\n5. Conduct a full security audit`;
  }

  // --- High severity ---
  if (/high severity|critical|urgent|immediate/i.test(msg)) {
    const highThreats = threats.filter((t) => t.severity === "High");
    if (highThreats.length === 0) {
      return `**No high-severity threats** detected in the current session. Your system appears to be in a relatively safe state based on the analyzed logs.\n\nRemember to regularly upload fresh logs for continuous monitoring.`;
    }
    return `**🔴 HIGH SEVERITY THREATS (${highThreats.length})**\n\n${highThreats.map((t, i) => `**${i + 1}. ${t.type}**\n   • IP: \`${t.ip}\`\n   • Time: ${t.timestamp}\n   • Action: ${t.recommendation.split(".")[0]}`).join("\n\n")}\n\n⚡ **Priority Action:** Start with IP blocking — all flagged IPs should be blocked at the perimeter firewall immediately.`;
  }

  // --- Brute force ---
  if (/brute.?force|multiple.*login|failed.*login|password.*attack/i.test(msg)) {
    const bf = threats.find((t) => t.type === "Brute Force Attack");
    return `**🔴 Brute Force Attack — Explained**\n\nA **brute force attack** is when an attacker systematically tries many password combinations to gain unauthorized access.\n\n**What happened:**\n${bf ? `• IP \`${bf.ip}\` made ${bf.count || "multiple"} failed login attempts${bf.user ? ` against account "${bf.user}"` : ""}\n• This pattern is consistent with automated credential stuffing or brute force tools` : "• Multiple failed login attempts from a single IP within a short time window"}\n\n**Immediate Response Actions:**\n1. 🚫 Block IP \`${bf?.ip || "attacker IP"}\` at firewall\n2. 🔒 Lock affected user accounts temporarily\n3. 🔑 Enable account lockout after 3-5 failed attempts\n4. 📱 Enforce MFA on all accounts\n5. 🕵️ Check if any attempt succeeded\n\n**Prevention:**\n• Use fail2ban or similar tools\n• Implement CAPTCHA on login forms\n• Consider IP reputation filtering`;
  }

  // --- SQL Injection ---
  if (/sql.?injection|sqli|database.*attack|drop.*table/i.test(msg)) {
    return `**🔴 SQL Injection — Explained**\n\nSQL Injection is a code injection attack where malicious SQL statements are inserted into input fields to manipulate the database.\n\n**How it works:**\n• Attacker inputs SQL commands like \`'; DROP TABLE users;--\`\n• If input isn't sanitized, the database executes the malicious query\n• Can lead to: data theft, data deletion, authentication bypass, full DB compromise\n\n**Detected indicators:**\n• Payloads containing \`'--\`, \`UNION SELECT\`, \`DROP TABLE\`, \`INSERT\`\n• Encoded characters: \`%27\`, \`%3B\`\n\n**Immediate Actions:**\n1. 🚫 Block the attacker IP\n2. 🔍 Audit database for unauthorized changes\n3. 🛡️ Enable WAF rules for SQLi\n\n**Prevention:**\n• Use parameterized queries / prepared statements\n• ORM frameworks (SQLAlchemy, Hibernate)\n• Input validation & output encoding\n• Principle of least privilege for DB accounts`;
  }

  // --- XSS ---
  if (/xss|cross.?site.?script|script.*inject/i.test(msg)) {
    return `**🟠 Cross-Site Scripting (XSS) — Explained**\n\nXSS attacks inject malicious scripts into web pages viewed by other users, enabling session hijacking, defacement, or credential theft.\n\n**Types:**\n• **Stored XSS** — Script saved in database, executed on every page load\n• **Reflected XSS** — Script in URL, executed when link is visited\n• **DOM-based XSS** — Manipulates client-side DOM\n\n**Detected payload:** \`<script>alert(1)</script>\` or similar\n\n**Immediate Actions:**\n1. Identify if any XSS was successfully stored\n2. Clear malicious stored content\n3. Enable Content-Security-Policy headers\n\n**Prevention:**\n• Encode all user-supplied output (HTML entities)\n• Implement strict CSP headers\n• Use DOMPurify for sanitization\n• Set HttpOnly and Secure cookie flags`;
  }

  // --- Port scan ---
  if (/port.?scan|reconnaissance|network.*scan/i.test(msg)) {
    return `**🟠 Port Scanning — Explained**\n\nPort scanning is used by attackers to discover open services and potential vulnerabilities on a target system.\n\n**What it means:**\n• Attacker is mapping your network topology\n• Identifying running services (SSH on 22, HTTP on 80, MySQL on 3306)\n• Preparing for a more targeted attack\n• Often precedes exploitation attempts\n\n**Common tools used:** Nmap, Masscan, Zmap\n\n**Immediate Actions:**\n1. Block the scanning IP at perimeter firewall\n2. Review which ports are actually exposed to the internet\n3. Close all unnecessary ports\n\n**Prevention:**\n• Use a firewall (block all, allow specific)\n• Enable IDS/IPS (Snort, Suricata)\n• Use port knocking for sensitive services\n• Deploy honeypots to detect reconnaissance`;
  }

  // --- DDoS ---
  if (/ddos|denial.?of.?service|flood|traffic.*attack/i.test(msg)) {
    return `**🔴 DDoS Attack — Explained**\n\nA Distributed Denial of Service (DDoS) attack floods your server with traffic to exhaust resources and make services unavailable.\n\n**Impact:**\n• Server becomes unresponsive to legitimate users\n• Revenue loss during downtime\n• Can mask other attacks happening simultaneously\n\n**Detection:** Abnormally high requests per second from single/multiple IPs\n\n**Immediate Mitigation:**\n1. 🛡️ Enable DDoS protection (Cloudflare, AWS Shield)\n2. 🔧 Configure rate limiting on your load balancer\n3. 🚫 Block offending IP ranges (CIDR blocks)\n4. 📞 Contact upstream ISP for traffic scrubbing\n\n**Long-term Prevention:**\n• CDN with DDoS mitigation\n• Auto-scaling infrastructure\n• Anycast network diffusion\n• Traffic anomaly detection`;
  }

  // --- Malware/C2 ---
  if (/malware|c2|command.*control|botnet|trojan|ransomware/i.test(msg)) {
    return `**🔴 Malware C2 Communication — CRITICAL**\n\nCommand & Control (C2) communication indicates a host on your network is infected with malware reporting to an attacker's server.\n\n**What this means:**\n• A device is compromised (infected host)\n• Attacker has remote access to the system\n• Data may already be exfiltrated\n• Ransomware deployment may be imminent\n\n**IMMEDIATE Actions (treat as incident):**\n1. 🔌 **Physically isolate** the infected host NOW\n2. 🚫 Block C2 IP/domain at firewall\n3. 📸 Preserve forensic image before cleanup\n4. 🔒 Reset all credentials from that host\n5. 📢 Escalate to incident response team\n6. 🕵️ Check all systems for lateral movement\n\n**Do NOT:**\n• Reboot the machine (may clear volatile evidence)\n• Connect it to other networks\n• Ignore this — it is critical`;
  }

  // --- Data exfiltration ---
  if (/exfiltrat|data.*transfer|data.*theft|data.*breach/i.test(msg)) {
    return `**🔴 Data Exfiltration — CRITICAL**\n\nSuspicious large outbound data transfers may indicate unauthorized data theft.\n\n**Potential Consequences:**\n• Customer PII data exposed\n• Intellectual property theft\n• Regulatory violations (GDPR, HIPAA, PCI-DSS)\n• Financial and reputational damage\n\n**Immediate Response:**\n1. Block the destination IP at firewall\n2. Isolate the source host\n3. Identify what data was accessed/transferred\n4. Assess breach notification requirements\n5. Engage legal/compliance team\n6. Contact cyber insurance provider\n\n**Investigation:**\n• Review DLP (Data Loss Prevention) logs\n• Check SIEM for access patterns\n• Identify user account associated with transfer\n• Determine entry vector (how attacker got in)`;
  }

  // --- Action/recommendation ---
  if (/what.*action|what.*do|recommend|should.*do|next.*step|remediat/i.test(msg)) {
    if (threats.length === 0) {
      return `**No active threats** — no specific actions needed at this time.\n\n**General Security Best Practices:**\n1. Keep all software and OS updated\n2. Enable Multi-Factor Authentication\n3. Regular log monitoring and SIEM alerts\n4. Network segmentation\n5. Principle of least privilege\n6. Regular penetration testing`;
    }
    const topThreats = threats.slice(0, 3);
    return `**🛡️ Recommended Immediate Actions**\n\nBased on detected threats:\n\n${topThreats.map((t, i) => `**${i + 1}. ${t.type} (${t.severity}):**\n   ${t.recommendation.split(".")[0]}`).join("\n\n")}\n\n**Universal Actions:**\n• 🔥 Review and update firewall rules\n• 📊 Enable real-time SIEM alerting\n• 🔑 Enforce MFA across all accounts\n• 📋 Conduct a post-incident review\n• 🔍 Scan all systems for indicators of compromise`;
  }

  // --- Explain generic ---
  if (/explain|what is|describe|tell me about/i.test(msg)) {
    const threat = threats.find((t) =>
      msg.includes(t.type.toLowerCase()) ||
      t.type.split(" ").some((word) => msg.includes(word.toLowerCase()))
    );
    if (threat) {
      return `**${threat.type} — Detailed Analysis**\n\n**Detection:** ${threat.message}\n\n**Severity:** ${threat.severity}\n**Source IP:** \`${threat.ip}\`\n**First Seen:** ${threat.timestamp}\n\n**Why this is dangerous:**\nThis type of attack can lead to unauthorized access, data breaches, or system compromise if not addressed immediately.\n\n**Recommended Response:**\n${threat.recommendation}`;
    }
    return `I can explain any cybersecurity threat or concept. Try being more specific:\n\n• *"Explain brute force attack"*\n• *"What is SQL injection?"*\n• *"Explain the port scan detection"*\n• *"What is a C2 server?"*\n\nOr upload a log file and I'll explain the specific threats found.`;
  }

  // --- Default fallback ---
  if (threats.length > 0) {
    return `I understand you're asking about: **"${userMessage}"**\n\nBased on the current analysis, your system has **${threats.length} detected threats** (${threats.filter((t) => t.severity === "High").length} high severity).\n\nI can help you with:\n• **Threat explanations** — Ask "explain [threat name]"\n• **Action plans** — Ask "what action should I take?"\n• **Security advice** — Ask about specific attack types\n• **Threat summary** — Ask "show me recent threats"\n\nWhat would you like to know more about?`;
  }

  return `I understand your query: **"${userMessage}"**\n\nI'm your AI-powered SOC assistant. To provide the most relevant security analysis:\n\n1. **Upload a log file** to detect real threats in your system\n2. Ask me about specific threats like *"What is brute force?"*\n3. Or ask *"What are best practices for server security?"*\n\nHow can I assist you today?`;
}
