'use client';

import { Calendar, BarChart3, TrendingUp, FileText } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'scheduler', label: 'Scheduler', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'growth', label: 'Growth', icon: TrendingUp },
    { id: 'notes', label: 'Notes', icon: FileText },
  ];

  return (
    <nav className="border-b border-[#333333] bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">Substack Studio</h1>
          </div>
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                    activeTab === tab.id
                      ? 'bg-white text-black'
                      : 'text-white hover:bg-[#1a1a1a]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
