import React, { useState } from "react";
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import type { ManualPredictionRequest, ManualPredictionResponse } from "../types";
import { generateManualPrediction } from "../services/api";
import { AIInsightCard } from "./AIInsightCard";

export const ManualPrediction: React.FC = () => {
  const [formData, setFormData] = useState<ManualPredictionRequest>({
    student_id: "S999",
    student_name: "Demo Student",
    class_id: "10A",
    subject: "Mathematics",
    topic: "Probability",
    assessment_name: "Unit Test 1",
    marks_obtained: 18,
    total_marks: 20,
    attempt_date: new Date().toISOString().split("T")[0],
    time_taken: 25,
    questions_attempted: 20,
    questions_correct: 18,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ManualPredictionResponse | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : parseFloat(value)) : value,
    }));
  };

  const fillHighRiskSample = () => {
    setFormData({
      student_id: "S888",
      student_name: "Risk Test Student",
      class_id: "10B",
      subject: "Physics",
      topic: "Thermodynamics",
      assessment_name: "Midterm Assessment",
      marks_obtained: 8,
      total_marks: 30,
      attempt_date: new Date().toISOString().split("T")[0],
      time_taken: 55,
      questions_attempted: 25,
      questions_correct: 7,
    });
  };

  const fillHighPerformerSample = () => {
    setFormData({
      student_id: "S999",
      student_name: "Demo High Performer",
      class_id: "10A",
      subject: "Mathematics",
      topic: "Calculus",
      assessment_name: "Unit Test 3",
      marks_obtained: 28,
      total_marks: 30,
      attempt_date: new Date().toISOString().split("T")[0],
      time_taken: 20,
      questions_attempted: 30,
      questions_correct: 28,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await generateManualPrediction(formData);
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Failed to generate prediction.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Title & Banner */}
      <div className="saas-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="w-7 h-7 text-indigo-600" />
              Manual Risk Assessment Predictor
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Submit custom assessment metrics to generate instant Machine Learning risk classification.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={fillHighPerformerSample}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
            >
              Preset: High Score
            </button>
            <button
              type="button"
              onClick={fillHighRiskSample}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium border border-rose-200 transition-colors"
            >
              Preset: At-Risk
            </button>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="saas-card p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
          Assessment & Student Metrics Input
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Student ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Student ID</label>
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2 rounded-lg saas-input text-sm"
            />
          </div>

          {/* Student Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Student Name</label>
            <input
              type="text"
              name="student_name"
              value={formData.student_name}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2 rounded-lg saas-input text-sm"
            />
          </div>

          {/* Class ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Class ID</label>
            <input
              type="text"
              name="class_id"
              value={formData.class_id}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2 rounded-lg saas-input text-sm"
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2 rounded-lg saas-input text-sm"
            />
          </div>

          {/* Topic */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2 rounded-lg saas-input text-sm"
            />
          </div>

          {/* Assessment Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Assessment Name</label>
            <input
              type="text"
              name="assessment_name"
              value={formData.assessment_name}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2 rounded-lg saas-input text-sm"
            />
          </div>

          {/* Marks Obtained */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Marks Obtained</label>
            <input
              type="number"
              name="marks_obtained"
              min="0"
              step="0.5"
              value={formData.marks_obtained}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2 rounded-lg saas-input text-sm"
            />
          </div>

          {/* Total Marks */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Total Marks</label>
            <input
              type="number"
              name="total_marks"
              min="1"
              step="0.5"
              value={formData.total_marks}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2 rounded-lg saas-input text-sm"
            />
          </div>

          {/* Attempt Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Attempt Date</label>
            <input
              type="date"
              name="attempt_date"
              value={formData.attempt_date}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2 rounded-lg saas-input text-sm"
            />
          </div>

          {/* Time Taken */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Time Taken (Minutes)</label>
            <input
              type="number"
              name="time_taken"
              min="1"
              value={formData.time_taken}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2 rounded-lg saas-input text-sm"
            />
          </div>

          {/* Questions Attempted */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Questions Attempted</label>
            <input
              type="number"
              name="questions_attempted"
              min="1"
              value={formData.questions_attempted}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2 rounded-lg saas-input text-sm"
            />
          </div>

          {/* Questions Correct */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Questions Correct</label>
            <input
              type="number"
              name="questions_correct"
              min="0"
              value={formData.questions_correct}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2 rounded-lg saas-input text-sm"
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-xs transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Calculating Prediction...</span>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Generate Prediction</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Output Results */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Result Overview Card */}
          <div className="saas-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Prediction Results for {formData.student_name}
                </h2>
                {getRiskBadge(result.risk.level)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Subject: <span className="font-semibold text-slate-800">{formData.subject}</span> • Topic: <span className="font-semibold text-slate-800">{formData.topic}</span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-right">
              <span className="text-xs text-slate-500 block font-medium">Calculated Score</span>
              <span className="text-xl font-bold text-slate-900">
                {result.analytics.overall_score.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="saas-card p-5 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Attempt Accuracy
              </span>
              <p className="text-3xl font-bold text-slate-900">
                {result.analytics.overall_accuracy.toFixed(1)}%
              </p>
            </div>

            <div className="saas-card p-5 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Predicted Risk Level
              </span>
              <p className="text-3xl font-bold text-slate-900 capitalize">
                {result.risk.level}
              </p>
            </div>

            <div className="saas-card p-5 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Risk Probability
              </span>
              <p className="text-3xl font-bold text-slate-900">
                {(result.risk.probability * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* AI Insight */}
          <AIInsightCard
            aiInsight={result.ai_insight}
            title={`Real-Time Assessment AI Diagnosis (${formData.subject} - ${formData.topic})`}
          />
        </div>
      )}
    </div>
  );
};
