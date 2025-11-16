export interface SubstackNote {
  id: string;
  content: string;
  scheduledDate: Date | null;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published';
  metrics?: {
    reactions: number;
    restacks: number;
    comments: number;
    clicks: number;
    freeSubscribers: number;
    paidSubscribers: number;
  };
  performanceCategory?: 'dynamo' | 'rocket' | 'burner' | 'wonder';
}

export interface AnalyticsData {
  date: string;
  subscribers: number;
  freeSubscribers: number;
  paidSubscribers: number;
  reactions: number;
  restacks: number;
  comments: number;
  clicks: number;
}

export interface RevenueMetrics {
  mrr: number; // Monthly Recurring Revenue
  arpu: number; // Average Revenue Per User
  ltv: number; // Lifetime Value
}

export interface GrowthData {
  week: string;
  growth: number;
  percentage: number;
}

export type TimeSlot = {
  hour: number;
  minute: number;
  label: string;
};

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
