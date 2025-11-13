'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRooms } from '../logic/useRooms';
import { MaintenanceNote } from '../../../core/types';

function MaintenanceNoteCard({ note, roomId, onUpdate }: {
  note: MaintenanceNote;
  roomId: number;
  onUpdate: (noteId: string, data: Partial<MaintenanceNote>) => void;
}) {
  const { t } = useTranslation('common');
  const getPriorityColor = (priority: MaintenanceNote['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: MaintenanceNote['status']) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor(note.status)}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(note.status)}`}>
            {note.status.replace('_', ' ').toUpperCase()}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(note.date).toLocaleDateString()}
          </span>
        </div>
          <select
            value={note.status}
            onChange={(e) => onUpdate(note.id, { status: e.target.value as MaintenanceNote['status'] })}
            className="text-xs border rounded px-2 py-1"
          >
            <option value="open">{t('rooms.open')}</option>
            <option value="in_progress">{t('rooms.inProgress')}</option>
            <option value="resolved">{t('rooms.resolved')}</option>
          </select>
      </div>

      <p className="text-sm mb-2">{note.note}</p>

      {note.reported_by && (
        <p className="text-xs text-gray-600">Reported by: {note.reported_by}</p>
      )}
    </div>
  );
}

function AddMaintenanceNoteForm({ roomId, onAdd, onCancel }: {
  roomId: number;
  onAdd: (note: Omit<MaintenanceNote, 'id'>) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation('common');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState<MaintenanceNote['priority']>('medium');
  const [reportedBy, setReportedBy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onAdd({
        date: new Date().toISOString().split('T')[0],
        note: note.trim(),
        priority,
        status: 'open',
        reported_by: reportedBy.trim() || undefined,
      });
      setNote('');
      setPriority('medium');
      setReportedBy('');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium mb-3">{t('rooms.addMaintenanceNote')}</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="form-label text-sm">{t('rooms.note')}</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="form-input w-full text-sm"
            rows={3}
            placeholder={t('rooms.describeIssue')}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label text-sm">{t('rooms.priority')}</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as MaintenanceNote['priority'])}
              className="form-input w-full text-sm"
            >
              <option value="low">{t('rooms.low')}</option>
              <option value="medium">{t('rooms.medium')}</option>
              <option value="high">{t('rooms.high')}</option>
              <option value="urgent">{t('rooms.urgentPriority')}</option>
            </select>
          </div>

          <div>
            <label className="form-label text-sm">{t('rooms.reportedBy')}</label>
            <input
              type="text"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              className="form-input w-full text-sm"
              placeholder={t('rooms.yourName')}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary text-sm px-3 py-1"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="btn-primary text-sm px-3 py-1"
          >
            {t('rooms.addNote')}
          </button>
        </div>
      </form>
    </div>
  );
}

export function MaintenancePanel({ roomId }: { roomId: number }) {
  const { t } = useTranslation('common');
  const { rooms, addMaintenanceNote, updateMaintenanceNote } = useRooms();
  const [showAddForm, setShowAddForm] = useState(false);

  const room = rooms?.find(r => r.id === roomId);
  if (!room) return null;

  const handleAddNote = (note: Omit<MaintenanceNote, 'id'>) => {
    addMaintenanceNote.mutate({ roomId, note });
    setShowAddForm(false);
  };

  const handleUpdateNote = (noteId: string, updates: Partial<MaintenanceNote>) => {
    updateMaintenanceNote.mutate({ roomId, noteId, updates });
  };

  const openNotes = room.maintenance_notes.filter(note => note.status !== 'resolved');
  const resolvedNotes = room.maintenance_notes.filter(note => note.status === 'resolved');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {t('rooms.maintenanceNotes')} - {t('rooms.roomNumber')} {room.room_number}
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary text-sm px-4 py-2"
        >
          {showAddForm ? t('cancel') : t('rooms.addNote')}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddMaintenanceNoteForm
            roomId={roomId}
            onAdd={handleAddNote}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="space-y-6">
        {openNotes.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-3">{t('rooms.openIssues')} ({openNotes.length})</h4>
            <div className="space-y-3">
              {openNotes.map((note) => (
                <MaintenanceNoteCard
                  key={note.id}
                  note={note}
                  roomId={roomId}
                  onUpdate={handleUpdateNote}
                />
              ))}
            </div>
          </div>
        )}

        {resolvedNotes.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-3">{t('rooms.resolvedIssues')} ({resolvedNotes.length})</h4>
            <div className="space-y-3">
              {resolvedNotes.map((note) => (
                <MaintenanceNoteCard
                  key={note.id}
                  note={note}
                  roomId={roomId}
                  onUpdate={handleUpdateNote}
                />
              ))}
            </div>
          </div>
        )}

        {room.maintenance_notes.length === 0 && !showAddForm && (
          <div className="text-center py-8 text-gray-500">
            <p>{t('rooms.noMaintenanceNotes')}</p>
            <p className="text-sm">{t('rooms.clickAddNote')}</p>
          </div>
        )}
      </div>
    </div>
  );
}