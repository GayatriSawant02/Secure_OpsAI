// ============================================================
// SecureOps AI – Individual Threat Card Component
// ============================================================

import { useState } from "react";
import { AlertTriangle, Shield, Globe, Clock, ChevronDown, ChevronUp, Copy, CheckCircle } from "lucide-react";
import type { Threat, Severity } from "@/types";
import { SEVERITY_COLORS } from "@/constants";
import { cn } from "@/lib/utils";

interface ThreatCardProps {
  threat: Threat;
  compact?: boolean;
}

const THREAT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Brute Force Attack": Shield,
  "SQL Injection": AlertTriangle,
  "XSS Attempt": AlertTriangle,
  "Port Scan": Globe,
};

export function ThreatCard({ threat, compact = false }: ThreatCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const colors = SEVERITY_COLORS[threat.severity as Severity] || SEVERITY_COLORS.Info;
  const Icon = THREAT_ICONS[threat.type] || AlertTriangle;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(threat.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 p-3 rounded-lg border", colors.bg, colors.border, "animate-fade-in-up")}>
        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", colors.dot)} style={{ boxShadow: `0 0 6px ${colors.hex}` }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-ops-text text-sm font-medium truncate">{threat.type}</span>
            <span className={cn("text-xs px-1.5 py-0.5 rounded font-mono font-medium flex-shrink-0", colors.text, colors.bg)}>
              {threat.severity}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-xs text-ops-text-muted">{threat.ip}</span>
            <span className="text-ops-text-muted text-xs">•</span>
            <span className="text-ops-text-muted text-xs truncate">{threat.timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "cyber-card border overflow-hidden transition-all duration-200",
        colors.border,
        "hover:shadow-lg animate-fade-in-up"
      )}
      style={{ borderColor: `rgba(${threat.severity === "High" ? "239,68,68" : threat.severity === "Medium" ? "249,115,22" : "234,179,8"}, 0.2)` }}
    >
      {/* Header */}
      <div
        className={cn("flex items-start gap-3 p-4 cursor-pointer", colors.bg)}
        onClick={() => setExpanded(!expanded)}
      >
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", colors.bg, "border", colors.border)}>
          <Icon className={cn("w-4 h-4", colors.text)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-ops-text font-semibold text-sm">{threat.type}</h3>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-mono font-bold flex-shrink-0", colors.text, colors.bg, "border", colors.border)}>
              {threat.severity}
            </span>
            {threat.count && threat.count > 1 && (
              <span className="bg-ops-surface text-ops-text-dim text-xs px-1.5 py-0.5 rounded font-mono">
                ×{threat.count}
              </span>
            )}
          </div>
          <p className="text-ops-text-dim text-xs mt-1 leading-relaxed">{threat.message}</p>
        </div>

        <button className="text-ops-text-muted flex-shrink-0 hover:text-ops-text transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Meta info row */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-ops-border/50 bg-ops-surface/50">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-ops-text-muted" />
          <span className="font-mono text-xs text-ops-cyan">{threat.ip}</span>
          <button onClick={handleCopy} className="text-ops-text-muted hover:text-ops-cyan transition-colors ml-0.5">
            {copied ? <CheckCircle className="w-3 h-3 text-ops-green" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-ops-text-muted" />
          <span className="font-mono text-xs text-ops-text-muted">{threat.timestamp}</span>
        </div>
        {threat.user && (
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-ops-text-muted" />
            <span className="font-mono text-xs text-ops-text-muted">{threat.user}</span>
          </div>
        )}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 pt-3 border-t border-ops-border/50 animate-fade-in-up space-y-3">
          {/* Recommendation */}
          <div>
            <p className="ops-label mb-1.5">Recommended Action</p>
            <div className="bg-ops-surface rounded-lg p-3 border border-ops-border">
              <p className="text-ops-text-dim text-xs leading-relaxed">{threat.recommendation}</p>
            </div>
          </div>

          {/* Raw log line */}
          {threat.rawLine && (
            <div>
              <p className="ops-label mb-1.5">Raw Log Entry</p>
              <div className="bg-ops-bg rounded p-3 border border-ops-border font-mono text-xs text-ops-text-muted break-all">
                {threat.rawLine}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
