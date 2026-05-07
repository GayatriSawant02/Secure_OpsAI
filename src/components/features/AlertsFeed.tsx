// ============================================================
// SecureOps AI – Recent Alerts Feed (Dashboard Widget)
// ============================================================

import { AlertTriangle, ChevronRight } from "lucide-react";
import { useSecurityStore } from "@/stores/securityStore";
import { ThreatCard } from "./ThreatCard";
import { cn } from "@/lib/utils";

export function AlertsFeed() {
  const { allThreats, setActiveTab } = useSecurityStore();
  const recentThreats = allThreats.slice(0, 5);

  return (
    <div className="cyber-card border border-ops-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ops-border bg-ops-surface/30">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-ops-cyan" />
          <span className="text-ops-text font-semibold text-sm">Recent Alerts</span>
          {allThreats.length > 0 && (
            <span className="bg-ops-cyan/10 text-ops-cyan text-xs px-1.5 py-0.5 rounded-full font-mono font-bold">
              {allThreats.length}
            </span>
          )}
        </div>
        {allThreats.length > 0 && (
          <button
            onClick={() => setActiveTab("threats")}
            className="flex items-center gap-1 text-ops-cyan text-xs hover:text-ops-cyan-dim transition-colors"
          >
            View All
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {recentThreats.length === 0 ? (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-ops-surface flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5 text-ops-text-muted opacity-40" />
            </div>
            <p className="text-ops-text-muted text-sm">No alerts yet</p>
            <p className="text-ops-text-muted text-xs mt-1">Upload logs to start monitoring</p>
          </div>
        ) : (
          recentThreats.map((threat) => (
            <ThreatCard key={threat.id} threat={threat} compact />
          ))
        )}
      </div>
    </div>
  );
}
