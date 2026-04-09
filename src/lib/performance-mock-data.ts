// ── Types ──

export type CycleStatus = "active" | "completed" | "draft";
export type GoalStatus = "on-track" | "at-risk" | "behind" | "completed" | "not-started";
export type GoalLevel = "company" | "department" | "individual";
export type AppraisalStatus = "pending-self" | "pending-manager" | "in-review" | "completed" | "cancelled";
export type RatingValue = 1 | 2 | 3 | 4 | 5;
export type FeedbackStatus = "pending" | "submitted";

export interface PerformanceCycle {
  id: string;
  name: string;
  period: string;
  startDate: string;
  endDate: string;
  status: CycleStatus;
  selfReviewDeadline: string;
  managerReviewDeadline: string;
  totalEmployees: number;
  completedReviews: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  level: GoalLevel;
  parentGoalId: string | null;
  ownerId: string;
  ownerName: string;
  department: string;
  progress: number;
  weight: number;
  dueDate: string;
  status: GoalStatus;
  keyResults: string[];
}

export interface Competency {
  id: string;
  name: string;
  description: string;
}

export interface Appraisal {
  id: string;
  cycleId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  managerId: string;
  managerName: string;
  selfReviewStatus: "pending" | "submitted";
  managerReviewStatus: "pending" | "submitted";
  selfRating: RatingValue | null;
  managerRating: RatingValue | null;
  finalRating: RatingValue | null;
  status: AppraisalStatus;
  submittedAt: string | null;
}

export interface FeedbackRequest {
  id: string;
  appraisalId: string;
  employeeName: string;
  reviewerName: string;
  status: FeedbackStatus;
  submittedAt: string | null;
}

// ── Rating Scale ──

export const RATING_LABELS: Record<RatingValue, { label: string; description: string }> = {
  1: { label: "Needs Improvement", description: "Performance is below expectations" },
  2: { label: "Below Expectations", description: "Some areas need significant development" },
  3: { label: "Meets Expectations", description: "Consistently meets job requirements" },
  4: { label: "Exceeds Expectations", description: "Frequently exceeds requirements" },
  5: { label: "Outstanding", description: "Exceptional performance across all areas" },
};

// ── Status Styles ──

export const GOAL_STATUS_STYLES: Record<GoalStatus, { label: string; color: string }> = {
  "on-track": { label: "On Track", color: "text-emerald-700" },
  "at-risk": { label: "At Risk", color: "text-amber-700" },
  "behind": { label: "Behind", color: "text-red-700" },
  "completed": { label: "Completed", color: "text-blue-700" },
  "not-started": { label: "Not Started", color: "text-gray-500" },
};

export const APPRAISAL_STATUS_STYLES: Record<AppraisalStatus, { label: string; color: string }> = {
  "pending-self": { label: "Awaiting Self Review", color: "text-amber-700" },
  "pending-manager": { label: "Awaiting Manager", color: "text-blue-700" },
  "in-review": { label: "In Review", color: "text-violet-700" },
  "completed": { label: "Completed", color: "text-emerald-700" },
  "cancelled": { label: "Cancelled", color: "text-gray-500" },
};

// ── Competencies ──

export const MOCK_COMPETENCIES: Competency[] = [
  { id: "comp-1", name: "Communication", description: "Effectively conveys ideas and information" },
  { id: "comp-2", name: "Teamwork", description: "Collaborates well with others to achieve shared goals" },
  { id: "comp-3", name: "Problem Solving", description: "Identifies issues and develops effective solutions" },
  { id: "comp-4", name: "Leadership", description: "Guides and motivates others toward objectives" },
  { id: "comp-5", name: "Adaptability", description: "Adjusts to changing conditions and requirements" },
  { id: "comp-6", name: "Initiative", description: "Takes proactive steps without being asked" },
  { id: "comp-7", name: "Technical Skills", description: "Demonstrates proficiency in role-specific skills" },
  { id: "comp-8", name: "Time Management", description: "Prioritizes tasks and meets deadlines consistently" },
];

