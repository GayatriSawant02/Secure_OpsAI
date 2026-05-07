// ============================================================
// SecureOps AI – Core Type Definitions
// ============================================================

export type Severity = "High" | "Medium" | "Low" | "Info";

export type ThreatType =
  | "Brute Force Attack"
  | "SQL Injection"
  | "XSS Attempt"
  | "Port Scan"
  | "DDoS Attempt"
  | "Unauthorized Access"
  | "Suspicious Login"
  | "Malware Communication"
  | "Data Exfiltration"
  | "Privilege Escalation"
  | "Directory Traversal"
  | "Command Injection"
  | "Reconnaissance"
  | "Anomalous Traffic";

export interface Threat {
  id: string;
  type: ThreatType | string;
  severity: Severity;
  ip: string;
  timestamp: string;
  message: string;
  recommendation: string;
  rawLine?: string;
  count?: number;
  port?: string;
  user?: string;
  status?: string;
}

export interface LogAnalysisResult {
  threats: Threat[];
  totalLines: number;
  analyzedAt: string;
  fileName: string;
  summary: string;
  stats: {
    high: number;
    medium: number;
    low: number;
    info: number;
    total: number;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  status: "idle" | "uploading" | "analyzing" | "complete" | "error";
  errorMessage?: string;
}

export interface DashboardStats {
  totalThreats: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  uniqueIPs: number;
  logsAnalyzed: number;
  lastScan: string | null;
}

export type NavTab = "dashboard" | "upload" | "threats" | "chat";
