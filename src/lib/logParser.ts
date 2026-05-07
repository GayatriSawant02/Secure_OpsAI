// ============================================================
// SecureOps AI – Log Parser
// Extracts structured data from raw log lines
// ============================================================

export interface ParsedLogLine {
  timestamp: string;
  category: string;
  message: string;
  ip: string | null;
  user: string | null;
  port: string | null;
  status: string | null;
  rawLine: string;
}

// IP address regex
const IP_REGEX = /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g;

// Timestamp patterns
const TIMESTAMP_REGEX = /(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)/;

// Category/tag pattern like [AUTH], [HTTP], [NET], [SYS]
const CATEGORY_REGEX = /\[([A-Z]{2,10})\]/;

// User extraction
const USER_PATTERNS = [
  /for user (\w+)/i,
  /user[=: ]+['"]?(\w+)['"]?/i,
  /username[=: ]+['"]?(\w[\w.@-]+)['"]?/i,
];

// Port extraction
const PORT_REGEX = /(?:port[s]?[: ]+)([\d,\s]+)/i;

// HTTP Status
const HTTP_STATUS_REGEX = /HTTP[/ ]?\d*\s+(\d{3})/i;

/**
 * Parse a single log line into structured data
 */
export function parseLogLine(line: string): ParsedLogLine {
  const trimmed = line.trim();

  // Extract timestamp
  const tsMatch = TIMESTAMP_REGEX.exec(trimmed);
  const timestamp = tsMatch ? tsMatch[1] : new Date().toISOString();

  // Extract category
  const catMatch = CATEGORY_REGEX.exec(trimmed);
  const category = catMatch ? catMatch[1] : "UNKNOWN";

  // Extract all IPs
  const ipMatches = trimmed.match(IP_REGEX);
  const ip = ipMatches ? ipMatches[0] : null;

  // Extract user
  let user: string | null = null;
  for (const pattern of USER_PATTERNS) {
    const m = pattern.exec(trimmed);
    if (m) { user = m[1]; break; }
  }

  // Extract port
  const portMatch = PORT_REGEX.exec(trimmed);
  const port = portMatch ? portMatch[1].trim() : null;

  // Extract HTTP status
  const statusMatch = HTTP_STATUS_REGEX.exec(trimmed);
  const status = statusMatch ? statusMatch[1] : null;

  // Strip timestamp and category for message
  let message = trimmed
    .replace(TIMESTAMP_REGEX, "")
    .replace(CATEGORY_REGEX, "")
    .trim();

  return { timestamp, category, message, ip, user, port, status, rawLine: trimmed };
}

/**
 * Parse entire log file content into structured lines
 */
export function parseLogFile(content: string): ParsedLogLine[] {
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  return lines.map(parseLogLine);
}

/**
 * Extract unique IPs from parsed lines
 */
export function extractUniqueIPs(lines: ParsedLogLine[]): string[] {
  const ips = new Set<string>();
  lines.forEach((l) => { if (l.ip) ips.add(l.ip); });
  return Array.from(ips);
}
