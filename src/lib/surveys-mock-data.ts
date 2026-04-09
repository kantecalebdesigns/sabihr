export type SurveyStatus = "active" | "draft" | "completed";
export type QuestionType = "multiple-choice" | "rating" | "text" | "yes-no" | "scale";

export interface SurveyQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  anonymous: boolean;
  createdBy: string;
  createdDate: string;
  deadline: string | null;
  responseCount: number;
  totalRecipients: number;
  questions: SurveyQuestion[];
}

export const SURVEY_STATUS_STYLES: Record<SurveyStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "text-emerald-700" },
  draft: { label: "Draft", color: "text-amber-700" },
  completed: { label: "Completed", color: "text-blue-700" },
};

export const MOCK_SURVEYS: Survey[] = [
  {
    id: "srv-1",
    title: "Employee Satisfaction Survey — Q1 2026",
    description: "Help us understand your experience and satisfaction with your role, team, and the company.",
    status: "active",
    anonymous: true,
    createdBy: "Fatima Abdullahi",
    createdDate: "2026-03-15",
    deadline: "2026-04-15",
    responseCount: 12,
    totalRecipients: 20,
    questions: [
      { id: "q-1", text: "How satisfied are you with your current role?", type: "rating", required: true },
      { id: "q-2", text: "Do you feel valued by your manager?", type: "yes-no", required: true },
      { id: "q-3", text: "How would you rate the work-life balance?", type: "scale", required: true },
      { id: "q-4", text: "Which areas need improvement?", type: "multiple-choice", required: false, options: ["Communication", "Career Growth", "Compensation", "Work Environment", "Leadership"] },
      { id: "q-5", text: "Any additional feedback?", type: "text", required: false },
    ],
  },
  {
    id: "srv-2",
    title: "Work Environment Assessment",
    description: "Share your thoughts on the physical and virtual work environment to help us improve.",
    status: "active",
    anonymous: false,
    createdBy: "Ibrahim Musa",
    createdDate: "2026-03-20",
    deadline: "2026-04-20",
    responseCount: 8,
    totalRecipients: 20,
    questions: [
      { id: "q-6", text: "How would you rate the office facilities?", type: "rating", required: true },
      { id: "q-7", text: "Do you have the tools you need to do your job?", type: "yes-no", required: true },
      { id: "q-8", text: "Rate the IT support responsiveness", type: "scale", required: true },
      { id: "q-9", text: "What would improve your workspace?", type: "text", required: false },
      { id: "q-10", text: "Preferred work arrangement?", type: "multiple-choice", required: true, options: ["Fully Remote", "Hybrid (3 days office)", "Hybrid (2 days office)", "Fully In-Office"] },
    ],
  },
  {
    id: "srv-3",
    title: "Annual Employee Engagement Survey 2025",
    description: "Comprehensive annual survey covering engagement, culture, and growth opportunities.",
    status: "completed",
    anonymous: true,
    createdBy: "Fatima Abdullahi",
    createdDate: "2025-11-01",
    deadline: "2025-12-01",
    responseCount: 17,
    totalRecipients: 20,
    questions: [
      { id: "q-11", text: "I would recommend this company as a great place to work", type: "scale", required: true },
      { id: "q-12", text: "I feel my contributions are recognized", type: "rating", required: true },
      { id: "q-13", text: "I have clear career growth opportunities", type: "yes-no", required: true },
      { id: "q-14", text: "What do you enjoy most about working here?", type: "text", required: false },
      { id: "q-15", text: "Areas where the company can improve", type: "multiple-choice", required: false, options: ["Training", "Compensation", "Benefits", "Culture", "Management", "Tools"] },
    ],
  },
];