// ── Active Cycle ──

export const MOCK_CYCLE: PerformanceCycle = {
  id: "cycle-1",
  name: "Q1 2026 Performance Review",
  period: "Q1 2026",
  startDate: "2026-01-01",
  endDate: "2026-03-31",
  status: "active",
  selfReviewDeadline: "2026-04-07",
  managerReviewDeadline: "2026-04-14",
  totalEmployees: 20,
  completedReviews: 6,
};

// ── Goals (cascaded) ──

export const MOCK_GOALS: Goal[] = [
  // Company goals
  { id: "g-1", title: "Increase quarterly revenue by 20%", description: "Drive revenue growth through new client acquisition and upselling", level: "company", parentGoalId: null, ownerId: "ceo", ownerName: "CEO", department: "Company", progress: 65, weight: 40, dueDate: "2026-03-31", status: "on-track", keyResults: ["Close 5 enterprise deals", "Increase MRR to ₦50M", "Reduce churn below 3%"] },
  { id: "g-2", title: "Achieve 95% employee satisfaction score", description: "Improve workplace culture and employee experience", level: "company", parentGoalId: null, ownerId: "ceo", ownerName: "CEO", department: "Company", progress: 78, weight: 30, dueDate: "2026-03-31", status: "on-track", keyResults: ["Run quarterly pulse survey", "Launch wellness program", "Reduce voluntary turnover to <8%"] },
  { id: "g-3", title: "Launch 3 new product features", description: "Ship features that improve platform stickiness", level: "company", parentGoalId: null, ownerId: "ceo", ownerName: "CEO", department: "Company", progress: 33, weight: 30, dueDate: "2026-03-31", status: "at-risk", keyResults: ["Ship performance module", "Launch mobile app v2", "Add AI reporting"] },

  // Department goals
  { id: "g-4", title: "Deliver performance module on time", description: "Complete all performance management screens by end of Q1", level: "department", parentGoalId: "g-3", ownerId: "emp-002", ownerName: "Chiamaka Eze", department: "Engineering", progress: 40, weight: 50, dueDate: "2026-03-31", status: "at-risk", keyResults: ["Build dashboard & goals page", "Build review forms", "Complete 360 feedback"] },
  { id: "g-5", title: "Close 3 enterprise deals", description: "Secure 3 new enterprise clients in Q1", level: "department", parentGoalId: "g-1", ownerId: "emp-012", ownerName: "Ngozi Ibe", department: "Sales", progress: 67, weight: 60, dueDate: "2026-03-31", status: "on-track", keyResults: ["Generate 20 qualified leads", "Conduct 10 demos", "Close 3 deals > ₦5M ARR"] },
  { id: "g-6", title: "Reduce time-to-hire to 21 days", description: "Streamline recruitment pipeline", level: "department", parentGoalId: "g-2", ownerId: "emp-004", ownerName: "Fatima Abdullahi", department: "Human Resources", progress: 55, weight: 40, dueDate: "2026-03-31", status: "on-track", keyResults: ["Automate screening", "Reduce interview rounds to 3", "Partner with 2 job boards"] },
  { id: "g-7", title: "Increase brand awareness by 30%", description: "Grow social media following and content reach", level: "department", parentGoalId: "g-1", ownerId: "emp-008", ownerName: "Bukola Adeyemi", department: "Marketing", progress: 80, weight: 40, dueDate: "2026-03-31", status: "on-track", keyResults: ["Publish 12 blog posts", "Grow LinkedIn to 10K", "Run 2 webinars"] },

  // Individual goals
  { id: "g-8", title: "Build appraisal form component", description: "Create the multi-tab appraisal form with rating matrix", level: "individual", parentGoalId: "g-4", ownerId: "emp-001", ownerName: "Adebayo Ogunlesi", department: "Engineering", progress: 70, weight: 30, dueDate: "2026-03-15", status: "on-track", keyResults: ["Goals review tab", "Competency matrix", "Summary view"] },
  { id: "g-9", title: "Design performance dashboard", description: "Create Figma designs for performance module", level: "individual", parentGoalId: "g-4", ownerId: "emp-003", ownerName: "Oluwaseun Afolabi", department: "Engineering", progress: 100, weight: 25, dueDate: "2026-02-28", status: "completed", keyResults: ["Dashboard layout", "Goal tree view", "Review form wireframes"] },
  { id: "g-10", title: "Close Dangote Group deal", description: "Finalize enterprise contract with Dangote Group", level: "individual", parentGoalId: "g-5", ownerId: "emp-005", ownerName: "Emeka Okafor", department: "Sales", progress: 50, weight: 40, dueDate: "2026-03-31", status: "at-risk", keyResults: ["Complete security audit", "Negotiate pricing", "Get legal sign-off"] },
  { id: "g-11", title: "Onboard 5 new hires in Q1", description: "Complete full onboarding for all Q1 hires", level: "individual", parentGoalId: "g-6", ownerId: "emp-013", ownerName: "Kemi Adekunle", department: "Human Resources", progress: 60, weight: 30, dueDate: "2026-03-31", status: "on-track", keyResults: ["Prepare offer letters", "Schedule orientations", "Assign mentors"] },
  { id: "g-12", title: "Launch Q1 marketing campaign", description: "Execute multi-channel campaign for Q1", level: "individual", parentGoalId: "g-7", ownerId: "emp-016", ownerName: "Amara Obi", department: "Marketing", progress: 90, weight: 35, dueDate: "2026-03-15", status: "on-track", keyResults: ["Email campaign to 5K contacts", "Social media ads", "Landing page live"] },
  { id: "g-13", title: "Implement pension auto-remittance", description: "Automate monthly pension remittance flow", level: "individual", parentGoalId: null, ownerId: "emp-006", ownerName: "Aisha Mohammed", department: "Finance", progress: 20, weight: 25, dueDate: "2026-03-31", status: "behind", keyResults: ["Map PFA APIs", "Build reconciliation report", "Test with 3 PFAs"] },
  { id: "g-14", title: "Set up network monitoring", description: "Deploy monitoring across all office locations", level: "individual", parentGoalId: null, ownerId: "emp-015", ownerName: "Usman Bello", department: "IT", progress: 0, weight: 20, dueDate: "2026-03-31", status: "not-started", keyResults: ["Select monitoring tool", "Deploy to Lagos office", "Configure alerts"] },
  { id: "g-15", title: "Draft updated employee handbook", description: "Update handbook with 2026 policy changes", level: "individual", parentGoalId: "g-2", ownerId: "emp-004", ownerName: "Fatima Abdullahi", department: "Human Resources", progress: 45, weight: 20, dueDate: "2026-03-31", status: "on-track", keyResults: ["Review current policies", "Draft new sections", "Get legal review"] },
];

