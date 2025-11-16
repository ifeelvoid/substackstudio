'use client';

import { useState } from 'react';
import { SubstackNote } from '@/lib/types';
import { formatNumber, categorizePerformance } from '@/lib/utils';
import { Download, Upload, Zap, Rocket, Flame, HelpCircle, Heart, Repeat2, MessageCircle, MousePointer } from 'lucide-react';
import yaml from 'js-yaml';
import Papa from 'papaparse';

interface NotesProps {
  notes: SubstackNote[];
  onExport: (format: 'yaml' | 'csv') => void;
  onImport: (notes: SubstackNote[]) => void;
}

export default function Notes({ notes, onExport, onImport }: NotesProps) {
  const [filter, setFilter] = useState<'all' | 'dynamo' | 'rocket' | 'burner' | 'wonder'>('all');

  const performanceCategories = [
    { id: 'dynamo' as const, label: 'Dynamo', icon: Zap, color: 'bg-white text-black', description: 'High conversion & engagement' },
    { id: 'rocket' as const, label: 'Rocket', icon: Rocket, color: 'bg-gray-300 text-black', description: 'Viral, low conversion' },
    { id: 'burner' as const, label: 'Burner', icon: Flame, color: 'bg-gray-500 text-white', description: 'Steady performer' },
    { id: 'wonder' as const, label: 'Wonder', icon: HelpCircle, color: 'bg-gray-700 text-white', description: 'Needs optimization' },
  ];

  const filteredNotes = filter === 'all'
    ? notes.filter(n => n.status === 'published' && n.metrics)
    : notes.filter(n => n.status === 'published' && n.performanceCategory === filter);

  const handleExportYAML = () => {
    const data = yaml.dump(notes);
    const blob = new Blob([data], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'substack-notes.yaml';
    a.click();
  };

  const handleExportCSV = () => {
    const csvData = notes.map(note => ({
      id: note.id,
      content: note.content,
      scheduledDate: note.scheduledDate?.toISOString() || '',
      scheduledTime: note.scheduledTime,
      status: note.status,
      reactions: note.metrics?.reactions || 0,
      restacks: note.metrics?.restacks || 0,
      comments: note.metrics?.comments || 0,
      clicks: note.metrics?.clicks || 0,
      freeSubscribers: note.metrics?.freeSubscribers || 0,
      paidSubscribers: note.metrics?.paidSubscribers || 0,
      performanceCategory: note.performanceCategory || '',
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'substack-notes.csv';
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;

      if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
        try {
          const data = yaml.load(content) as SubstackNote[];
          onImport(data);
          alert('Notes imported successfully!');
        } catch (error) {
          alert('Error importing YAML file');
        }
      } else if (file.name.endsWith('.csv')) {
        Papa.parse(content, {
          header: true,
          complete: (results) => {
            const notes = results.data.map((row: any) => ({
              id: row.id,
              content: row.content,
              scheduledDate: row.scheduledDate ? new Date(row.scheduledDate) : null,
              scheduledTime: row.scheduledTime,
              status: row.status,
              metrics: {
                reactions: parseInt(row.reactions) || 0,
                restacks: parseInt(row.restacks) || 0,
                comments: parseInt(row.comments) || 0,
                clicks: parseInt(row.clicks) || 0,
                freeSubscribers: parseInt(row.freeSubscribers) || 0,
                paidSubscribers: parseInt(row.paidSubscribers) || 0,
              },
              performanceCategory: row.performanceCategory || undefined,
            })) as SubstackNote[];
            onImport(notes);
            alert('Notes imported successfully!');
          },
          error: () => {
            alert('Error importing CSV file');
          },
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Notes Performance</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportYAML}
            className="flex items-center space-x-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200"
          >
            <Download size={18} />
            <span>Export YAML</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <label className="flex items-center space-x-2 rounded-md bg-[#1a1a1a] border border-white px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a] cursor-pointer">
            <Upload size={18} />
            <span>Import</span>
            <input
              type="file"
              accept=".yaml,.yml,.csv"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Performance Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {performanceCategories.map((category) => {
          const Icon = category.icon;
          const count = notes.filter(n => n.performanceCategory === category.id).length;
          return (
            <button
              key={category.id}
              onClick={() => setFilter(filter === category.id ? 'all' : category.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                filter === category.id
                  ? 'border-white ' + category.color
                  : 'border-[#333333] bg-[#1a1a1a] hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon size={24} className={filter === category.id ? '' : 'text-white'} />
                <span className={`text-2xl font-bold ${filter === category.id ? '' : 'text-white'}`}>{count}</span>
              </div>
              <div className={`text-sm font-medium mb-1 ${filter === category.id ? '' : 'text-white'}`}>
                {category.label}
              </div>
              <div className={`text-xs ${filter === category.id ? 'opacity-80' : 'text-gray-400'}`}>
                {category.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 flex items-center space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-white text-black'
              : 'bg-[#1a1a1a] text-white border border-[#333333] hover:bg-[#2a2a2a]'
          }`}
        >
          All Published ({notes.filter(n => n.status === 'published' && n.metrics).length})
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No notes found in this category
          </div>
        ) : (
          filteredNotes.map((note) => {
            const category = performanceCategories.find(c => c.id === note.performanceCategory);
            const Icon = category?.icon || HelpCircle;

            return (
              <div
                key={note.id}
                className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-white font-medium mb-2">{note.content}</div>
                    {note.scheduledDate && (
                      <div className="text-xs text-gray-400">
                        {note.scheduledDate.toLocaleDateString()} at {note.scheduledTime}
                      </div>
                    )}
                  </div>
                  {category && (
                    <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-md ${category.color}`}>
                      <Icon size={14} />
                      <span className="text-xs font-medium">{category.label}</span>
                    </div>
                  )}
                </div>

                {note.metrics && (
                  <div className="grid grid-cols-6 gap-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Heart size={14} className="text-gray-400" />
                      </div>
                      <div className="text-sm font-medium text-white">{formatNumber(note.metrics.reactions)}</div>
                      <div className="text-xs text-gray-400">Reactions</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Repeat2 size={14} className="text-gray-400" />
                      </div>
                      <div className="text-sm font-medium text-white">{formatNumber(note.metrics.restacks)}</div>
                      <div className="text-xs text-gray-400">Restacks</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <MessageCircle size={14} className="text-gray-400" />
                      </div>
                      <div className="text-sm font-medium text-white">{formatNumber(note.metrics.comments)}</div>
                      <div className="text-xs text-gray-400">Comments</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <MousePointer size={14} className="text-gray-400" />
                      </div>
                      <div className="text-sm font-medium text-white">{formatNumber(note.metrics.clicks)}</div>
                      <div className="text-xs text-gray-400">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-white">{formatNumber(note.metrics.freeSubscribers)}</div>
                      <div className="text-xs text-gray-400">Free Subs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-white">{formatNumber(note.metrics.paidSubscribers)}</div>
                      <div className="text-xs text-gray-400">Paid Subs</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
