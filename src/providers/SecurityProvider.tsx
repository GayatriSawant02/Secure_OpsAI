// ============================================================
// SecureOps AI – Security Context Provider
// ============================================================

import { useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { Threat, ChatMessage, LogAnalysisResult } from "@/types";
import {
  SecurityContext,
  DEFAULT_STATS,
  loadFromStorage,
  saveThreats,
  saveChat,
  saveStats,
  computeStats,
} from "@/stores/securityStore";
import type { DashboardStats } from "@/types";

interface Props {
  children: ReactNode;
}

export function SecurityProvider({ children }: Props) {
  const stored = loadFromStorage();

  const [currentAnalysis, setCurrentAnalysisState] = useState<LogAnalysisResult | null>(null);
  const [allThreats, setAllThreats] = useState<Threat[]>(stored.allThreats || []);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(stored.chatMessages || []);
  const [stats, setStats] = useState<DashboardStats>(stored.stats || DEFAULT_STATS);
  const [activeTab, setActiveTabState] = useState<string>("dashboard");

  // Persist threats
  useEffect(() => { saveThreats(allThreats); }, [allThreats]);
  useEffect(() => { saveChat(chatMessages); }, [chatMessages]);
  useEffect(() => { saveStats(stats); }, [stats]);

  const setAnalysis = useCallback((result: LogAnalysisResult) => {
    setCurrentAnalysisState(result);
    setAllThreats(result.threats);
    setStats((prev) => computeStats(result.threats, prev));
  }, []);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  }, []);

  const updateChatMessage = useCallback((id: string, updates: Partial<ChatMessage>) => {
    setChatMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  const setActiveTab = useCallback((tab: string) => {
    setActiveTabState(tab);
  }, []);

  const clearThreats = useCallback(() => {
    setAllThreats([]);
    setCurrentAnalysisState(null);
    setStats(DEFAULT_STATS);
  }, []);

  return (
    <SecurityContext.Provider
      value={{
        currentAnalysis,
        allThreats,
        chatMessages,
        stats,
        activeTab,
        setAnalysis,
        addChatMessage,
        updateChatMessage,
        clearChat,
        setActiveTab,
        clearThreats,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
}
