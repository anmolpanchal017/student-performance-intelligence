import React from "react";
import { GraduationCap, RefreshCw } from "lucide-react";

interface NavbarProps {
  isBackendConnected: boolean;
  onRefreshHealth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isBackendConnected,
  onRefreshHealth,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-50 flex items-center justify-between px-6">
      {/* Brand Title */}
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            Student Intelligence
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
            Enterprise
          </span>
        </div>
      </div>

      {/* Backend API Connection Indicator */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <span>API Engine:</span>
          <span
            className={`flex items-center space-x-1.5 font-medium ${
              isBackendConnected ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendConnected ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <span>{isBackendConnected ? "FastAPI Online" : "Offline Mode"}</span>
          </span>
        </div>

        <button
          onClick={onRefreshHealth}
          title="Verify API Connection"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
