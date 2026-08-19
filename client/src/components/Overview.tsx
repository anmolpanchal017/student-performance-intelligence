import React from "react";
import {
  UserCheck,
  Users,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import type { TabType } from "./Sidebar";
import type { StudentSummary } from "../types";

interface OverviewProps {
  setActiveTab: (tab: TabType) => void;
  onSelectStudent: (studentId: string) => void;
  onSelectClass: (classId: string) => void;
  studentsList: StudentSummary[];
  classesList: string[];
}

export const Overview: React.FC<OverviewProps> = ({
  setActiveTab,
  onSelectStudent,
  onSelectClass,
  studentsList,
  classesList,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
            Academic Performance Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Machine Learning risk analysis, student diagnostics, and LLM-powered academic interventions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab("student")}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <span>Analyze Student</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Manual Risk Test</span>
          </button>
        </div>
      </div>

      {/* Primary Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          onClick={() => setActiveTab("student")}
          className="saas-card-interactive p-5 cursor-pointer group"
        >
          <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600 w-fit mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
            Student Intelligence
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Individual student metrics, subject performance breakdown, topic scores, and ML risk classification.
          </p>
        </div>

        <div
          onClick={() => setActiveTab("class")}
          className="saas-card-interactive p-5 cursor-pointer group"
        >
          <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600 w-fit mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
            Class Intelligence
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Classroom averages, strongest/weakest subject analytics, and historical term comparison.
          </p>
        </div>

        <div
          onClick={() => setActiveTab("manual")}
          className="saas-card-interactive p-5 cursor-pointer group"
        >
          <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600 w-fit mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
            Manual Risk Predictor
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Evaluate custom assessment scores, completion time, and accuracy to predict real-time student risk.
          </p>
        </div>
      </div>

      {/* Quick Access Tables / Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Students Table */}
        <div className="saas-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                Available Student Records ({studentsList.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select a student record to launch detailed diagnostic analysis.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/50">
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {studentsList.map((stu) => (
                  <tr key={stu.student_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-indigo-600">
                      {stu.student_id}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {stu.student_name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      Class {stu.class_id}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          onSelectStudent(stu.student_id);
                          setActiveTab("student");
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-[11px] font-semibold transition-colors"
                      >
                        Inspect Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Classes & Platform Stats */}
        <div className="space-y-6">
          <div className="saas-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Classes Directory
            </h2>
            <p className="text-xs text-slate-500">
              Select classroom group for aggregated performance benchmarking.
            </p>
            <div className="space-y-2">
              {classesList.map((cls) => (
                <button
                  key={cls}
                  onClick={() => {
                    onSelectClass(cls);
                    setActiveTab("class");
                  }}
                  className="w-full p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
                >
                  <span>Class {cls} Performance</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="saas-card p-5 space-y-3 bg-slate-900 text-white">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Production Pipeline</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              ML Model (`risk_model.pkl`) evaluates student risk levels using scikit-learn features while FastAPI serves real-time analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
