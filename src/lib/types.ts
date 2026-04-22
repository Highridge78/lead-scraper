export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "closed"
  | "lost";

export type LeadPriority = "low" | "medium" | "high";

export interface Lead {
  id: string;

  name?: string;
  business_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  city?: string;
  state?: string;

  source?: string;
  status: LeadStatus;
  priority: LeadPriority;
  score: number;

  notes?: string;

  ai_summary?: string;
  ai_score_explanation?: string;
  ai_outreach?: string;

  created_at: string;
  updated_at?: string;
}

export interface DashboardStats {
  total: number;
  new: number;
  highPriority: number;
}

export interface AIResponse {
  summary?: string;
  scoreExplanation?: string;
  outreach?: string;
}
