// ============================================================
// SecureOps AI – Security State Store
// Central state management using React context + localStorage
// ============================================================

import { createContext, useContext } from "react";
import type { Threat, ChatMessage, LogAnalysisResult, DashboardStats } from "@/types";

export interface SecurityState {
  // Current analysis
  currentAnalysis: LogAnalysisResult | null;
  // All historical threats (persisted)
  allThreats: Threat[];
  // Chat messages
  chatMessages: ChatMessage[];
  // Dashboard stats
  stats: DashboardStats;
  // Active navigation tab
  activeTab: string;
}

export interface SecurityActions {
  setAnalysis: (result: LogAnalysisResult) => void;
  addChatMessage: (msg: ChatMessage) => void;
  updateChatMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearChat: () => void;
  setActiveTab: (tab: string) => void;
  clearThreats: () => void;
}

export type SecurityStore = SecurityState & SecurityActions;

// Default stats
export const DEFAULT_STATS: DashboardStats = {
  totalThreats: 0,
  highSeverity: 0,
  mediumSeverity: 0,
  lowSeverity: 0,
  uniqueIPs: 0,
  logsAnalyzed: 0,
  lastScan: null,
};

// Compute stats from threats array
export function computeStats(threats: Threat[], existing: DashboardStats): DashboardStats {
  return {
    totalThreats: threats.length,
    highSeverity: threats.filter((t) => t.severity === "High").length,
    mediumSeverity: threats.filter((t) => t.severity === "Medium").length,
    lowSeverity: threats.filter((t) => t.severity === "Low").length,
    uniqueIPs: new Set(threats.map((t) => t.ip)).size,
    logsAnalyzed: existing.logsAnalyzed + 1,
    lastScan: new Date().toISOString(),
  };
}

// localStorage keys
export const STORAGE_KEYS = {
  THREATS: "secureops_threats",
  CHAT: "secureops_chat",
  STATS: "secureops_stats",
};

// Load from localStorage
export function loadFromStorage(): Partial<SecurityState> {
  try {
    const threats = JSON.parse(localStorage.getItem(STORAGE_KEYS.THREATS) || "[]");
    const chat = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT) || "[]");
    const stats = JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || "null") || DEFAULT_STATS;
    return { allThreats: threats, chatMessages: chat, stats };
  } catch {
    return { allThreats: [], chatMessages: [], stats: DEFAULT_STATS };
  }
}

// Save to localStorage
export function saveThreats(threats: Threat[]) {
  localStorage.setItem(STORAGE_KEYS.THREATS, JSON.stringify(threats));
}

export function saveChat(messages: ChatMessage[]) {
  // Keep last 100 messages
  const trimmed = messages.slice(-100);
  localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(trimmed));
}

export function saveStats(stats: DashboardStats) {
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

// Context
export const SecurityContext = createContext<SecurityStore | null>(null);

export function useSecurityStore(): SecurityStore {
  const ctx = useContext(SecurityContext);
  if (!ctx) throw new Error("useSecurityStore must be used within SecurityProvider");
  return ctx;
}
