import { type ClassValue, clsx } from "clsx";
import { SubstackNote, AnalyticsData, GrowthData, RevenueMetrics } from './types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Generate mock notes data
export function generateMockNotes(): SubstackNote[] {
  const categories: Array<'dynamo' | 'rocket' | 'burner' | 'wonder'> = ['dynamo', 'rocket', 'burner', 'wonder'];
  const notes: SubstackNote[] = [];

  for (let i = 0; i < 20; i++) {
    const now = new Date();
    const scheduledDate = new Date(now.getTime() + (i * 24 * 60 * 60 * 1000));

    notes.push({
      id: `note-${i}`,
      content: `Sample Substack Note #${i + 1}`,
      scheduledDate: i < 7 ? scheduledDate : null,
      scheduledTime: `${8 + (i % 12)}:00`,
      status: i < 3 ? 'published' : i < 7 ? 'scheduled' : 'draft',
      metrics: i < 3 ? {
        reactions: Math.floor(Math.random() * 500),
        restacks: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
        clicks: Math.floor(Math.random() * 200),
        freeSubscribers: Math.floor(Math.random() * 50),
        paidSubscribers: Math.floor(Math.random() * 20),
      } : undefined,
      performanceCategory: i < 3 ? categories[i % 4] : undefined,
    });
  }

  return notes;
}

// Generate mock analytics data
export function generateMockAnalytics(): AnalyticsData[] {
  const data: AnalyticsData[] = [];
  const now = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    data.push({
      date: date.toISOString().split('T')[0],
      subscribers: 1000 + Math.floor(Math.random() * 100) + (30 - i) * 10,
      freeSubscribers: 800 + Math.floor(Math.random() * 80) + (30 - i) * 8,
      paidSubscribers: 200 + Math.floor(Math.random() * 20) + (30 - i) * 2,
      reactions: Math.floor(Math.random() * 100),
      restacks: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 30),
      clicks: Math.floor(Math.random() * 150),
    });
  }

  return data;
}

// Generate mock growth data
export function generateMockGrowthData(): GrowthData[] {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
  return weeks.map((week, index) => ({
    week,
    growth: 50 + Math.floor(Math.random() * 100),
    percentage: 5 + Math.floor(Math.random() * 15),
  }));
}

// Calculate revenue metrics
export function calculateRevenueMetrics(analytics: AnalyticsData[]): RevenueMetrics {
  const latestData = analytics[analytics.length - 1];
  const paidSubscribers = latestData.paidSubscribers;
  const avgMonthlyPrice = 10; // Assuming $10/month

  return {
    mrr: paidSubscribers * avgMonthlyPrice,
    arpu: (paidSubscribers * avgMonthlyPrice) / latestData.subscribers,
    ltv: (paidSubscribers * avgMonthlyPrice * 12) / paidSubscribers, // Simple LTV calculation
  };
}

// Categorize note performance
export function categorizePerformance(note: SubstackNote): 'dynamo' | 'rocket' | 'burner' | 'wonder' {
  if (!note.metrics) return 'wonder';

  const { reactions, restacks, freeSubscribers, paidSubscribers } = note.metrics;
  const totalEngagement = reactions + restacks;
  const conversionRate = paidSubscribers / (freeSubscribers + paidSubscribers || 1);

  if (conversionRate > 0.2 && totalEngagement > 100) return 'dynamo';
  if (totalEngagement > 200 && conversionRate < 0.1) return 'rocket';
  if (totalEngagement > 50 && conversionRate > 0.05) return 'burner';
  return 'wonder';
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

// Format currency
export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}
