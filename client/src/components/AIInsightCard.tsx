import React from "react";
import { Sparkles, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";
import type { AIInsightWrapper } from "../types";

interface AIInsightCardProps {
  aiInsight?: AIInsightWrapper;
  title?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  aiInsight,
  title = "AI Academic Intelligence",
}) => {
  if (!aiInsight || !aiInsight.insight) {
    return (
      <div className="ai-card p-5">
        <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span>No AI insight generated for this record.</span>
        </div>
      </div>
    );
  }

  const { summary, explanation, recommendation } = aiInsight.insight;

  return (
    <div className="ai-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-purple-200/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-purple-100 rounded-lg text-purple-700">
            <Sparkles className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-purple-950">
              {title}
            </h3>
            <p className="text-xs text-purple-700/80">
              Automated LLM Synthesized Analysis & Pedagogical Strategy
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
          AI Generated
        </span>
      </div>

      {/* Structured Sections */}
      <div className="space-y-4">
        {/* Executive Summary */}
        {summary && (
          <div className="bg-white/80 rounded-lg p-4 border border-purple-100 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-purple-900 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-violet-600" />
              <span>Summary</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        {/* Analytical Explanation */}
        {explanation && (
          <div className="bg-white/80 rounded-lg p-4 border border-purple-100 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-purple-900 uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5 text-violet-600" />
              <span>Detailed Performance Diagnosis</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {explanation}
            </p>
          </div>
        )}

        {/* Actionable Recommendations */}
        {recommendation && (
          <div className="bg-emerald-50/90 rounded-lg p-4 border border-emerald-200 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-900 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Targeted Pedagogical Recommendations</span>
            </div>
            <p className="text-sm text-emerald-950 font-medium leading-relaxed">
              {recommendation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
