// ============================================================
// SecureOps AI – Application Constants
// ============================================================

export const APP_NAME = "SecureOps AI";
export const APP_VERSION = "1.0.0";

// Severity priority map
export const SEVERITY_PRIORITY: Record<string, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
  Info: 0,
};

// Color mapping by severity
export const SEVERITY_COLORS = {
  High: {
    text: "text-sev-high",
    bg: "bg-sev-high-bg",
    border: "border-sev-high-border",
    dot: "bg-sev-high",
    hex: "#ef4444",
  },
  Medium: {
    text: "text-sev-medium",
    bg: "bg-sev-medium-bg",
    border: "border-sev-medium-border",
    dot: "bg-sev-medium",
    hex: "#f97316",
  },
  Low: {
    text: "text-sev-low",
    bg: "bg-sev-low-bg",
    border: "border-sev-low-border",
    dot: "bg-sev-low",
    hex: "#eab308",
  },
  Info: {
    text: "text-sev-info",
    bg: "bg-sev-info-bg",
    border: "border-sev-info/30",
    dot: "bg-sev-info",
    hex: "#3b82f6",
  },
};

// Sample log files for demo
export const SAMPLE_LOG = `2024-01-15 08:23:41 [AUTH] Failed login attempt for user admin from IP 192.168.1.105
2024-01-15 08:23:42 [AUTH] Failed login attempt for user admin from IP 192.168.1.105
2024-01-15 08:23:43 [AUTH] Failed login attempt for user admin from IP 192.168.1.105
2024-01-15 08:23:44 [AUTH] Failed login attempt for user admin from IP 192.168.1.105
2024-01-15 08:23:45 [AUTH] Failed login attempt for user admin from IP 192.168.1.105
2024-01-15 08:23:46 [AUTH] Failed login attempt for user admin from IP 192.168.1.105
2024-01-15 08:23:47 [AUTH] Failed login attempt for user admin from IP 192.168.1.105
2024-01-15 08:23:48 [AUTH] Successful login for user admin from IP 192.168.1.105
2024-01-15 09:11:22 [HTTP] GET /admin/../../etc/passwd HTTP 404 from IP 10.0.0.34
2024-01-15 09:11:28 [HTTP] GET /admin/../../../etc/shadow HTTP 404 from IP 10.0.0.34
2024-01-15 09:14:05 [HTTP] POST /login username=admin&password='; DROP TABLE users;-- HTTP 400 from IP 172.16.4.22
2024-01-15 09:14:07 [HTTP] POST /search q=<script>alert(1)</script> HTTP 200 from IP 172.16.4.22
2024-01-15 09:20:18 [NET] Port scan detected from IP 203.0.113.42 ports: 22,23,80,443,3306,5432
2024-01-15 09:21:33 [NET] Port scan detected from IP 203.0.113.42 ports: 8080,8443,9000,27017
2024-01-15 09:45:00 [AUTH] Failed login attempt for user root from IP 198.51.100.7
2024-01-15 09:45:01 [AUTH] Failed login attempt for user root from IP 198.51.100.7
2024-01-15 09:45:02 [AUTH] Failed login attempt for user root from IP 198.51.100.7
2024-01-15 09:45:03 [AUTH] Failed login attempt for user root from IP 198.51.100.7
2024-01-15 09:45:04 [AUTH] Failed login attempt for user root from IP 198.51.100.7
2024-01-15 10:02:44 [NET] Outbound connection to known C2 server 185.220.101.45:4444 from host 10.0.1.55
2024-01-15 10:15:30 [HTTP] GET /wp-admin/ HTTP 200 from IP 91.108.4.12
2024-01-15 10:15:31 [HTTP] POST /wp-login.php HTTP 302 from IP 91.108.4.12
2024-01-15 10:30:00 [AUTH] User jsmith escalated privileges to sudo from IP 10.0.0.99
2024-01-15 10:30:05 [SYS] Unusual process: python3 -c "import socket..." started by user jsmith
2024-01-15 11:00:00 [NET] Large data transfer 2.3GB to external IP 45.33.32.156 from host 10.0.1.80
2024-01-15 11:02:00 [HTTP] 1450 requests in 10 seconds from IP 185.107.80.123
2024-01-15 11:02:01 [HTTP] 1523 requests in 10 seconds from IP 185.107.80.124
2024-01-15 11:30:15 [HTTP] GET /?cmd=ls%20-la HTTP 200 from IP 104.21.6.55
2024-01-15 11:30:20 [HTTP] GET /?cmd=cat%20/etc/passwd HTTP 200 from IP 104.21.6.55
2024-01-15 12:00:00 [AUTH] Successful login for user admin from IP 10.0.0.1
2024-01-15 12:05:00 [HTTP] GET /api/health HTTP 200 from IP 10.0.0.1
2024-01-15 12:10:00 [NET] Normal outbound HTTPS traffic to 142.250.80.46 from host 10.0.0.1`;

// AI chatbot canned responses map
export const CHAT_RESPONSE_TOPICS = [
  "brute force",
  "sql injection",
  "xss",
  "port scan",
  "ddos",
  "malware",
  "exfiltration",
  "privilege escalation",
  "explain",
  "recommend",
  "action",
  "threats",
  "recent",
  "high severity",
  "summary",
];
