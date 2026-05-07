// ============================================================
// SecureOps AI – AI Security Chatbot Component
// ============================================================

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, Zap, Shield, AlertTriangle, FileText } from "lucide-react";
import { useSecurityStore } from "@/stores/securityStore";
import { generateChatResponse } from "@/lib/chatResponses";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

// Render markdown-like bold text
function renderContent(content: string) {
  const parts = content.split(/(\*\*.*?\*\*|\`[^`]+\`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="bg-ops-bg/70 text-ops-cyan px-1 py-0.5 rounded text-[11px] font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// Quick action suggestions
const QUICK_ACTIONS = [
  { label: "Show recent threats", icon: AlertTriangle },
  { label: "What action should I take?", icon: Shield },
  { label: "Explain brute force attack", icon: FileText },
  { label: "Give me a security summary", icon: Zap },
];

export function ChatBot() {
  const { chatMessages, addChatMessage, updateChatMessage, clearChat, allThreats, currentAnalysis } = useSecurityStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMsg);
    setInput("");
    setIsLoading(true);

    // Add typing indicator
    const aiMsgId = Math.random().toString(36).substr(2);
    const typingMsg: ChatMessage = {
      id: aiMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      isTyping: true,
    };
    addChatMessage(typingMsg);

    try {
      const response = await generateChatResponse(text.trim(), {
        threats: allThreats,
        lastAnalysis: currentAnalysis?.analyzedAt || null,
      });

      updateChatMessage(aiMsgId, {
        content: response,
        isTyping: false,
      });
    } catch {
      updateChatMessage(aiMsgId, {
        content: "I encountered an error processing your request. Please try again.",
        isTyping: false,
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-ops-border bg-ops-surface/30 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-ops-cyan/10 border border-ops-cyan/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-ops-cyan" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-ops-text font-semibold text-sm">SecureOps AI</span>
              <span className="flex items-center gap-1 bg-ops-green/10 text-ops-green text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-ops-green animate-pulse-dot" />
                Online
              </span>
            </div>
            <p className="text-ops-text-muted text-xs">AI-Powered • SOC Assistant</p>
          </div>
        </div>
        {chatMessages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-ops-text-muted hover:text-sev-high text-xs transition-colors py-1 px-2 rounded hover:bg-sev-high-bg"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 grid-bg">
        {chatMessages.length === 0 ? (
          // Welcome state
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 rounded-full bg-ops-cyan/10 border-2 border-ops-cyan/20 flex items-center justify-center mb-5">
              <Bot className="w-8 h-8 text-ops-cyan" />
            </div>
            <h3 className="text-ops-text font-bold text-lg mb-2">SecureOps AI Assistant</h3>
            <p className="text-ops-text-muted text-sm max-w-xs mb-6">
              I'm your AI-powered cybersecurity analyst. Ask me about threats, attack techniques, or security recommendations.
            </p>
            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => sendMessage(action.label)}
                    className="flex items-center gap-2 bg-ops-card border border-ops-border hover:border-ops-cyan/30 hover:bg-ops-cyan/5 rounded-lg px-3 py-2.5 text-left text-xs text-ops-text-dim hover:text-ops-text transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5 text-ops-cyan flex-shrink-0" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 animate-slide-in-right",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-ops-cyan/10 border border-ops-cyan/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-ops-cyan" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[78%] rounded-xl px-4 py-3",
                  msg.role === "user"
                    ? "chat-bubble-user text-ops-bg"
                    : "chat-bubble-ai text-ops-text"
                )}
              >
                {msg.isTyping ? (
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-ops-cyan animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-ops-cyan animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-ops-cyan animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                ) : (
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {msg.content.split("\n").map((line, i) => (
                      <p key={i} className={line === "" ? "h-2" : ""}>
                        {renderContent(line)}
                      </p>
                    ))}
                  </div>
                )}
                <div
                  className={cn(
                    "text-[10px] mt-1.5 font-mono",
                    msg.role === "user" ? "text-ops-bg/60 text-right" : "text-ops-text-muted"
                  )}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-ops-cyan flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-ops-bg" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick action chips */}
      {chatMessages.length > 0 && !isLoading && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-ops-border/50">
          {["Show threats", "Recommend actions", "Explain attack"].map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="flex-shrink-0 bg-ops-surface border border-ops-border hover:border-ops-cyan/30 hover:text-ops-cyan text-ops-text-muted text-xs px-3 py-1.5 rounded-full transition-all duration-200"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="px-4 pb-4 pt-3 border-t border-ops-border bg-ops-surface/30 rounded-b-xl">
        <div className="flex gap-2 items-end">
          <div className="flex-1 bg-ops-card border border-ops-border rounded-xl px-4 py-3 flex items-center gap-2 focus-within:border-ops-cyan/50 transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about threats, attacks, or security recommendations..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-ops-text text-sm outline-none placeholder:text-ops-text-muted disabled:opacity-50 min-w-0"
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0",
              input.trim() && !isLoading
                ? "bg-ops-cyan text-ops-bg hover:bg-ops-cyan-dim shadow-cyber-glow"
                : "bg-ops-surface text-ops-text-muted cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-ops-text-muted text-[10px] font-mono mt-2 text-center">
          SecureOps AI • Local AI Engine • Press Enter to send
        </p>
      </div>
    </div>
  );
}
