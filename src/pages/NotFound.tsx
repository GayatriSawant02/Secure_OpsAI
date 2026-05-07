import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-ops-bg flex items-center justify-center text-center px-4">
      <div>
        <Shield className="w-16 h-16 text-ops-cyan/30 mx-auto mb-4" />
        <h1 className="text-ops-cyan font-mono text-6xl font-bold mb-2">404</h1>
        <h2 className="text-ops-text text-xl font-semibold mb-3">Access Denied</h2>
        <p className="text-ops-text-muted text-sm mb-6">
          The requested resource was not found or access has been restricted.
        </p>
        <button onClick={() => navigate("/")} className="cyber-btn-primary">
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
