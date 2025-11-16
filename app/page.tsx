'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Scheduler from '@/components/Scheduler';
import Analytics from '@/components/Analytics';
import Growth from '@/components/Growth';
import Notes from '@/components/Notes';
import { SubstackNote, AnalyticsData, GrowthData } from '@/lib/types';
import { generateMockNotes, generateMockAnalytics, generateMockGrowthData, categorizePerformance } from '@/lib/utils';
import { extensionSync } from '@/lib/extension-sync';

export default function Home() {
  const [activeTab, setActiveTab] = useState('scheduler');
  const [notes, setNotes] = useState<SubstackNote[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [isExtensionConnected, setIsExtensionConnected] = useState(false);

  useEffect(() => {
    // Check if extension is available
    const extensionAvailable = extensionSync.isExtensionAvailable();
    setIsExtensionConnected(extensionAvailable);

    if (extensionAvailable) {
      // Try to load data from extension
      extensionSync.getExtensionData().then(extensionData => {
        if (extensionData && extensionData.notes && extensionData.notes.length > 0) {
          // Use extension data
          const categorizedNotes = extensionData.notes.map((note: SubstackNote) => ({
            ...note,
            performanceCategory: note.metrics ? categorizePerformance(note) : undefined,
          }));
          setNotes(categorizedNotes);

          // Use extension analytics if available
          if (extensionData.analytics && extensionData.analytics.length > 0) {
            setAnalytics(extensionData.analytics);
          } else {
            setAnalytics(generateMockAnalytics());
          }
          setGrowthData(generateMockGrowthData());
        } else {
          // Use mock data as fallback
          initializeMockData();
        }
      });

      // Start auto-sync
      extensionSync.startAutoSync((data) => {
        if (data && data.notes) {
          const categorizedNotes = data.notes.map((note: SubstackNote) => ({
            ...note,
            performanceCategory: note.metrics ? categorizePerformance(note) : undefined,
          }));
          setNotes(categorizedNotes);
        }
      });
    } else {
      // No extension, use mock data
      initializeMockData();
    }

    // Cleanup
    return () => {
      extensionSync.stopAutoSync();
    };
  }, []);

  function initializeMockData() {
    const mockNotes = generateMockNotes();
    const mockAnalytics = generateMockAnalytics();
    const mockGrowth = generateMockGrowthData();

    const categorizedNotes = mockNotes.map(note => ({
      ...note,
      performanceCategory: note.metrics ? categorizePerformance(note) : undefined,
    }));

    setNotes(categorizedNotes);
    setAnalytics(mockAnalytics);
    setGrowthData(mockGrowth);
  }

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

      {/* Extension Status Banner */}
      {!isExtensionConnected && (
        <div className="bg-[#1a1a1a] border-b border-[#333333] px-4 py-2 text-center text-sm text-gray-400">
          💡 Install the Chrome Extension for real Substack integration. Using demo data.
        </div>
      )}
      {isExtensionConnected && (
        <div className="bg-[#1a1a1a] border-b border-[#333333] px-4 py-2 text-center text-sm text-white">
          ✓ Extension Connected - Syncing with Substack
        </div>
      )}

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
