// ============================================================
// SecureOps AI – Dashboard Stats Overview Cards
// ============================================================

import { AlertTriangle, Shield, Activity, Globe, FileText, Clock } from "lucide-react";
import { useSecurityStore } from "@/stores/securityStore";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "danger" | "warning" | "info" | "success";
  trend?: string;
}

function StatCard({ title, value, subtitle, icon: Icon, variant = "default", trend }: StatCardProps) {
  const variants = {
    default: "border-ops-border",
    danger: "border-sev-high/30",
    warning: "border-sev-medium/30",
    info: "border-ops-cyan/30",
    success: "border-ops-green/30",
  };

  const iconVariants = {
    default: "text-ops-text-muted bg-ops-border",
    danger: "text-sev-high bg-sev-high-bg",
    warning: "text-sev-medium bg-sev-medium-bg",
    info: "text-ops-cyan bg-ops-cyan-glow",
    success: "text-ops-green bg-ops-green/10",
  };

  const valueVariants = {
    default: "text-ops-text",
    danger: "text-sev-high",
    warning: "text-sev-medium",
    info: "text-ops-cyan",
    success: "text-ops-green",
  };

  return (
    <div className={cn("cyber-card p-4 border", variants[variant], "animate-fade-in-up")}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", iconVariants[variant])}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <span className="text-ops-text-muted font-mono text-[10px] bg-ops-surface px-1.5 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>
      <div className={cn("text-2xl font-bold font-mono mb-1", valueVariants[variant])}>
        {value}
      </div>
      <div className="text-ops-text text-sm font-medium">{title}</div>
      {subtitle && <div className="text-ops-text-muted text-xs mt-0.5">{subtitle}</div>}
    </div>
  );
}

export function StatsOverview() {
  const { stats } = useSecurityStore();

  const cards: StatCardProps[] = [
    {
      title: "Total Threats",
      value: stats.totalThreats,
      subtitle: "Across all scans",
      icon: AlertTriangle,
      variant: stats.totalThreats > 0 ? "danger" : "default",
      trend: "Current",
    },
    {
      title: "High Severity",
      value: stats.highSeverity,
      subtitle: "Requires immediate action",
      icon: Shield,
      variant: stats.highSeverity > 0 ? "danger" : "default",
      trend: "Critical",
    },
    {
      title: "Medium Severity",
      value: stats.mediumSeverity,
      subtitle: "Needs investigation",
      icon: Activity,
      variant: stats.mediumSeverity > 0 ? "warning" : "default",
      trend: "Warning",
    },
    {
      title: "Unique Attacker IPs",
      value: stats.uniqueIPs,
      subtitle: "Distinct source addresses",
      icon: Globe,
      variant: stats.uniqueIPs > 0 ? "info" : "default",
      trend: "Tracked",
    },
    {
      title: "Logs Analyzed",
      value: stats.logsAnalyzed,
      subtitle: "Total files processed",
      icon: FileText,
      variant: "success",
      trend: "All time",
    },
    {
      title: "Last Scan",
      value: stats.lastScan
        ? new Date(stats.lastScan).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "—",
      subtitle: stats.lastScan ? new Date(stats.lastScan).toLocaleDateString() : "No scans yet",
      icon: Clock,
      variant: "info",
      trend: "Recent",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
