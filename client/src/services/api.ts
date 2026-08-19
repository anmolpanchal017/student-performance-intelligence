import type {
  StudentSummary,
  StudentResponse,
  ClassResponse,
  ManualPredictionRequest,
  ManualPredictionResponse,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
};

export const fetchStudentsList = async (): Promise<StudentSummary[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/students`);
    if (!res.ok) throw new Error("Failed to fetch students");
    const data = await res.json();
    return data.students || [];
  } catch {
    // Fallback static list if API unavailable
    return [
      { student_id: "S001", student_name: "Aarav", class_id: "10A" },
      { student_id: "S002", student_name: "Vivaan", class_id: "10A" },
      { student_id: "S004", student_name: "Arjun", class_id: "10A" },
      { student_id: "S008", student_name: "Kabir", class_id: "10A" },
      { student_id: "S011", student_name: "Krishna", class_id: "10A" },
      { student_id: "S012", student_name: "Dev", class_id: "10A" },
      { student_id: "S019", student_name: "Isha", class_id: "10A" },
      { student_id: "S022", student_name: "Riya", class_id: "10B" },
      { student_id: "S024", student_name: "Kavya", class_id: "10B" },
      { student_id: "S029", student_name: "Shreya", class_id: "10B" },
      { student_id: "S035", student_name: "Ritika", class_id: "10B" },
      { student_id: "S038", student_name: "Dhruv", class_id: "10B" },
      { student_id: "S052", student_name: "Vansh", class_id: "10C" },
      { student_id: "S053", student_name: "Sarthak", class_id: "10C" },
      { student_id: "S057", student_name: "Tushar", class_id: "10C" },
      { student_id: "S060", student_name: "Gaurav", class_id: "10C" },
    ];
  }
};

export const fetchClassesList = async (): Promise<string[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/classes`);
    if (!res.ok) throw new Error("Failed to fetch classes");
    const data = await res.json();
    return data.classes || ["10A", "10B", "10C"];
  } catch {
    return ["10A", "10B", "10C"];
  }
};

export const getStudentData = async (studentId: string): Promise<StudentResponse> => {
  const res = await fetch(`${API_BASE_URL}/student/${encodeURIComponent(studentId)}`);
  if (res.status === 404) {
    throw new Error(`Student '${studentId}' not found.`);
  }
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return await res.json();
};

export const getClassData = async (classId: string): Promise<ClassResponse> => {
  const res = await fetch(`${API_BASE_URL}/class/${encodeURIComponent(classId)}`);
  if (res.status === 404) {
    throw new Error(`Class '${classId}' not found.`);
  }
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return await res.json();
};

export const generateManualPrediction = async (
  payload: ManualPredictionRequest
): Promise<ManualPredictionResponse> => {
  const res = await fetch(`${API_BASE_URL}/manual-prediction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Prediction failed: ${errText}`);
  }

  return await res.json();
};
