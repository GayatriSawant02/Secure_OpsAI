// ============================================================
// SecureOps AI – Threat Intelligence Panel
// ============================================================

import { useState, useMemo } from "react";
import { Search, Filter, Download, Trash2, AlertTriangle, ChevronDown } from "lucide-react";
import { ThreatCard } from "./ThreatCard";
import { useSecurityStore } from "@/stores/securityStore";
import type { Severity } from "@/types";
import { cn } from "@/lib/utils";
import { SEVERITY_COLORS } from "@/constants";

type SortOption = "severity" | "timestamp" | "type" | "ip";
type FilterSeverity = Severity | "All";

export function ThreatPanel() {
  const { allThreats, clearThreats, currentAnalysis } = useSecurityStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<FilterSeverity>("All");
  const [sortBy, setSortBy] = useState<SortOption>("severity");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort
  const filteredThreats = useMemo(() => {
    let threats = [...allThreats];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      threats = threats.filter(
        (t) =>
          t.type.toLowerCase().includes(q) ||
          t.ip.includes(q) ||
          t.message.toLowerCase().includes(q)
      );
    }

    // Severity filter
    if (severityFilter !== "All") {
      threats = threats.filter((t) => t.severity === severityFilter);
    }

    // Sort
    const severityOrder: Record<Severity, number> = { High: 4, Medium: 3, Low: 2, Info: 1 };
    threats.sort((a, b) => {
      switch (sortBy) {
        case "severity":
          return (severityOrder[b.severity as Severity] || 0) - (severityOrder[a.severity as Severity] || 0);
        case "timestamp":
          return b.timestamp.localeCompare(a.timestamp);
        case "type":
          return a.type.localeCompare(b.type);
        case "ip":
          return a.ip.localeCompare(b.ip);
        default:
          return 0;
      }
    });

    return threats;
  }, [allThreats, searchQuery, severityFilter, sortBy]);

  const handleExport = () => {
    const data = JSON.stringify(allThreats, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `secureops-threats-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const SEVERITY_FILTERS: FilterSeverity[] = ["All", "High", "Medium", "Low", "Info"];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-ops-text font-semibold text-lg">Threat Intelligence Center</h2>
          <p className="text-ops-text-muted text-sm mt-0.5">
            {allThreats.length > 0
              ? `${allThreats.length} threats detected • ${currentAnalysis?.fileName || "Last scan"}`
              : "No threats detected yet — upload a log file to begin"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {allThreats.length > 0 && (
            <>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 cyber-btn-ghost text-xs py-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <button
                onClick={clearThreats}
                className="flex items-center gap-1.5 border border-sev-high/30 text-sev-high text-xs px-3 py-1.5 rounded-md hover:bg-sev-high-bg transition-all duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Summary badges */}
      {allThreats.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(["All", "High", "Medium", "Low"] as FilterSeverity[]).map((sev) => {
            const count = sev === "All"
              ? allThreats.length
              : allThreats.filter((t) => t.severity === sev).length;
            const colors = sev === "All" ? null : SEVERITY_COLORS[sev as Severity];
            return (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                  severityFilter === sev
                    ? sev === "All"
                      ? "bg-ops-cyan/10 border-ops-cyan/30 text-ops-cyan"
                      : `${colors?.bg} ${colors?.border} ${colors?.text}`
                    : "bg-ops-surface border-ops-border text-ops-text-muted hover:border-ops-border-light"
                )}
              >
                {colors && <span className={cn("w-1.5 h-1.5 rounded-full", colors.dot)} />}
                {sev} {count > 0 && <span className="font-mono">({count})</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Search and filters bar */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-ops-card border border-ops-border rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-ops-text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by threat type, IP, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-ops-text text-sm flex-1 outline-none placeholder:text-ops-text-muted font-mono min-w-0"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-ops-text-muted hover:text-ops-text">
              ✕
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 cyber-btn-ghost text-xs py-2 px-3"
          >
            <Filter className="w-3.5 h-3.5" />
            Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showFilters && (
            <div className="absolute right-0 top-full mt-1 bg-ops-card border border-ops-border rounded-lg shadow-card-shadow z-10 min-w-[140px]">
              {(["severity", "timestamp", "type", "ip"] as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSortBy(opt); setShowFilters(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs transition-colors",
                    sortBy === opt ? "text-ops-cyan bg-ops-cyan/5" : "text-ops-text-dim hover:bg-ops-surface hover:text-ops-text"
                  )}
                >
                  By {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Threat list */}
      {filteredThreats.length === 0 ? (
        <div className="cyber-card border border-ops-border rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-12 h-12 text-ops-text-muted mb-4 opacity-30" />
          <h3 className="text-ops-text font-semibold mb-2">
            {allThreats.length === 0 ? "No Threats Detected" : "No Results Match Filter"}
          </h3>
          <p className="text-ops-text-muted text-sm max-w-xs">
            {allThreats.length === 0
              ? "Upload a log file to begin threat analysis. The AI agent will automatically scan for security incidents."
              : "Try adjusting your search query or severity filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="ops-label">
              Showing {filteredThreats.length} of {allThreats.length} threats
            </span>
          </div>
          {filteredThreats.map((threat) => (
            <ThreatCard key={threat.id} threat={threat} />
          ))}
        </div>
      )}
    </div>
  );
}
