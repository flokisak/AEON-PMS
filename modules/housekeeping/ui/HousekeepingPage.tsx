'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHousekeeping } from '../logic/useHousekeeping';
import { HousekeepingTask } from '@/core/types';

export function HousekeepingPage() {
  const { t } = useTranslation('common');
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useHousekeeping();
  const [form, setForm] = useState<Omit<HousekeepingTask, 'id' | 'updated_at'>>({
    room_number: 0,
    assigned_to: '',
    status: 'pending',
  });
  const [editingTask, setEditingTask] = useState<HousekeepingTask | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, ...form });
      setEditingTask(null);
    } else {
      createTask.mutate(form);
    }
    setForm({ room_number: 0, assigned_to: '', status: 'pending' });
  };

  const handleEdit = (task: HousekeepingTask) => {
    setEditingTask(task);
    setForm({
      room_number: task.room_number,
      assigned_to: task.assigned_to,
      status: task.status,
    });
  };

  const handleCancel = () => {
    setEditingTask(null);
    setForm({ room_number: 0, assigned_to: '', status: 'pending' });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">{t('housekeeping.title')}</h1>
        <p className="text-neutral-dark">{t('housekeeping.description')}</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-neutral-medium shadow-sm">
        <h2 className="text-lg font-semibold mb-6 text-foreground">
          {editingTask ? t('housekeeping.editTask') : t('housekeeping.addNewTask')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="form-label">{t('housekeeping.roomNumber')}</label>
            <input
              type="number"
              placeholder={t('housekeeping.roomNumberPlaceholder')}
              value={form.room_number}
              onChange={(e) => setForm({ ...form, room_number: +e.target.value })}
              className="form-input w-full"
              required
            />
          </div>
          <div>
            <label className="form-label">{t('housekeeping.assignedTo')}</label>
            <input
              type="text"
              placeholder={t('housekeeping.staffMemberPlaceholder')}
              value={form.assigned_to}
              onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
              className="form-input w-full"
              required
            />
          </div>
          <div>
            <label className="form-label">{t('housekeeping.status')}</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as HousekeepingTask['status'] })}
              className="form-input w-full"
            >
              <option value="pending">{t('housekeeping.taskStatus.pending')}</option>
              <option value="in_progress">{t('housekeeping.taskStatus.inProgress')}</option>
              <option value="done">{t('housekeeping.taskStatus.done')}</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1 py-3">
                {editingTask ? t('housekeeping.updateTask') : t('housekeeping.addTask')}
              </button>
              {editingTask && (
                <button type="button" onClick={handleCancel} className="btn-secondary flex-1 py-3">
                  {t('housekeeping.cancel')}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-neutral-medium">
        <table className="w-full">
          <thead className="bg-neutral-light">
            <tr>
              <th className="p-4 text-left font-semibold text-foreground">{t('housekeeping.id')}</th>
              <th className="p-4 text-left font-semibold text-foreground">{t('housekeeping.room')}</th>
              <th className="p-4 text-left font-semibold text-foreground">{t('housekeeping.assignedTo')}</th>
              <th className="p-4 text-left font-semibold text-foreground">{t('housekeeping.status')}</th>
              <th className="p-4 text-left font-semibold text-foreground">{t('housekeeping.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task) => (
              <tr key={task.id} className="border-t border-neutral-medium hover:bg-neutral-light/50 transition-colors">
                <td className="p-4 text-foreground font-medium">{task.id}</td>
                <td className="p-4 text-foreground font-semibold">{task.room_number}</td>
                <td className="p-4 text-neutral-dark">{task.assigned_to}</td>
                <td className="p-4">
                  <span className={`status-badge ${
                    task.status === 'pending' ? 'bg-neutral-100 text-neutral-700' :
                    task.status === 'in_progress' ? 'bg-cyan-50 text-cyan-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                     {task.status === 'pending' ? t('housekeeping.taskStatus.pending').toUpperCase() :
                      task.status === 'in_progress' ? t('housekeeping.taskStatus.inProgress').toUpperCase() :
                      t('housekeeping.taskStatus.done').toUpperCase()}
                  </span>
                </td>
                 <td className="p-4">
                   <div className="flex gap-2">
                     <button
                       onClick={() => handleEdit(task)}
                       className="btn-secondary text-sm px-4 py-2"
                     >
                       {t('housekeeping.edit')}
                     </button>
                     <button
                       onClick={() => {
                         if (confirm(t('housekeeping.confirmDeleteTask'))) {
                           deleteTask.mutate(task.id);
                         }
                       }}
                       className="btn-error text-sm px-4 py-2"
                     >
                       {t('housekeeping.delete')}
                     </button>
                   </div>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!tasks || tasks.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <p>{t('housekeeping.noTasks')}</p>
          </div>
        )}
      </div>
    </div>
  );
}