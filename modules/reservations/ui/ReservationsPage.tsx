'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useReservations } from '../logic/useReservations';
import { useHousekeeping } from '../../housekeeping/logic/useHousekeeping';
import { Reservation, Room } from '../../../core/types';
import { useCurrency } from '@/core/hooks/useCurrency';

function DraggableReservation({ reservation }: { reservation: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `res-${reservation.id}`,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`absolute h-8 rounded cursor-move shadow-md ${reservation.status === 'checked_in' ? 'bg-green-500' : 'bg-blue-500'} text-white text-xs flex items-center px-1 ${isDragging ? 'opacity-50' : ''}`}
    >
      {reservation.guest_name}
    </div>
  );
}

function DroppableCell({ date, roomNumber, onSelect, width }: { date: string; roomNumber: number; onSelect: (room: number, date: string) => void; width: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${roomNumber}-${date}`,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ width: `${width}px` }}
      className={`h-10 border-r border-gray-200 ${isOver ? 'bg-blue-100' : 'bg-white'} cursor-pointer`}
      onMouseDown={() => onSelect(roomNumber, date)}
      onMouseEnter={() => onSelect(roomNumber, date)}
    ></div>
  );
}

export function ReservationsPage() {
  const { t } = useTranslation('common');
  const { reservations, isLoading, createReservation, updateReservation, deleteReservation, updateRoom } = useReservations();
  const { createTask } = useHousekeeping();
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'list' | 'gantt'>('gantt');
  const [form, setForm] = useState<Omit<Reservation, 'id' | 'created_at'>>({
    guest_name: '',
    room_number: undefined,
    check_in: '',
    check_out: '',
    status: 'booked',
    room_type: '',
  });
  const [selection, setSelection] = useState<{ room: number; start: string; end: string } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'custom'>('week');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const today = new Date();

  const getDays = () => {
    let startDate = new Date(today);
    let length = 30;

    switch (viewMode) {
      case 'day':
        startDate = new Date(today);
        length = 1;
        break;
      case 'week':
        startDate.setDate(today.getDate() - today.getDay());
        length = 7;
        break;
      case 'month':
        startDate.setDate(1);
        length = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        break;
      case 'custom':
        startDate = new Date(customDate);
        length = 7; // Show 7 days from custom date
        break;
    }

    return Array.from({ length }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  const days = getDays();
  const cellWidth = Math.max(50, Math.min(120, days.length <= 7 ? 140 : days.length <= 14 ? 100 : days.length <= 30 ? 80 : 60)); // Dynamic width based on days count

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReservation.mutate(form);
    setForm({ guest_name: '', room_number: undefined, check_in: '', check_out: '', status: 'booked', room_type: '' });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id.startsWith('res-')) {
      const resId = parseInt(active.id.split('-')[1]);
      const parts = over.id.split('-');
      const targetRoom = parseInt(parts[1]);
      const targetDate = parts[2];
      // Move reservation to target room and start on targetDate
      const res = reservations?.find(r => r.id === resId);
      if (res) {
        // Check room status if moving to today's date or past
        const today = new Date().toISOString().split('T')[0];
        if (targetDate <= today) {
          const room = rooms.find(r => r.number === targetRoom);
          if (room && room.status !== 'available') {
            alert(t('reservations.roomNotClean', { room: targetRoom }));
            createTask.mutate({ room_number: targetRoom, assigned_to: 'Auto', status: 'pending' });
            // Still allow the move, but notify
          }
        }
        // Assuming check_in and check_out are added
        const duration = 2; // Mock duration
        const newCheckOut = new Date(new Date(targetDate).getTime() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        updateReservation.mutate({ id: resId, room_number: targetRoom, check_in: targetDate, check_out: newCheckOut });
      }
    }
  };

  const handleCellSelect = (room: number, date: string) => {
    if (!isSelecting) {
      setSelection({ room, start: date, end: date });
      setIsSelecting(true);
    } else {
      if (selection && selection.room === room) {
        setSelection({ ...selection, end: date });
      }
    }
  };

  const handleMouseUp = () => {
    if (selection) {
      // Open form for new reservation
      setForm({
        guest_name: '',
        room_number: selection.room,
        check_in: selection.start,
        check_out: selection.end,
        status: 'booked',
        room_type: ''
      });
      setActiveTab('list'); // Switch to list to show form
      setIsSelecting(false);
      setSelection(null);
    }
  };

  const rooms: Room[] = [
    { id: 1, number: 101, type: 'Standard', status: 'available', price: 2500, capacity: 2, amenities: [], maintenance_notes: [] },
    { id: 2, number: 102, type: 'Deluxe', status: 'occupied', price: 3200, capacity: 2, amenities: [], maintenance_notes: [] },
    { id: 3, number: 103, type: 'Suite', status: 'available', price: 4800, capacity: 4, amenities: [], maintenance_notes: [] },
    { id: 4, number: 104, type: 'Standard', status: 'dirty', price: 2500, capacity: 2, amenities: [], maintenance_notes: [] },
    { id: 5, number: 105, type: 'Standard', status: 'available', price: 2500, capacity: 2, amenities: [], maintenance_notes: [] },
    { id: 6, number: 201, type: 'Apartmán', status: 'available', price: 4200, capacity: 3, amenities: [], maintenance_notes: [] },
    { id: 7, number: 202, type: 'Apartmán', status: 'occupied', price: 4200, capacity: 3, amenities: [], maintenance_notes: [] },
    { id: 8, number: 301, type: 'Suite', status: 'maintenance', price: 4800, capacity: 4, amenities: [], maintenance_notes: [] },
  ];

  const getStatusLabel = (status: Reservation['status']) => {
    return t(`reservations.${status}`);
  };

  const getPosition = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const startIndex = Math.max(0, Math.floor((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return { left: startIndex * 32, width: duration * 32 };
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div><p className="ml-4 text-gray-600">{t('reservations.loading')}</p></div>;

  return (
    <div className="space-y-6 p-4 lg:p-6 xl:p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">{t('reservations.title')}</h1>
        <p className="text-neutral-dark">Manage reservations and room assignments</p>
      </div>
      <div className="flex bg-neutral-light rounded-lg p-1 border border-neutral-medium">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${activeTab === 'list' ? 'bg-white shadow-sm text-primary border border-neutral-medium' : 'text-neutral-dark hover:text-primary'}`}
        >
          List View
        </button>
        <button
          onClick={() => setActiveTab('gantt')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${activeTab === 'gantt' ? 'bg-white shadow-sm text-primary border border-neutral-medium' : 'text-neutral-dark hover:text-primary'}`}
        >
          Timeline View
        </button>
      </div>

      {activeTab === 'list' && (
        <div>
          <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg border border-neutral-medium shadow-sm">
            <h2 className="text-lg font-semibold mb-6 text-foreground">{t('reservations.newReservation')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 lg:gap-6">
              <div>
                <label className="form-label">{t('reservations.guestName')}</label>
                <input
                  type="text"
                  placeholder={t('reservations.enterGuestName')}
                  value={form.guest_name}
                  onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                  className="form-input w-full"
                  required
                />
              </div>
              <div>
                <label className="form-label">{t('reservations.roomNumber')} (optional)</label>
                <input
                  type="number"
                  placeholder={t('reservations.enterRoomNumber')}
                  value={form.room_number || ''}
                  onChange={(e) => setForm({ ...form, room_number: e.target.value ? +e.target.value : undefined })}
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="form-label">{t('reservations.type')}</label>
                <select
                  value={form.room_type}
                  onChange={(e) => setForm({ ...form, room_type: e.target.value })}
                  className="form-input w-full"
                >
                  <option value="">Any</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>
              <div>
                <label className="form-label">{t('reservations.checkIn')}</label>
                <input
                  type="date"
                  value={form.check_in}
                  onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                  className="form-input w-full"
                  required
                />
              </div>
              <div>
                <label className="form-label">{t('reservations.checkOut')}</label>
                <input
                  type="date"
                  value={form.check_out}
                  onChange={(e) => setForm({ ...form, check_out: e.target.value })}
                  className="form-input w-full"
                  required
                />
              </div>
              <div>
                <label className="form-label">{t('reservations.status')}</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Reservation['status'] })}
                  className="form-input w-full"
                >
                  <option value="booked">{t('reservations.booked')}</option>
                  <option value="checked_in">{t('reservations.checkedIn')}</option>
                  <option value="checked_out">{t('reservations.checkedOut')}</option>
                  <option value="cancelled">{t('reservations.cancelled')}</option>
                </select>
              </div>
              <div className="flex items-end">
                 <button type="submit" className="btn-primary w-full py-3">
                   {t('reservations.createReservation')}
                 </button>
              </div>
            </div>
          </form>
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-neutral-medium">
            <table className="w-full">
              <thead className="bg-neutral-light">
                <tr>
                  <th className="p-4 text-left font-semibold text-foreground">ID</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('reservations.guestName')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('reservations.room')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('reservations.status')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('reservations.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {reservations?.map((res) => (
                  <tr key={res.id} className="border-t border-neutral-medium hover:bg-neutral-light/50 transition-colors">
                    <td className="p-4 text-foreground font-medium">{res.id}</td>
                    <td className="p-4 text-foreground font-semibold">{res.guest_name}</td>
                    <td className="p-4 text-neutral-dark">{res.room_number}</td>
                    <td className="p-5">
                      <span className={`status-badge ${
                        res.status === 'booked' ? 'status-booked' :
                        res.status === 'checked_in' ? 'status-checked-in' :
                        res.status === 'checked_out' ? 'status-checked-out' :
                        'status-cancelled'
                      }`}>
                        {getStatusLabel(res.status)}
                      </span>
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => deleteReservation.mutate(res.id)}
                        className="btn-error text-sm px-4 py-2"
                      >
{t('reservations.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'gantt' && (
        <div className="mb-6">
          {/* Mobile-friendly view controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-2 rounded-lg font-medium text-sm ${viewMode === 'day' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {t('reservations.today')}
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-2 rounded-lg font-medium text-sm ${viewMode === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {t('reservations.week')}
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-2 rounded-lg font-medium text-sm ${viewMode === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {t('reservations.month')}
              </button>
              <button
                onClick={() => setViewMode('custom')}
                className={`px-3 py-2 rounded-lg font-medium text-sm ${viewMode === 'custom' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Custom
              </button>
            </div>
            {viewMode === 'custom' && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="form-input text-sm"
              />
            )}
          </div>
        </div>
      )}

      {activeTab === 'gantt' && (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium overflow-hidden">
            {/* Desktop-optimized Gantt container */}
            <div className="overflow-x-auto overflow-y-auto max-h-[70vh] lg:max-h-[80vh] xl:max-h-[85vh]" onMouseUp={handleMouseUp}>
              <div className="min-w-[1000px] lg:min-w-[1200px] xl:min-w-max">
                {/* Header */}
                <div className="flex border-b border-neutral-medium bg-neutral-light sticky top-0 z-10">
                  <div className="w-32 sm:w-36 lg:w-40 xl:w-44 p-3 lg:p-4 font-semibold text-foreground border-r border-neutral-medium text-sm lg:text-base">Room</div>
                  {days.map(day => (
                    <div key={day} style={{ width: `${Math.max(cellWidth, 50)}px` }} className="p-2 lg:p-3 text-sm lg:text-base text-center border-r border-neutral-medium text-neutral-dark font-medium">
                      {new Date(day).getDate()}
                    </div>
                  ))}
                </div>
                {/* Rows */}
                {rooms.map(room => (
                  <div key={room.id} className="flex border-b border-neutral-medium relative hover:bg-neutral-light/30 transition-colors min-h-[70px] lg:min-h-[80px]">
                      <div className="w-32 sm:w-36 lg:w-40 xl:w-44 p-3 lg:p-4 font-medium text-sm lg:text-base text-foreground bg-neutral-light border-r border-neutral-medium flex flex-col justify-center">
                       <span className="truncate">{room.number}</span>
                        <span className="text-xs sm:text-sm lg:text-base text-neutral-dark hidden sm:block">({room.type})</span>
                        <span className="text-xs sm:text-sm lg:text-base text-neutral-dark">{formatCurrency(room.price)}</span>
                       <select
                         value={room.status}
                         onChange={(e) => {
                           e.stopPropagation();
                           updateRoom.mutate({ id: room.id, status: e.target.value as Room['status'] });
                         }}
                           className={`text-xs sm:text-sm lg:text-base px-2 py-1 rounded border-0 w-24 sm:w-28 lg:w-32 ${
                           room.status === 'available' ? 'bg-green-50 text-green-700' :
                           room.status === 'occupied' ? 'bg-red-50 text-red-700' :
                           room.status === 'dirty' ? 'bg-amber-50 text-amber-700' :
                           room.status === 'cleaning' ? 'bg-cyan-50 text-cyan-700' :
                           'bg-neutral-100 text-neutral-700'
                         }`}
                       >
                         <option value="available">Avail</option>
                         <option value="occupied">Occ</option>
                         <option value="maintenance">Maint</option>
                         <option value="dirty">Dirty</option>
                         <option value="cleaning">Clean</option>
                       </select>
                     </div>
                     <div className="flex relative h-10 sm:h-12 lg:h-14">
                      {days.map(day => (
                         <DroppableCell key={day} date={day} roomNumber={room.number} onSelect={handleCellSelect} width={Math.max(cellWidth, 50)} />
                      ))}
                      {reservations?.filter(res => res.room_number === room.number).map(res => {
                        // Mock check_in and check_out
                        const checkIn = res.created_at.split('T')[0];
                        const checkOut = new Date(new Date(checkIn).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const { left, width } = getPosition(checkIn, checkOut);
                        return (
                           <div key={res.id} className="absolute top-1 lg:top-2" style={{ left: left * Math.max(cellWidth, 50) / 32, width: width * Math.max(cellWidth, 50) / 32 }}>
                            <DraggableReservation reservation={{ ...res, check_in: checkIn, check_out: checkOut }} />
                          </div>
                        );
                      })}
                      {selection && selection.room === room.number && (
                        <div className="absolute top-1 lg:top-2 bg-yellow-200 opacity-50 rounded" style={{
                           left: Math.min(days.indexOf(selection.start), days.indexOf(selection.end)) * Math.max(cellWidth, 50),
                           width: (Math.abs(days.indexOf(selection.end) - days.indexOf(selection.start)) + 1) * Math.max(cellWidth, 50)
                         }}></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mobile-friendly legend */}
            <div className="p-4 border-t border-neutral-medium">
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div className="flex items-center bg-primary/10 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded mr-1 sm:mr-2"></div>
                   <span className="text-xs sm:text-sm font-medium text-primary">{t('reservations.booked')}</span>
                </div>
                <div className="flex items-center bg-emerald-50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
                   <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded mr-1 sm:mr-2"></div>
                   <span className="text-xs sm:text-sm font-medium text-emerald-700">{t('reservations.checkedIn')}</span>
                </div>
                <div className="flex items-center bg-green-50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded mr-1 sm:mr-2"></div>
                   <span className="text-xs sm:text-sm font-medium text-green-700">{t('reservations.available')}</span>
                </div>
                <div className="flex items-center bg-red-50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded mr-1 sm:mr-2"></div>
                   <span className="text-xs sm:text-sm font-medium text-red-700">{t('reservations.occupied')}</span>
                </div>
                <div className="flex items-center bg-amber-50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded mr-1 sm:mr-2"></div>
                   <span className="text-xs sm:text-sm font-medium text-amber-700">{t('reservations.dirty')}</span>
                </div>
                <div className="flex items-center bg-cyan-50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded mr-1 sm:mr-2"></div>
                   <span className="text-xs sm:text-sm font-medium text-cyan-700">{t('reservations.cleaning')}</span>
                </div>
              </div>
            </div>
          </div>
        </DndContext>
      )}
    </div>
  );
}