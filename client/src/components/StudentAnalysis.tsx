import React, { useState, useEffect } from "react";
import {
  Search,
  UserCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  Target,
  BarChart2,
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
import type { StudentResponse, StudentSummary } from "../types";
import { getStudentData } from "../services/api";
import { AIInsightCard } from "./AIInsightCard";

interface StudentAnalysisProps {
  initialStudentId?: string;
  studentsList: StudentSummary[];
}

export const StudentAnalysis: React.FC<StudentAnalysisProps> = ({
  initialStudentId = "S001",
  studentsList,
}) => {
  const [studentIdInput, setStudentIdInput] = useState(initialStudentId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<StudentResponse | null>(null);

  const handleFetchStudent = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getStudentData(id.trim());
      setStudentData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load student data.");
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialStudentId) {
      setStudentIdInput(initialStudentId);
      handleFetchStudent(initialStudentId);
    }
  }, [initialStudentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetchStudent(studentIdInput);
  };

  // Convert subject & topic analytics data objects to Recharts array formats
  const subjectChartData = studentData?.analytics?.subject_performance
    ? Object.entries(studentData.analytics.subject_performance).map(([subject, score]) => ({
        subject,
        score: Number(score.toFixed(2)),
      }))
    : [];

  const topicChartData = studentData?.analytics?.topic_performance
    ? Object.entries(studentData.analytics.topic_performance).map(([topic, score]) => ({
        topic,
        score: Number(score.toFixed(2)),
      }))
    : [];

  const getRiskBadge = (level: string = "") => {
    const l = level.toLowerCase();
    if (l === "high") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" /> High Risk
        </span>
      );
    }
    if (l === "medium") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Medium Risk
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Low Risk
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Search Bar */}
      <div className="saas-card p-6 space-y-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-indigo-600" />
            Student Performance Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Student level academic analytics, Machine Learning risk assessment, and topic diagnostics.
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              placeholder="Enter Student ID (e.g. S001, S008, S012)"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg saas-input text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Analyzing...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Analyze Student</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Selection Badges */}
        {studentsList.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-semibold">Quick Select:</span>
            {studentsList.slice(0, 10).map((s) => (
              <button
                key={s.student_id}
                onClick={() => {
                  setStudentIdInput(s.student_id);
                  handleFetchStudent(s.student_id);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  studentIdInput === s.student_id
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
              >
                {s.student_id} ({s.student_name})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loaded Student Content */}
      {studentData && (
        <div className="space-y-8">
          {/* Profile Overview Card */}
          <div className="saas-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg font-bold">
                {studentData.student.student_name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {studentData.student.student_name}
                  </h2>
                  {getRiskBadge(studentData.risk.level)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  ID: <span className="font-semibold text-slate-700">{studentData.student.student_id}</span> • Class: <span className="font-semibold text-slate-700">{studentData.student.class_id}</span>
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-right">
              <span className="text-xs text-slate-500 block font-medium">ML Risk Probability</span>
              <span className="text-xl font-bold text-slate-900">
                {(studentData.risk.probability * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Clean Minimal KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="saas-card p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Overall Score</span>
                <Award className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {studentData.analytics.overall_score.toFixed(1)}%
              </p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${Math.min(100, studentData.analytics.overall_score)}%` }}
                />
              </div>
            </div>

            <div className="saas-card p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Accuracy Rate</span>
                <Target className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {studentData.analytics.overall_accuracy.toFixed(1)}%
              </p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, studentData.analytics.overall_accuracy)}%` }}
                />
              </div>
            </div>

            <div className="saas-card p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Risk Status</span>
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900 capitalize">
                {studentData.risk.level}
              </p>
              <p className="text-xs text-slate-500">
                {studentData.risk.level.toLowerCase() === "high"
                  ? "At-risk — intervention advised"
                  : studentData.risk.level.toLowerCase() === "medium"
                  ? "Moderate — monitor closely"
                  : "Optimal academic standing"}
              </p>
            </div>

            <div className="saas-card p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Performance Trend</span>
                {studentData.analytics.trend_difference >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {studentData.analytics.trend}
              </p>
              <p className="text-xs text-slate-500">
                Difference:{" "}
                <span
                  className={
                    studentData.analytics.trend_difference >= 0
                      ? "text-emerald-600 font-semibold"
                      : "text-rose-600 font-semibold"
                  }
                >
                  {studentData.analytics.trend_difference >= 0 ? "+" : ""}
                  {studentData.analytics.trend_difference.toFixed(1)} pts
                </span>
              </p>
            </div>
          </div>

          {/* Strengths & Weaknesses Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="saas-card p-5 border-l-4 border-l-emerald-500 space-y-2">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                Strongest Area
              </span>
              <div>
                <span className="text-xs text-slate-500">Subject</span>
                <p className="text-lg font-bold text-slate-900">
                  {studentData.analytics.strongest_subject}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Topic</span>
                <p className="text-sm font-medium text-slate-700">
                  {studentData.analytics.strongest_topic}
                </p>
              </div>
            </div>

            <div className="saas-card p-5 border-l-4 border-l-rose-500 space-y-2">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">
                Improvement Focus Area
              </span>
              <div>
                <span className="text-xs text-slate-500">Subject</span>
                <p className="text-lg font-bold text-slate-900">
                  {studentData.analytics.weakest_subject}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Topic</span>
                <p className="text-sm font-medium text-slate-700">
                  {studentData.analytics.weakest_topic}
                </p>
              </div>
            </div>
          </div>

          {/* Recharts Data Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject-wise Bar Chart */}
            <div className="saas-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Subject Performance Breakdown
                </h3>
                <span className="text-xs text-slate-500">Score %</span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="subject" stroke="#64748B" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                    <YAxis stroke="#64748B" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", color: "#0F172A" }}
                    />
                    <Bar dataKey="score" fill="#6366F1" radius={[4, 4, 0, 0]}>
                      {subjectChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.subject === studentData.analytics.strongest_subject
                              ? "#22C55E"
                              : entry.subject === studentData.analytics.weakest_subject
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

            {/* Topic-wise Bar Chart */}
            <div className="saas-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-600" />
                  Topic Mastery Scores
                </h3>
                <span className="text-xs text-slate-500">Score %</span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="topic" stroke="#64748B" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" />
                    <YAxis stroke="#64748B" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", color: "#0F172A" }}
                    />
                    <Bar dataKey="score" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Insight Component */}
          <AIInsightCard
            aiInsight={studentData.ai_insight}
            title={`AI Academic Diagnosis for ${studentData.student.student_name}`}
          />
        </div>
      )}
    </div>
  );
};
