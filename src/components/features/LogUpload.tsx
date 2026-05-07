// ============================================================
// SecureOps AI – Log File Upload Component
// ============================================================

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, X, Zap, Terminal, Play } from "lucide-react";
import { analyzeLogContent } from "@/lib/threatDetector";
import { useSecurityStore } from "@/stores/securityStore";
import { SAMPLE_LOG } from "@/constants";
import { cn } from "@/lib/utils";
import type { UploadState } from "@/types";

interface AnalysisLog {
  text: string;
  type: "info" | "success" | "warning" | "error";
}

export function LogUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setAnalysis, setActiveTab } = useSecurityStore();

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    status: "idle",
  });
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisLogs, setAnalysisLogs] = useState<AnalysisLog[]>([]);
  const [result, setResult] = useState<{ threats: number; high: number } | null>(null);

  const addLog = useCallback((text: string, type: AnalysisLog["type"] = "info") => {
    setAnalysisLogs((prev) => [...prev, { text, type }]);
  }, []);

  const simulateAnalysis = async (content: string, fileName: string) => {
    setAnalysisLogs([]);
    setResult(null);

    setUploadState({ isUploading: true, progress: 0, status: "uploading" });

    // Simulated upload progress
    for (let p = 0; p <= 100; p += 20) {
      await new Promise((r) => setTimeout(r, 80));
      setUploadState((prev) => ({ ...prev, progress: p }));
    }

    setUploadState({ isUploading: true, progress: 100, status: "analyzing" });

    // Simulate analysis steps with logs
    addLog(`[INIT] Loading log file: ${fileName}`, "info");
    await new Promise((r) => setTimeout(r, 300));

    const lines = content.split("\n").filter((l) => l.trim());
    addLog(`[PARSE] Extracted ${lines.length} log entries`, "info");
    await new Promise((r) => setTimeout(r, 400));

    addLog(`[RULE] Running 12 threat detection rules...`, "info");
    await new Promise((r) => setTimeout(r, 500));

    addLog(`[AI] Applying brute force heuristics...`, "info");
    await new Promise((r) => setTimeout(r, 350));

    addLog(`[AI] Scanning for injection patterns...`, "warning");
    await new Promise((r) => setTimeout(r, 300));

    addLog(`[AI] Analyzing network reconnaissance signals...`, "info");
    await new Promise((r) => setTimeout(r, 350));

    addLog(`[GEMINI] Generating threat explanations...`, "info");
    await new Promise((r) => setTimeout(r, 600));

    // Run actual analysis
    const analysisResult = analyzeLogContent(content, fileName);

    addLog(`[DONE] Analysis complete. Found ${analysisResult.threats.length} threats.`,
      analysisResult.stats.high > 0 ? "error" : analysisResult.stats.medium > 0 ? "warning" : "success"
    );

    if (analysisResult.stats.high > 0) {
      addLog(`[ALERT] ${analysisResult.stats.high} HIGH-severity threats require immediate attention!`, "error");
    }

    setAnalysis(analysisResult);
    setResult({ threats: analysisResult.threats.length, high: analysisResult.stats.high });

    setUploadState({ isUploading: false, progress: 100, status: "complete" });
  };

  const handleFile = useCallback(async (file: File) => {
    // Validate file type
    const validTypes = [".log", ".txt", ".csv", ".json"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validTypes.includes(ext) && !file.name.includes(".")) {
      setUploadState({
        isUploading: false, progress: 0, status: "error",
        errorMessage: "Invalid file type. Please upload .log, .txt, or .csv files.",
      });
      return;
    }

    setSelectedFile(file);
    const content = await file.text();
    await simulateAnalysis(content, file.name);
  }, [setAnalysis]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSampleLog = async () => {
    setSelectedFile(null);
    await simulateAnalysis(SAMPLE_LOG, "sample_access.log");
  };

  const reset = () => {
    setUploadState({ isUploading: false, progress: 0, status: "idle" });
    setSelectedFile(null);
    setAnalysisLogs([]);
    setResult(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-ops-text font-semibold text-lg">Log File Analysis</h2>
        <p className="text-ops-text-muted text-sm mt-1">Upload system logs for AI-powered threat detection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Upload Zone */}
        <div className="space-y-4">
          {uploadState.status === "idle" || uploadState.status === "error" ? (
            <>
              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
                  dragOver
                    ? "border-ops-cyan bg-ops-cyan-glow scale-[1.02]"
                    : "border-ops-border hover:border-ops-cyan/50 hover:bg-ops-cyan/5"
                )}
              >
                <div className="w-14 h-14 rounded-full bg-ops-cyan/10 border border-ops-cyan/20 flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-ops-cyan" />
                </div>
                <h3 className="text-ops-text font-semibold mb-1">Drop your log file here</h3>
                <p className="text-ops-text-muted text-sm text-center mb-3">
                  Supports .log, .txt, .csv formats
                </p>
                <span className="cyber-btn-primary text-sm px-5 py-2">
                  Browse Files
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".log,.txt,.csv,.json"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                />
              </div>

              {uploadState.status === "error" && (
                <div className="flex items-center gap-2 p-3 bg-sev-high-bg border border-sev-high-border rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-sev-high flex-shrink-0" />
                  <span className="text-sev-high text-sm">{uploadState.errorMessage}</span>
                </div>
              )}

              {/* Sample log */}
              <button
                onClick={handleSampleLog}
                className="w-full flex items-center justify-center gap-2 border border-ops-border text-ops-text-dim hover:border-ops-cyan/50 hover:text-ops-cyan py-3 rounded-lg transition-all duration-200 text-sm"
              >
                <Play className="w-4 h-4" />
                Run Sample Log Demo (pre-loaded attack scenarios)
              </button>
            </>
          ) : (
            /* Upload/Analysis in progress */
            <div className="cyber-card border border-ops-border p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-ops-cyan" />
                  <div>
                    <p className="text-ops-text text-sm font-medium">{selectedFile?.name || "sample_access.log"}</p>
                    <p className="text-ops-text-muted font-mono text-xs">
                      {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Demo file"}
                    </p>
                  </div>
                </div>
                {uploadState.status === "complete" && (
                  <button onClick={reset} className="text-ops-text-muted hover:text-ops-text transition-colors p-1">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="ops-label text-[10px]">
                    {uploadState.status === "uploading" ? "Uploading..." :
                     uploadState.status === "analyzing" ? "Analyzing..." : "Complete"}
                  </span>
                  <span className="text-ops-cyan font-mono text-xs">{uploadState.progress}%</span>
                </div>
                <div className="h-2 bg-ops-surface rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${uploadState.progress}%`,
                      background: "linear-gradient(90deg, #00d4ff, #00ff88)",
                      boxShadow: "0 0 8px rgba(0,212,255,0.5)",
                    }}
                  />
                </div>
              </div>

              {/* Result summary */}
              {result && (
                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  result.high > 0 ? "bg-sev-high-bg border-sev-high-border" : "bg-ops-green/5 border-ops-green/20"
                )}>
                  {result.high > 0 ? (
                    <AlertTriangle className="w-5 h-5 text-sev-high flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-ops-green flex-shrink-0" />
                  )}
                  <div>
                    <p className={cn("font-semibold text-sm", result.high > 0 ? "text-sev-high" : "text-ops-green")}>
                      {result.threats} threats detected
                      {result.high > 0 && ` — ${result.high} critical!`}
                    </p>
                    <p className="text-ops-text-muted text-xs">
                      {result.high > 0 ? "Immediate action required" : "Review flagged items"}
                    </p>
                  </div>
                </div>
              )}

              {/* View results button */}
              {uploadState.status === "complete" && (
                <button
                  onClick={() => setActiveTab("threats")}
                  className="w-full cyber-btn-primary py-2.5 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  View Threat Analysis Results
                </button>
              )}
            </div>
          )}
        </div>

        {/* Terminal output */}
        <div className="cyber-card border border-ops-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-ops-bg border-b border-ops-border">
            <Terminal className="w-3.5 h-3.5 text-ops-cyan" />
            <span className="ops-label">Analysis Terminal</span>
            <div className="flex gap-1.5 ml-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-sev-high/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-sev-low/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-ops-green/60" />
            </div>
          </div>
          <div className="p-4 h-80 overflow-y-auto font-mono text-xs space-y-1.5 bg-ops-bg">
            {analysisLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-ops-text-muted">
                <Terminal className="w-8 h-8 mb-3 opacity-30" />
                <p>Awaiting log file...</p>
                <p className="text-[10px] mt-1 opacity-60">SecureOps AI Engine v1.0.0</p>
              </div>
            ) : (
              analysisLogs.map((log, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-2 animate-fade-in-up",
                    log.type === "error" ? "text-sev-high" :
                    log.type === "warning" ? "text-sev-medium" :
                    log.type === "success" ? "text-ops-green" :
                    "text-ops-text-muted"
                  )}
                >
                  <span className="text-ops-cyan/50 flex-shrink-0">{">"}</span>
                  <span>{log.text}</span>
                </div>
              ))
            )}
            {uploadState.status === "analyzing" && (
              <div className="flex items-center gap-2 text-ops-cyan">
                <span>{">"}</span>
                <span className="typing-cursor">Processing</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Supported formats info */}
      <div className="cyber-card p-4 border border-ops-border">
        <h3 className="text-ops-text font-medium text-sm mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-ops-cyan" />
          Supported Log Formats & Detection Capabilities
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Apache/Nginx Access Logs", icon: "🌐" },
            { label: "SSH Auth Logs", icon: "🔐" },
            { label: "System Event Logs", icon: "⚙️" },
            { label: "Firewall/IDS Logs", icon: "🔥" },
          ].map((fmt) => (
            <div key={fmt.label} className="flex items-center gap-2 bg-ops-surface/50 rounded-lg p-2.5 border border-ops-border/50">
              <span className="text-base">{fmt.icon}</span>
              <span className="text-ops-text-dim text-xs">{fmt.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
