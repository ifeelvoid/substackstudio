'use client';

import { AnalyticsData, SubstackNote } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Heart, Repeat2, MessageCircle, MousePointer } from 'lucide-react';

interface AnalyticsProps {
  analytics: AnalyticsData[];
  notes: SubstackNote[];
}

export default function Analytics({ analytics, notes }: AnalyticsProps) {
  const latestData = analytics[analytics.length - 1];

  // Calculate totals
  const totalReactions = analytics.reduce((sum, d) => sum + d.reactions, 0);
  const totalRestacks = analytics.reduce((sum, d) => sum + d.restacks, 0);
  const totalComments = analytics.reduce((sum, d) => sum + d.comments, 0);
  const totalClicks = analytics.reduce((sum, d) => sum + d.clicks, 0);

  // Calculate growth
  const firstData = analytics[0];
  const subscriberGrowth = latestData.subscribers - firstData.subscribers;
  const growthPercentage = ((subscriberGrowth / firstData.subscribers) * 100).toFixed(1);

  const stats = [
    {
      label: 'Total Subscribers',
      value: formatNumber(latestData.subscribers),
      change: `+${growthPercentage}%`,
      icon: Users,
      color: 'text-white',
    },
    {
      label: 'Free Subscribers',
      value: formatNumber(latestData.freeSubscribers),
      icon: Users,
      color: 'text-gray-400',
    },
    {
      label: 'Paid Subscribers',
      value: formatNumber(latestData.paidSubscribers),
      icon: Users,
      color: 'text-white',
    },
    {
      label: 'Total Reactions',
      value: formatNumber(totalReactions),
      icon: Heart,
      color: 'text-white',
    },
    {
      label: 'Total Restacks',
      value: formatNumber(totalRestacks),
      icon: Repeat2,
      color: 'text-white',
    },
    {
      label: 'Total Comments',
      value: formatNumber(totalComments),
      icon: MessageCircle,
      color: 'text-white',
    },
    {
      label: 'Total Clicks',
      value: formatNumber(totalClicks),
      icon: MousePointer,
      color: 'text-white',
    },
  ];

  // Prepare engagement data for chart
  const engagementData = analytics.slice(-14).map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Reactions: d.reactions,
    Restacks: d.restacks,
    Comments: d.comments,
    Clicks: d.clicks,
  }));

  // Prepare subscriber growth data
  const subscriberData = analytics.slice(-14).map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Total Subscribers': d.subscribers,
    'Free': d.freeSubscribers,
    'Paid': d.paidSubscribers,
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Analytics Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon size={20} className={stat.color} />
                {stat.change && (
                  <span className="text-xs text-white bg-black px-2 py-1 rounded">
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Subscriber Growth Chart */}
      <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Subscriber Growth (Last 14 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={subscriberData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
            <XAxis dataKey="date" stroke="#808080" style={{ fontSize: '12px' }} />
            <YAxis stroke="#808080" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333333',
                borderRadius: '6px',
                color: '#ffffff',
              }}
            />
            <Legend wrapperStyle={{ color: '#ffffff' }} />
            <Line type="monotone" dataKey="Total Subscribers" stroke="#ffffff" strokeWidth={2} dot={{ fill: '#ffffff' }} />
            <Line type="monotone" dataKey="Free" stroke="#808080" strokeWidth={2} dot={{ fill: '#808080' }} />
            <Line type="monotone" dataKey="Paid" stroke="#cccccc" strokeWidth={2} dot={{ fill: '#cccccc' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement Metrics Chart */}
      <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Engagement Metrics (Last 14 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
            <XAxis dataKey="date" stroke="#808080" style={{ fontSize: '12px' }} />
            <YAxis stroke="#808080" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333333',
                borderRadius: '6px',
                color: '#ffffff',
              }}
            />
            <Legend wrapperStyle={{ color: '#ffffff' }} />
            <Bar dataKey="Reactions" fill="#ffffff" />
            <Bar dataKey="Restacks" fill="#cccccc" />
            <Bar dataKey="Comments" fill="#999999" />
            <Bar dataKey="Clicks" fill="#666666" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
