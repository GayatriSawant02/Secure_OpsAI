// ============================================================
// SecureOps AI – App Root with Router and Layout
// ============================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { SecurityProvider } from "@/providers/SecurityProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/pages/Dashboard";
import { NotFound } from "@/pages/NotFound";

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-ops-bg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <Dashboard />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SecurityProvider>
      <BrowserRouter>
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#111827",
              border: "1px solid #1e2d40",
              color: "#e2e8f0",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<AppLayout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SecurityProvider>
  );
}
