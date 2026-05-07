// ============================================================
// SecureOps AI – Threat Detector
// Rule-based threat detection engine
// ============================================================

import { ParsedLogLine, parseLogFile } from "./logParser";
import type { Threat, Severity, LogAnalysisResult } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Helper: generate a unique ID (fallback if uuid not available)
function genId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// -------------------------------------------------------
// Detection Rules
// -------------------------------------------------------

interface DetectionRule {
  name: string;
  severity: Severity;
  detect: (line: ParsedLogLine, allLines: ParsedLogLine[], index: number) => boolean;
  message: (line: ParsedLogLine) => string;
  recommendation: string;
}

const BRUTE_FORCE_THRESHOLD = 5; // failed logins per IP

const rules: DetectionRule[] = [
  // 1. Brute Force Attack
  {
    name: "Brute Force Attack",
    severity: "High",
    detect: (line, allLines) => {
      if (!line.ip) return false;
      const failedLogins = allLines.filter(
        (l) =>
          l.ip === line.ip &&
          /failed login/i.test(l.message)
      );
      return (
        /failed login/i.test(line.message) &&
        failedLogins.length >= BRUTE_FORCE_THRESHOLD
      );
    },
    message: (line) =>
      `Multiple failed login attempts detected from ${line.ip}${line.user ? ` for user "${line.user}"` : ""}`,
    recommendation:
      "Immediately block IP address. Enable account lockout policy after 3 failed attempts. Enable MFA for all accounts. Review access logs for potential compromise.",
  },

  // 2. SQL Injection
  {
    name: "SQL Injection",
    severity: "High",
    detect: (line) =>
      /('|--|;|union\s+select|drop\s+table|insert\s+into|exec\s*\(|xp_cmd)/i.test(line.message),
    message: (line) =>
      `SQL injection pattern detected in request from ${line.ip || "unknown IP"}`,
    recommendation:
      "Block the source IP immediately. Review and patch input validation. Use parameterized queries. Enable WAF (Web Application Firewall). Audit database for unauthorized changes.",
  },

  // 3. XSS Attempt
  {
    name: "XSS Attempt",
    severity: "Medium",
    detect: (line) =>
      /<script|javascript:|onerror=|onload=|<img[^>]+src=|alert\(/i.test(line.message),
    message: (line) =>
      `Cross-site scripting (XSS) payload detected from ${line.ip || "unknown IP"}`,
    recommendation:
      "Enable Content-Security-Policy headers. Sanitize all user inputs. Encode output. Review affected pages for successful injection. Consider WAF rules.",
  },

  // 4. Directory Traversal
  {
    name: "Directory Traversal",
    severity: "High",
    detect: (line) =>
      /\.\.[\/\\]|%2e%2e[\/\\]|\.\.%2f|%2e%2e%2f/i.test(line.message),
    message: (line) =>
      `Directory traversal attempt detected from ${line.ip || "unknown IP"} — trying to access sensitive files`,
    recommendation:
      "Block source IP. Validate and sanitize file path inputs. Restrict web server to document root. Review accessed files for data exposure. Patch vulnerable application endpoints.",
  },

  // 5. Port Scan
  {
    name: "Port Scan",
    severity: "Medium",
    detect: (line) =>
      /port scan/i.test(line.message) ||
      (/ports?[: ]/i.test(line.message) && /\d+,\d+/.test(line.message)),
    message: (line) =>
      `Port scanning activity detected from ${line.ip || "unknown IP"} — network reconnaissance underway`,
    recommendation:
      "Block the scanning IP at firewall level. Enable IDS/IPS alerting for port scans. Review open ports and close unnecessary services. Investigate whether scan preceded an attack.",
  },

  // 6. Command Injection
  {
    name: "Command Injection",
    severity: "High",
    detect: (line) =>
      /cmd=|exec=|system\(|shell_exec|%60|;ls|;cat|&&ls|&&cat|\|ls|\|cat/i.test(line.message),
    message: (line) =>
      `Command injection attempt from ${line.ip || "unknown IP"} — possible remote code execution`,
    recommendation:
      "Block IP immediately. Disable dangerous functions (exec, system, shell_exec). Implement input validation. Review server for signs of RCE. Conduct forensic analysis.",
  },

  // 7. DDoS / High Volume Traffic
  {
    name: "DDoS Attempt",
    severity: "High",
    detect: (line) =>
      /(\d{3,4})\s+requests?\s+in\s+10\s+seconds?/i.test(line.message) ||
      (/requests/i.test(line.message) && parseInt(line.message.match(/(\d+)\s+request/i)?.[1] || "0") > 500),
    message: (line) =>
      `Potential DDoS attack from ${line.ip || "unknown IP"} — abnormally high request rate detected`,
    recommendation:
      "Enable rate limiting immediately. Configure DDoS protection/CDN (Cloudflare). Block offending IP ranges. Scale infrastructure if under active attack. Alert network team.",
  },

  // 8. Malware C2 Communication
  {
    name: "Malware Communication",
    severity: "High",
    detect: (line) =>
      /c2 server|command.and.control|:4444|:1337|:31337|botnet/i.test(line.message),
    message: (line) =>
      `Outbound connection to suspected C2 (Command & Control) server from ${line.ip || "internal host"}`,
    recommendation:
      "Immediately isolate the affected host. Block C2 IP/domain at firewall. Run full malware scan. Preserve forensic evidence. Escalate to incident response team. Reset credentials.",
  },

  // 9. Data Exfiltration
  {
    name: "Data Exfiltration",
    severity: "High",
    detect: (line) =>
      /large data transfer|exfiltrat|(\d+(?:\.\d+)?)\s*GB\s+to\s+external/i.test(line.message),
    message: (line) =>
      `Suspicious large data transfer to external IP detected — possible data exfiltration`,
    recommendation:
      "Block the external IP. Isolate the source host. Identify what data was transferred. Report potential data breach per compliance requirements. Engage incident response.",
  },

  // 10. Privilege Escalation
  {
    name: "Privilege Escalation",
    severity: "Medium",
    detect: (line) =>
      /escalat|sudo|su root|privilege|chmod 777|chown root/i.test(line.message),
    message: (line) =>
      `Privilege escalation detected — user ${line.user || "unknown"} gained elevated permissions`,
    recommendation:
      "Review if privilege escalation was authorized. Revoke unnecessary sudo privileges. Audit sudoers file. Enable PAM logging. Investigate associated activity from this user.",
  },

  // 11. Suspicious Login (outside hours / unusual IP)
  {
    name: "Suspicious Login",
    severity: "Low",
    detect: (line) =>
      /successful login/i.test(line.message) &&
      !/10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+/.test(line.ip || ""),
    message: (line) =>
      `Successful login from external/unusual IP ${line.ip || "unknown"} for user ${line.user || "unknown"}`,
    recommendation:
      "Verify with the user if login was expected. If not authorized, lock account immediately. Enable geo-restriction if applicable. Review session activity.",
  },

  // 12. Reconnaissance / Admin probing
  {
    name: "Reconnaissance",
    severity: "Low",
    detect: (line) =>
      /\/wp-admin|\/phpmyadmin|\/admin\/|\.env|\/\.git|\/backup|\/config\.php/i.test(line.message) &&
      !/10\.\d+\.\d+\.\d+|192\.168/.test(line.ip || ""),
    message: (line) =>
      `Reconnaissance activity — probing admin/sensitive endpoints from ${line.ip || "unknown IP"}`,
    recommendation:
      "Block the probing IP. Ensure admin pages are IP-restricted. Remove or hide sensitive files from web root. Review access logs for successful probes.",
  },
];

// -------------------------------------------------------
// Main Analysis Function
// -------------------------------------------------------

/**
 * Analyze log file content and return detected threats
 */
export function analyzeLogContent(
  content: string,
  fileName: string
): LogAnalysisResult {
  const lines = parseLogFile(content);
  const detected: Threat[] = [];
  const seenKeys = new Set<string>(); // Prevent duplicate threats per IP+type

  lines.forEach((line, index) => {
    for (const rule of rules) {
      try {
        if (rule.detect(line, lines, index)) {
          // Dedup key = rule name + IP
          const key = `${rule.name}::${line.ip || "unknown"}`;
          if (seenKeys.has(key)) continue;
          seenKeys.add(key);

          // Count occurrences
          let count = 1;
          if (rule.name === "Brute Force Attack" && line.ip) {
            count = lines.filter(
              (l) => l.ip === line.ip && /failed login/i.test(l.message)
            ).length;
          }

          detected.push({
            id: genId(),
            type: rule.name,
            severity: rule.severity,
            ip: line.ip || "Unknown",
            timestamp: line.timestamp,
            message: rule.message(line),
            recommendation: rule.recommendation,
            rawLine: line.rawLine,
            count,
            port: line.port || undefined,
            user: line.user || undefined,
            status: line.status || undefined,
          });
        }
      } catch {
        // Continue on rule error
      }
    }
  });

  // Sort by severity
  const order: Record<Severity, number> = { High: 3, Medium: 2, Low: 1, Info: 0 };
  detected.sort((a, b) => order[b.severity as Severity] - order[a.severity as Severity]);

  const stats = {
    high: detected.filter((t) => t.severity === "High").length,
    medium: detected.filter((t) => t.severity === "Medium").length,
    low: detected.filter((t) => t.severity === "Low").length,
    info: detected.filter((t) => t.severity === "Info").length,
    total: detected.length,
  };

  const summary = generateSummary(detected, lines.length, fileName);

  return {
    threats: detected,
    totalLines: lines.length,
    analyzedAt: new Date().toISOString(),
    fileName,
    summary,
    stats,
  };
}

/**
 * Generate a human-readable summary of detected threats
 */
function generateSummary(threats: Threat[], totalLines: number, fileName: string): string {
  if (threats.length === 0) {
    return `Analysis of "${fileName}" (${totalLines} log entries) completed. No significant threats detected. System appears normal.`;
  }

  const high = threats.filter((t) => t.severity === "High");
  const medium = threats.filter((t) => t.severity === "Medium");
  const uniqueIPs = new Set(threats.map((t) => t.ip)).size;
  const types = [...new Set(threats.map((t) => t.type))];

  let summary = `Analysis of "${fileName}" (${totalLines} log entries) detected **${threats.length} security incidents** from **${uniqueIPs} unique IP addresses**. `;

  if (high.length > 0) {
    summary += `⚠️ **${high.length} CRITICAL HIGH-severity** threats require immediate attention, including ${high[0].type}. `;
  }
  if (medium.length > 0) {
    summary += `${medium.length} medium-severity issues detected. `;
  }

  summary += `Threat categories: ${types.slice(0, 4).join(", ")}${types.length > 4 ? ` and ${types.length - 4} more` : ""}.`;

  if (high.length > 0) {
    summary += ` **Immediate action recommended.**`;
  }

  return summary;
}
