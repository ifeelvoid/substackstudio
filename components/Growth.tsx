'use client';

import { AnalyticsData, GrowthData, RevenueMetrics } from '@/lib/types';
import { formatCurrency, formatNumber, calculateRevenueMetrics } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Users } from 'lucide-react';

interface GrowthProps {
  analytics: AnalyticsData[];
  growthData: GrowthData[];
}

export default function Growth({ analytics, growthData }: GrowthProps) {
  const revenueMetrics = calculateRevenueMetrics(analytics);

  // Calculate weekly growth
  const weeklyGrowth = analytics.reduce((acc, data, index) => {
    if (index === 0) return acc;
    const prevData = analytics[index - 1];
    const growth = data.subscribers - prevData.subscribers;
    const weekNumber = Math.floor(index / 7);

    if (!acc[weekNumber]) {
      acc[weekNumber] = { total: 0, count: 0 };
    }

    acc[weekNumber].total += growth;
    acc[weekNumber].count += 1;

    return acc;
  }, {} as Record<number, { total: number; count: number }>);

  const weeklyData = Object.entries(weeklyGrowth).map(([week, data]) => ({
    week: `Week ${parseInt(week) + 1}`,
    growth: Math.round(data.total / data.count),
  }));

  // Create heatmap data (simplified version)
  const heatmapData = analytics.slice(-28).map((data, index) => {
    const prevData = analytics[analytics.length - 28 + index - 1];
    const growth = prevData ? data.subscribers - prevData.subscribers : 0;

    // Categorize growth
    let category = 'low';
    if (growth > 20) category = 'high';
    else if (growth > 10) category = 'medium';

    return {
      date: new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      growth,
      category,
    };
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Growth & Revenue</h2>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={24} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{formatCurrency(revenueMetrics.mrr)}</div>
          <div className="text-sm text-gray-400">Monthly Recurring Revenue</div>
          <div className="mt-3 text-xs text-gray-500">
            Projected annual: {formatCurrency(revenueMetrics.mrr * 12)}
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Users size={24} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{formatCurrency(revenueMetrics.arpu)}</div>
          <div className="text-sm text-gray-400">Average Revenue Per User</div>
          <div className="mt-3 text-xs text-gray-500">
            Based on {formatNumber(analytics[analytics.length - 1].subscribers)} subscribers
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={24} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{formatCurrency(revenueMetrics.ltv)}</div>
          <div className="text-sm text-gray-400">Estimated Lifetime Value</div>
          <div className="mt-3 text-xs text-gray-500">
            Based on 12-month retention
          </div>
        </div>
      </div>

      {/* Weekly Growth Chart */}
      <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Weekly Growth Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
            <XAxis dataKey="week" stroke="#808080" style={{ fontSize: '12px' }} />
            <YAxis stroke="#808080" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333333',
                borderRadius: '6px',
                color: '#ffffff',
              }}
            />
            <Bar dataKey="growth" fill="#ffffff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Growth Heatmap */}
      <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Daily Growth Heatmap (Last 28 Days)</h3>
        <div className="grid grid-cols-7 gap-2">
          {heatmapData.map((day, index) => (
            <div
              key={index}
              className={`aspect-square rounded p-2 flex flex-col items-center justify-center text-center transition-colors ${
                day.category === 'high'
                  ? 'bg-white text-black'
                  : day.category === 'medium'
                  ? 'bg-gray-400 text-black'
                  : day.category === 'low'
                  ? 'bg-gray-700 text-white'
                  : 'bg-[#0a0a0a] border border-[#333333] text-gray-400'
              }`}
            >
              <div className="text-xs font-medium">{day.date.split(' ')[1]}</div>
              <div className="text-xs mt-1">+{day.growth}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-gray-700"></div>
            <span>Low (&lt;10)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-gray-400"></div>
            <span>Medium (10-20)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-white"></div>
            <span>High (&gt;20)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
