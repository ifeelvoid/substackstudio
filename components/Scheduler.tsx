'use client';

import { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { SubstackNote, TimeSlot, DayOfWeek } from '@/lib/types';
import { format, addDays, startOfWeek } from 'date-fns';

interface SchedulerProps {
  notes: SubstackNote[];
  onAddNote: (note: Partial<SubstackNote>) => void;
  onEditNote: (id: string, note: Partial<SubstackNote>) => void;
}

export default function Scheduler({ notes, onAddNote, onEditNote }: SchedulerProps) {
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; time: string } | null>(null);

  // Time slots from 8 AM to 8 PM in 2-hour intervals
  const timeSlots: TimeSlot[] = [
    { hour: 8, minute: 0, label: '08:00 AM' },
    { hour: 10, minute: 0, label: '10:00 AM' },
    { hour: 12, minute: 0, label: '12:00 PM' },
    { hour: 14, minute: 0, label: '02:00 PM' },
    { hour: 16, minute: 0, label: '04:00 PM' },
    { hour: 18, minute: 0, label: '06:00 PM' },
    { hour: 20, minute: 0, label: '08:00 PM' },
  ];

  // Get current week
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const dayLabels: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Get note for specific day and time
  const getNoteForSlot = (day: Date, time: string): SubstackNote | undefined => {
    return notes.find((note) => {
      if (!note.scheduledDate) return false;
      const noteDate = new Date(note.scheduledDate);
      return (
        noteDate.toDateString() === day.toDateString() &&
        note.scheduledTime === time
      );
    });
  };

  const handleSlotClick = (dayIndex: number, time: string) => {
    const day = weekDays[dayIndex];
    const existingNote = getNoteForSlot(day, time);

    if (existingNote) {
      // Edit existing note
      const newContent = prompt('Edit note:', existingNote.content);
      if (newContent !== null) {
        onEditNote(existingNote.id, { content: newContent });
      }
    } else {
      // Add new note
      const content = prompt('Enter note content:');
      if (content) {
        onAddNote({
          content,
          scheduledDate: day,
          scheduledTime: time,
          status: 'scheduled',
        });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Weekly Schedule</h2>
        <button
          onClick={() => {
            const content = prompt('Enter note content:');
            if (content) {
              onAddNote({
                content,
                scheduledDate: null,
                scheduledTime: '08:00',
                status: 'draft',
              });
            }
          }}
          className="flex items-center space-x-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200"
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="p-2"></div>
            {weekDays.map((day, index) => (
              <div key={index} className="p-2 text-center border border-[#333333] rounded-md bg-[#1a1a1a]">
                <div className="text-sm font-medium text-white">{dayLabels[index]}</div>
                <div className="text-xs text-gray-400">{format(day, 'MMM d')}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((slot) => (
            <div key={slot.label} className="grid grid-cols-8 gap-2 mb-2">
              {/* Time Label */}
              <div className="flex items-center justify-center p-2 border border-[#333333] rounded-md bg-[#1a1a1a]">
                <Clock size={14} className="mr-1 text-gray-400" />
                <span className="text-xs text-gray-400">{slot.label}</span>
              </div>

              {/* Day Cells */}
              {weekDays.map((day, dayIndex) => {
                const note = getNoteForSlot(day, slot.label);
                return (
                  <button
                    key={dayIndex}
                    onClick={() => handleSlotClick(dayIndex, slot.label)}
                    className={`min-h-[80px] p-2 text-left border rounded-md transition-all ${
                      note
                        ? 'border-white bg-white text-black hover:bg-gray-200'
                        : 'border-[#333333] bg-[#0a0a0a] hover:bg-[#1a1a1a] hover:border-gray-500'
                    }`}
                  >
                    {note && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium truncate">{note.content}</div>
                        <div className="flex items-center space-x-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            note.status === 'published'
                              ? 'bg-black text-white'
                              : note.status === 'scheduled'
                              ? 'bg-gray-200 text-black'
                              : 'bg-gray-100 text-black'
                          }`}>
                            {note.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 rounded border border-white bg-white"></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 rounded border border-[#333333] bg-[#0a0a0a]"></div>
          <span>Empty Slot</span>
        </div>
      </div>
    </div>
  );
}