// ── Appraisals ──

export const MOCK_APPRAISALS: Appraisal[] = [
  { id: "apr-1", cycleId: "cycle-1", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", managerId: "emp-002", managerName: "Chiamaka Eze", selfReviewStatus: "submitted", managerReviewStatus: "submitted", selfRating: 4, managerRating: 4, finalRating: 4, status: "completed", submittedAt: "2026-04-05" },
  { id: "apr-2", cycleId: "cycle-1", employeeId: "emp-003", employeeName: "Oluwaseun Afolabi", department: "Engineering", managerId: "emp-002", managerName: "Chiamaka Eze", selfReviewStatus: "submitted", managerReviewStatus: "submitted", selfRating: 5, managerRating: 4, finalRating: 5, status: "completed", submittedAt: "2026-04-04" },
  { id: "apr-3", cycleId: "cycle-1", employeeId: "emp-005", employeeName: "Emeka Okafor", department: "Sales", managerId: "emp-012", managerName: "Ngozi Ibe", selfReviewStatus: "submitted", managerReviewStatus: "submitted", selfRating: 3, managerRating: 3, finalRating: 3, status: "completed", submittedAt: "2026-04-06" },
  { id: "apr-4", cycleId: "cycle-1", employeeId: "emp-006", employeeName: "Aisha Mohammed", department: "Finance", managerId: "emp-011", managerName: "Chibueze Okoro", selfReviewStatus: "submitted", managerReviewStatus: "pending", selfRating: 4, managerRating: null, finalRating: null, status: "pending-manager", submittedAt: null },
  { id: "apr-5", cycleId: "cycle-1", employeeId: "emp-008", employeeName: "Bukola Adeyemi", department: "Marketing", managerId: "ceo", managerName: "CEO", selfReviewStatus: "submitted", managerReviewStatus: "submitted", selfRating: 4, managerRating: 5, finalRating: 5, status: "completed", submittedAt: "2026-04-03" },
  { id: "apr-6", cycleId: "cycle-1", employeeId: "emp-013", employeeName: "Kemi Adekunle", department: "Human Resources", managerId: "emp-004", managerName: "Fatima Abdullahi", selfReviewStatus: "submitted", managerReviewStatus: "pending", selfRating: 3, managerRating: null, finalRating: null, status: "pending-manager", submittedAt: null },
  { id: "apr-7", cycleId: "cycle-1", employeeId: "emp-015", employeeName: "Usman Bello", department: "IT", managerId: "emp-009", managerName: "Ibrahim Musa", selfReviewStatus: "pending", managerReviewStatus: "pending", selfRating: null, managerRating: null, finalRating: null, status: "pending-self", submittedAt: null },
  { id: "apr-8", cycleId: "cycle-1", employeeId: "emp-016", employeeName: "Amara Obi", department: "Marketing", managerId: "emp-008", managerName: "Bukola Adeyemi", selfReviewStatus: "submitted", managerReviewStatus: "submitted", selfRating: 4, managerRating: 4, finalRating: 4, status: "completed", submittedAt: "2026-04-05" },
  { id: "apr-9", cycleId: "cycle-1", employeeId: "emp-014", employeeName: "Damilola Osei", department: "Engineering", managerId: "emp-001", managerName: "Adebayo Ogunlesi", selfReviewStatus: "submitted", managerReviewStatus: "pending", selfRating: 3, managerRating: null, finalRating: null, status: "pending-manager", submittedAt: null },
  { id: "apr-10", cycleId: "cycle-1", employeeId: "emp-004", employeeName: "Fatima Abdullahi", department: "Human Resources", managerId: "ceo", managerName: "CEO", selfReviewStatus: "pending", managerReviewStatus: "pending", selfRating: null, managerRating: null, finalRating: null, status: "pending-self", submittedAt: null },
];

// ── 360 Feedback Requests ──

export const MOCK_FEEDBACK_REQUESTS: FeedbackRequest[] = [
  { id: "fb-1", appraisalId: "apr-1", employeeName: "Adebayo Ogunlesi", reviewerName: "Oluwaseun Afolabi", status: "submitted", submittedAt: "2026-04-04" },
  { id: "fb-2", appraisalId: "apr-1", employeeName: "Adebayo Ogunlesi", reviewerName: "Damilola Osei", status: "submitted", submittedAt: "2026-04-05" },
  { id: "fb-3", appraisalId: "apr-2", employeeName: "Oluwaseun Afolabi", reviewerName: "Adebayo Ogunlesi", status: "submitted", submittedAt: "2026-04-03" },
  { id: "fb-4", appraisalId: "apr-4", employeeName: "Aisha Mohammed", reviewerName: "Folake Williams", status: "pending", submittedAt: null },
  { id: "fb-5", appraisalId: "apr-7", employeeName: "Usman Bello", reviewerName: "Segun Adeniyi", status: "pending", submittedAt: null },
];
