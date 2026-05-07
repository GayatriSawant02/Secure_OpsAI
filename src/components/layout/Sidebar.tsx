// ============================================================
// SecureOps AI – Sidebar Navigation
// ============================================================

import { Shield, LayoutDashboard, Upload, AlertTriangle, MessageSquare, Activity, Settings, ChevronRight } from "lucide-react";
import { useSecurityStore } from "@/stores/securityStore";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Log Upload", icon: Upload },
  { id: "threats", label: "Threat Center", icon: AlertTriangle },
  { id: "chat", label: "AI Assistant", icon: MessageSquare },
];

export function Sidebar() {
  const { activeTab, setActiveTab, stats } = useSecurityStore();

  return (
    <aside className="w-64 min-h-screen bg-ops-surface border-r border-ops-border flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-ops-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-ops-cyan/10 border border-ops-cyan/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-ops-cyan" />
          </div>
          <div>
            <span className="text-ops-text font-bold text-base tracking-tight">SecureOps</span>
            <span className="text-ops-cyan font-bold text-base"> AI</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="glow-dot w-1.5 h-1.5" />
              <span className="text-ops-text-muted font-mono text-[10px] uppercase tracking-wider">SOC Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="ops-label px-2 mb-3">Navigation</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badge =
            item.id === "threats" && stats.totalThreats > 0
              ? stats.totalThreats
              : undefined;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-ops-cyan/10 text-ops-cyan border border-ops-cyan/20"
                  : "text-ops-text-dim hover:text-ops-text hover:bg-ops-card"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-ops-cyan" : "text-ops-text-muted group-hover:text-ops-text-dim"
                )}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {badge !== undefined && (
                <span className="bg-sev-high text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
              {isActive && (
                <ChevronRight className="w-3 h-3 text-ops-cyan opacity-60" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Stats summary */}
      <div className="px-4 pb-4">
        <div className="cyber-card p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-ops-cyan" />
            <span className="ops-label text-[10px]">Threat Index</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="text-center bg-sev-high-bg rounded p-1.5">
              <div className="text-sev-high font-mono font-bold text-sm">{stats.highSeverity}</div>
              <div className="text-ops-text-muted text-[10px]">High</div>
            </div>
            <div className="text-center bg-sev-medium-bg rounded p-1.5">
              <div className="text-sev-medium font-mono font-bold text-sm">{stats.mediumSeverity}</div>
              <div className="text-ops-text-muted text-[10px]">Med</div>
            </div>
            <div className="text-center bg-sev-low-bg rounded p-1.5">
              <div className="text-sev-low font-mono font-bold text-sm">{stats.lowSeverity}</div>
              <div className="text-ops-text-muted text-[10px]">Low</div>
            </div>
          </div>
          {stats.lastScan && (
            <p className="text-ops-text-muted font-mono text-[10px]">
              Last scan: {new Date(stats.lastScan).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 border-t border-ops-border pt-3">
        <div className="flex items-center gap-2 text-ops-text-muted text-xs">
          <Settings className="w-3.5 h-3.5" />
          <span className="font-mono">v1.0.0 — Gemini AI</span>
        </div>
      </div>
    </aside>
  );
}
