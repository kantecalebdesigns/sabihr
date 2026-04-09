export type Priority = "low" | "medium" | "high" | "urgent";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  preview: string;
  priority: Priority;
  author: string;
  department: string;
  targetAudience: "all" | string;
  publishDate: string;
  expiryDate: string | null;
  pinned: boolean;
  readCount: number;
  totalRecipients: number;
}

export const PRIORITY_STYLES: Record<Priority, { label: string; color: string }> = {
  low: { label: "Low", color: "text-gray-500" },
  medium: { label: "Medium", color: "text-blue-700" },
  high: { label: "High", color: "text-amber-700" },
  urgent: { label: "Urgent", color: "text-red-700" },
};

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "ann-1", title: "System Maintenance Scheduled — Action Required", content: "All employees must save their work and log out by 10 PM on Friday, April 10th. Our IT team will be performing critical infrastructure upgrades that will require system downtime from 10 PM Friday to 6 AM Saturday. Please ensure all pending submissions are completed before the maintenance window.", preview: "All employees must save their work and log out by 10 PM on Friday...", priority: "urgent", author: "Usman Bello", department: "IT", targetAudience: "all", publishDate: "2026-04-04", expiryDate: "2026-04-11", pinned: true, readCount: 18, totalRecipients: 20 },
  { id: "ann-2", title: "Q1 2026 Town Hall Meeting — April 15th", content: "Join us for our quarterly town hall meeting where leadership will share company performance updates, upcoming initiatives, and open Q&A. The meeting will be held in the Lagos office main conference room and streamed online for remote employees.", preview: "Join us for our quarterly town hall meeting where leadership will share...", priority: "high", author: "Fatima Abdullahi", department: "Human Resources", targetAudience: "all", publishDate: "2026-04-02", expiryDate: "2026-04-16", pinned: false, readCount: 14, totalRecipients: 20 },
  { id: "ann-3", title: "Updated Travel & Expense Policy", content: "Effective immediately, the travel and expense reimbursement policy has been updated. Key changes include: increased per diem rates for domestic travel, new approval thresholds for expenses above ₦100,000, and mandatory receipt uploads for all claims. Please review the full policy document in the Document Library.", preview: "Effective immediately, the travel and expense reimbursement policy has been updated...", priority: "high", author: "Chibueze Okoro", department: "Finance", targetAudience: "all", publishDate: "2026-03-28", expiryDate: null, pinned: false, readCount: 11, totalRecipients: 20 },
  { id: "ann-4", title: "New Employee Wellness Program Launch", content: "We're excited to announce our partnership with FitLife Nigeria to offer subsidized gym memberships, mental health counseling sessions, and annual health screenings to all employees. Enrollment opens next Monday. Check the Benefits section for details.", preview: "We're excited to announce our partnership with FitLife Nigeria...", priority: "medium", author: "Fatima Abdullahi", department: "Human Resources", targetAudience: "all", publishDate: "2026-03-25", expiryDate: null, pinned: false, readCount: 16, totalRecipients: 20 },
  { id: "ann-5", title: "Engineering Team Offsite — April 20-22", content: "The engineering team offsite will be held at Eko Hotels from April 20-22. Please confirm your attendance with your team lead by April 10th. Travel arrangements will be coordinated by Operations.", preview: "The engineering team offsite will be held at Eko Hotels...", priority: "medium", author: "Chiamaka Eze", department: "Engineering", targetAudience: "Engineering", publishDate: "2026-03-20", expiryDate: "2026-04-23", pinned: false, readCount: 4, totalRecipients: 5 },
  { id: "ann-6", title: "Office Recycling Initiative", content: "As part of our sustainability efforts, we're introducing recycling bins on every floor. Please separate paper, plastic, and general waste. Training sessions will be held next week.", preview: "As part of our sustainability efforts, we're introducing recycling bins...", priority: "medium", author: "Ibrahim Musa", department: "Operations", targetAudience: "all", publishDate: "2026-03-15", expiryDate: null, pinned: false, readCount: 9, totalRecipients: 20 },
];
