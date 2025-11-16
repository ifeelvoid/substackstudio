'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Scheduler from '@/components/Scheduler';
import Analytics from '@/components/Analytics';
import Growth from '@/components/Growth';
import Notes from '@/components/Notes';
import { SubstackNote, AnalyticsData, GrowthData } from '@/lib/types';
import { generateMockNotes, generateMockAnalytics, generateMockGrowthData, categorizePerformance } from '@/lib/utils';

export default function Home() {
  const [activeTab, setActiveTab] = useState('scheduler');
  const [notes, setNotes] = useState<SubstackNote[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);

  useEffect(() => {
    // Initialize with mock data
    const mockNotes = generateMockNotes();
    const mockAnalytics = generateMockAnalytics();
    const mockGrowth = generateMockGrowthData();

    // Categorize notes
    const categorizedNotes = mockNotes.map(note => ({
      ...note,
      performanceCategory: note.metrics ? categorizePerformance(note) : undefined,
    }));

    setNotes(categorizedNotes);
    setAnalytics(mockAnalytics);
    setGrowthData(mockGrowth);
  }, []);

  const handleAddNote = (noteData: Partial<SubstackNote>) => {
    const newNote: SubstackNote = {
      id: `note-${Date.now()}`,
      content: noteData.content || '',
      scheduledDate: noteData.scheduledDate || null,
      scheduledTime: noteData.scheduledTime || '08:00',
      status: noteData.status || 'draft',
      metrics: noteData.metrics,
      performanceCategory: noteData.performanceCategory,
    };
    setNotes([...notes, newNote]);
  };

  const handleEditNote = (id: string, noteData: Partial<SubstackNote>) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, ...noteData } : note
    ));
  };

  const handleExport = (format: 'yaml' | 'csv') => {
    // Export functionality is handled in the Notes component
  };

  const handleImport = (importedNotes: SubstackNote[]) => {
    setNotes(importedNotes);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-7xl">
        {activeTab === 'scheduler' && (
          <Scheduler
            notes={notes}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics analytics={analytics} notes={notes} />
        )}

        {activeTab === 'growth' && (
          <Growth analytics={analytics} growthData={growthData} />
        )}

        {activeTab === 'notes' && (
          <Notes
            notes={notes}
            onExport={handleExport}
            onImport={handleImport}
          />
        )}
      </main>
    </div>
  );
}
