// ============================================================
// SecureOps AI – Top Header Bar
// ============================================================

import { Bell, Search, RefreshCw, Shield } from "lucide-react";
import { useSecurityStore } from "@/stores/securityStore";
import { cn } from "@/lib/utils";

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Security Dashboard", subtitle: "Real-time threat monitoring & analytics" },
  upload: { title: "Log File Analysis", subtitle: "Upload and analyze system logs" },
  threats: { title: "Threat Intelligence Center", subtitle: "Detected threats and risk assessment" },
  chat: { title: "AI Security Assistant", subtitle: "Powered by Gemini AI — ask anything" },
};

export function Header() {
  const { activeTab, stats } = useSecurityStore();
  const current = TAB_TITLES[activeTab] || TAB_TITLES.dashboard;
  const hasAlerts = stats.highSeverity > 0;

  return (
    <header className="h-14 border-b border-ops-border bg-ops-surface/80 backdrop-blur-sm flex items-center px-6 gap-4">
      {/* Title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-ops-text font-semibold text-sm truncate">{current.title}</h1>
          {hasAlerts && (
            <span className="flex items-center gap-1 bg-sev-high-bg border border-sev-high-border text-sev-high text-xs px-2 py-0.5 rounded-full font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-sev-high animate-pulse-dot" />
              {stats.highSeverity} Critical
            </span>
          )}
        </div>
        <p className="text-ops-text-muted text-xs mt-0.5 truncate">{current.subtitle}</p>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-ops-card border border-ops-border rounded-md px-3 py-1.5 w-48 lg:w-64">
        <Search className="w-3.5 h-3.5 text-ops-text-muted flex-shrink-0" />
        <input
          type="text"
          placeholder="Search threats..."
          className="bg-transparent text-ops-text-dim text-sm flex-1 outline-none placeholder:text-ops-text-muted font-mono min-w-0"
        />
      </div>

      {/* System status */}
      <div className="hidden lg:flex items-center gap-2 border border-ops-green/20 bg-ops-green/5 px-3 py-1.5 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-ops-green animate-pulse-dot" />
        <span className="text-ops-green font-mono text-xs">Systems Nominal</span>
      </div>

      {/* Notification bell */}
      <button
        className={cn(
          "relative p-2 rounded-md transition-all duration-200",
          hasAlerts
            ? "bg-sev-high-bg border border-sev-high-border text-sev-high hover:bg-sev-high/20"
            : "text-ops-text-muted hover:text-ops-text hover:bg-ops-card"
        )}
        title="Alerts"
      >
        <Bell className="w-4 h-4" />
        {hasAlerts && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-sev-high rounded-full text-white text-[10px] font-bold flex items-center justify-center">
            {stats.highSeverity > 9 ? "9+" : stats.highSeverity}
          </span>
        )}
      </button>

      {/* Shield status */}
      <div className="flex items-center gap-2 pl-3 border-l border-ops-border">
        <div className="w-7 h-7 rounded-full bg-ops-cyan/10 border border-ops-cyan/30 flex items-center justify-center">
          <Shield className="w-3.5 h-3.5 text-ops-cyan" />
        </div>
        <div className="hidden sm:block">
          <div className="text-ops-text text-xs font-medium">Analyst</div>
          <div className="text-ops-text-muted text-[10px] font-mono">SOC Tier 1</div>
        </div>
      </div>
    </header>
  );
}
