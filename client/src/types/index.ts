export interface StudentSummary {
  student_id: string;
  student_name: string;
  class_id: string;
}

export interface StudentProfile {
  student_id: string;
  student_name: string;
  class_id: string;
}

export interface StudentAnalytics {
  overall_score: number;
  overall_accuracy: number;
  strongest_subject: string;
  weakest_subject: string;
  strongest_topic: string;
  weakest_topic: string;
  subject_performance: Record<string, number>;
  topic_performance: Record<string, number>;
  trend: string;
  trend_difference: number;
}

export interface RiskData {
  level: "Low" | "Medium" | "High" | string;
  probability: number;
}

export interface AIInsightContent {
  summary: string;
  explanation: string;
  recommendation: string;
}

export interface AIInsightWrapper {
  status: string;
  insight: AIInsightContent;
}

export interface StudentResponse {
  student: StudentProfile;
  analytics: StudentAnalytics;
  risk: RiskData;
  ai_insight: AIInsightWrapper;
}

export interface ClassInfo {
  class_id: string;
  student_count: number;
}

export interface ClassAnalytics {
  class_average: number;
  class_accuracy: number;
  strongest_subject: string;
  weakest_subject: string;
  subject_performance: Record<string, number>;
  topic_performance: Record<string, number>;
  earlier_average: number;
  recent_average: number;
  trend: string;
  trend_difference: number;
}

export interface ClassResponse {
  class: ClassInfo;
  analytics: ClassAnalytics;
  ai_insight: AIInsightWrapper;
}

export interface ManualPredictionRequest {
  student_id: string;
  student_name: string;
  class_id: string;
  subject: string;
  topic: string;
  assessment_name: string;
  marks_obtained: number;
  total_marks: number;
  attempt_date: string;
  time_taken: number;
  questions_attempted: number;
  questions_correct: number;
}

export interface ManualPredictionResponse {
  analytics: StudentAnalytics;
  risk: RiskData;
  ai_insight: AIInsightWrapper;
}
