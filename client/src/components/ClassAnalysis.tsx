import React, { useState, useEffect } from "react";
import {
  Users,
  Award,
  Target,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BookOpen,
  BarChart2,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import type { ClassResponse } from "../types";
import { getClassData } from "../services/api";
import { AIInsightCard } from "./AIInsightCard";

interface ClassAnalysisProps {
  initialClassId?: string;
  classesList: string[];
}

export const ClassAnalysis: React.FC<ClassAnalysisProps> = ({
  initialClassId = "10A",
  classesList,
}) => {
  const [selectedClassId, setSelectedClassId] = useState(initialClassId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classData, setClassData] = useState<ClassResponse | null>(null);

  const handleFetchClass = async (classId: string) => {
    if (!classId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getClassData(classId);
      setClassData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load class data.");
      setClassData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialClassId) {
      setSelectedClassId(initialClassId);
      handleFetchClass(initialClassId);
    }
  }, [initialClassId]);

  // Convert subject & topic analytics data objects to Recharts array formats
  const subjectChartData = classData?.analytics?.subject_performance
    ? Object.entries(classData.analytics.subject_performance).map(([subject, score]) => ({
        subject,
        score: Number(score.toFixed(2)),
      }))
    : [];

  const topicChartData = classData?.analytics?.topic_performance
    ? Object.entries(classData.analytics.topic_performance).map(([topic, score]) => ({
        topic,
        score: Number(score.toFixed(2)),
      }))
    : [];

  const trendChartData = classData?.analytics
    ? [
        { period: "Earlier Terms", average: Number(classData.analytics.earlier_average.toFixed(2)) },
        { period: "Recent Terms", average: Number(classData.analytics.recent_average.toFixed(2)) },
      ]
    : [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Class Selector */}
      <div className="saas-card p-6 space-y-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Class Performance Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated classroom metrics, subject averages, and class-level pedagogical recommendations.
          </p>
        </div>

        {/* Class Selection Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Select Class:
          </span>
          {classesList.map((cls) => (
            <button
              key={cls}
              onClick={() => {
                setSelectedClassId(cls);
                handleFetchClass(cls);
              }}
              className={`px-4 py-2 rounded-lg font-medium text-xs border transition-colors ${
                selectedClassId === cls
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              Class {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="saas-card p-12 text-center text-slate-500 space-y-2">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium">Fetching class performance metrics...</p>
        </div>
      )}

      {/* Loaded Class Data */}
      {!loading && classData && (
        <div className="space-y-8">
          {/* Class Profile Banner */}
          <div className="saas-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Class {classData.class.class_id} Performance Profile
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Total Enrolled Students: <span className="font-semibold text-slate-800">{classData.class.student_count}</span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-right">
              <span className="text-xs text-slate-500 block font-medium">Class Average</span>
              <span className="text-xl font-bold text-slate-900">
                {classData.analytics.class_average.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="saas-card p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Class Average Score</span>
                <Award className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {classData.analytics.class_average.toFixed(1)}%
              </p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${Math.min(100, classData.analytics.class_average)}%` }}
                />
              </div>
            </div>

            <div className="saas-card p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Class Accuracy Rate</span>
                <Target className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {classData.analytics.class_accuracy.toFixed(1)}%
              </p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, classData.analytics.class_accuracy)}%` }}
                />
              </div>
            </div>

            <div className="saas-card p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Trend Status</span>
                {classData.analytics.trend_difference >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {classData.analytics.trend}
              </p>
              <p className="text-xs text-slate-500">
                Change:{" "}
                <span
                  className={
                    classData.analytics.trend_difference >= 0
                      ? "text-emerald-600 font-semibold"
                      : "text-rose-600 font-semibold"
                  }
                >
                  {classData.analytics.trend_difference >= 0 ? "+" : ""}
                  {classData.analytics.trend_difference.toFixed(1)} pts
                </span>
              </p>
            </div>
          </div>

          {/* Subject Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="saas-card p-5 border-l-4 border-l-emerald-500 space-y-1">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                Top Subject Average
              </span>
              <p className="text-lg font-bold text-slate-900">
                {classData.analytics.strongest_subject}
              </p>
            </div>
            <div className="saas-card p-5 border-l-4 border-l-rose-500 space-y-1">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">
                Lowest Subject Average
              </span>
              <p className="text-lg font-bold text-slate-900">
                {classData.analytics.weakest_subject}
              </p>
            </div>
          </div>

          {/* Recharts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject Performance */}
            <div className="saas-card p-6 space-y-4 lg:col-span-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Subject Averages
                </h3>
                <span className="text-xs text-slate-500">Class Avg %</span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="subject" stroke="#64748B" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                    <YAxis stroke="#64748B" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderRadius: "8px", color: "#0F172A" }} />
                    <Bar dataKey="score" fill="#6366F1" radius={[4, 4, 0, 0]}>
                      {subjectChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.subject === classData.analytics.strongest_subject
                              ? "#22C55E"
                              : entry.subject === classData.analytics.weakest_subject
                              ? "#EF4444"
                              : "#6366F1"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Topic Performance */}
            <div className="saas-card p-6 space-y-4 lg:col-span-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-600" />
                  Topic Averages
                </h3>
                <span className="text-xs text-slate-500">Class Avg %</span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="topic" stroke="#64748B" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" />
                    <YAxis stroke="#64748B" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderRadius: "8px", color: "#0F172A" }} />
                    <Bar dataKey="score" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Term Progress */}
            <div className="saas-card p-6 space-y-4 lg:col-span-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Term Progress
                </h3>
                <span className="text-xs text-slate-500">Comparison</span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendChartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="period" stroke="#64748B" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748B" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderRadius: "8px", color: "#0F172A" }} />
                    <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                      <Cell fill="#CBD5E1" />
                      <Cell fill="#6366F1" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Insight Card */}
          <AIInsightCard
            aiInsight={classData.ai_insight}
            title={`AI Class Pedagogical Insight for Class ${classData.class.class_id}`}
          />
        </div>
      )}
    </div>
  );
};
