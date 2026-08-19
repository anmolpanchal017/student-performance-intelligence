import React from "react";
import { LayoutDashboard, UserCheck, Users, Zap, BookOpen } from "lucide-react";

export type TabType = "overview" | "student" | "class" | "manual";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "student",
      label: "Student Intelligence",
      icon: <UserCheck className="w-4 h-4" />,
      badge: "Risk AI",
    },
    {
      id: "class",
      label: "Class Performance",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "manual",
      label: "Manual Risk Predictor",
      icon: <Zap className="w-4 h-4 text-indigo-400" />,
      badge: "Test",
    },
  ];

  return (
    <aside className="w-70 bg-[#0B1020] text-slate-300 border-r border-slate-800 p-4 flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-3.5rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
            Platform Views
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white font-semibold shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-[#151B2E]"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        isActive
                          ? "bg-indigo-700 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Context Box */}
        <div className="p-3.5 rounded-lg bg-[#151B2E] border border-slate-800 space-y-1">
          <div className="flex items-center space-x-1.5 text-indigo-400 text-[11px] font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Pipeline</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            ML risk model (`risk_model.pkl`) & Groq LLM synthesis engine.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
        <span>Student Intel v2.0</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
          Pro
        </span>
      </div>
    </aside>
  );
};
