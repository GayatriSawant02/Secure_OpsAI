// ============================================================
// SecureOps AI – Main Dashboard Page
// ============================================================

import { StatsOverview } from "@/components/features/StatsOverview";
import { AlertsFeed } from "@/components/features/AlertsFeed";
import { ThreatDistributionChart } from "@/components/features/ThreatChart";
import { LogUpload } from "@/components/features/LogUpload";
import { ThreatPanel } from "@/components/features/ThreatPanel";
import { ChatBot } from "@/components/features/ChatBot";
import { useSecurityStore } from "@/stores/securityStore";
import { Upload, Shield, Activity, Zap } from "lucide-react";
import heroImg from "@/assets/hero-banner.jpg";

export function Dashboard() {
  const { activeTab, setActiveTab, stats } = useSecurityStore();

  return (
    <div className="flex-1 overflow-auto">
      {/* Hero Banner (Dashboard only) */}
      {activeTab === "dashboard" && (
        <div
          className="relative h-36 bg-cover bg-center border-b border-ops-border overflow-hidden"
          style={{ backgroundImage: `url(${heroImg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ops-bg/95 via-ops-bg/70 to-transparent" />
          <div className="scan-overlay" />
          <div className="relative h-full flex items-center px-6 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-ops-cyan" />
                <span className="ops-label">Security Operations Center</span>
              </div>
              <h1 className="text-ops-text text-2xl font-bold tracking-tight">
                Threat Intelligence Dashboard
              </h1>
              <p className="text-ops-text-dim text-sm mt-1 max-w-md">
                AI-powered log analysis and real-time threat detection — powered by Gemini AI
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="hidden md:flex items-center gap-3 ml-auto">
              <button
                onClick={() => setActiveTab("upload")}
                className="cyber-btn-primary flex items-center gap-2 text-sm py-2.5 px-4"
              >
                <Upload className="w-4 h-4" />
                Upload Logs
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className="cyber-btn-ghost flex items-center gap-2 text-sm py-2.5 px-4"
              >
                <Zap className="w-4 h-4" />
                Ask AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-5 space-y-5 max-w-[1400px]">
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats row */}
            <StatsOverview />

            {/* Middle section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Charts (2/3) */}
              <div className="lg:col-span-2 space-y-4">
                <ThreatDistributionChart />

                {/* System Activity */}
                <div className="cyber-card border border-ops-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-ops-cyan" />
                    <h3 className="text-ops-text font-semibold text-sm">Security Status</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Firewall", status: "Active", color: "text-ops-green" },
                      { label: "IDS/IPS", status: "Monitoring", color: "text-ops-cyan" },
                      { label: "Log Collector", status: "Running", color: "text-ops-green" },
                      {
                        label: "AI Engine",
                        status: stats.logsAnalyzed > 0 ? "Analyzed" : "Ready",
                        color: stats.logsAnalyzed > 0 ? "text-ops-cyan" : "text-ops-text-muted"
                      },
                    ].map((item) => (
                      <div key={item.label} className="bg-ops-surface rounded-lg p-3 border border-ops-border/50">
                        <div className={`font-mono text-xs font-bold ${item.color}`}>{item.status}</div>
                        <div className="text-ops-text-muted text-xs mt-0.5">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Alerts feed (1/3) */}
              <div>
                <AlertsFeed />
              </div>
            </div>

            {/* CTA if no data */}
            {stats.totalThreats === 0 && (
              <div className="cyber-card-glow border border-ops-cyan/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-ops-cyan/10 border border-ops-cyan/20 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-ops-cyan" />
                </div>
                <h3 className="text-ops-text font-bold text-lg mb-2">Start Monitoring Your System</h3>
                <p className="text-ops-text-muted text-sm max-w-md mx-auto mb-4">
                  Upload your system log files to start AI-powered threat detection. The agent will analyze patterns,
                  detect attacks, and provide actionable security recommendations.
                </p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="cyber-btn-primary inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Log File
                </button>
              </div>
            )}
          </>
        )}

        {/* UPLOAD TAB */}
        {activeTab === "upload" && <LogUpload />}

        {/* THREATS TAB */}
        {activeTab === "threats" && <ThreatPanel />}

        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <div className="cyber-card border border-ops-border rounded-xl overflow-hidden">
            <ChatBot />
          </div>
        )}
      </div>
    </div>
  );
}
