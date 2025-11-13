'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { useReservations } from '../logic/useReservations';
import { useHousekeeping } from '../../housekeeping/logic/useHousekeeping';
import { Reservation, Room } from '../../../core/types';
import { useCurrency } from '@/core/hooks/useCurrency';
import { CreateReservationModal } from './CreateReservationModal';
import { EditReservationModal } from './EditReservationModal';

function DraggableReservation({ reservation, onEdit }: { reservation: Reservation & { check_in?: string; check_out?: string }; onEdit: (res: Reservation) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `res-${reservation.id}`,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked_in':
        return {
          bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
          border: 'border-emerald-700',
          shadow: 'shadow-emerald-200'
        };
      case 'confirmed':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          border: 'border-blue-700',
          shadow: 'shadow-blue-200'
        };
      case 'booked':
      default:
        return {
          bg: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
          border: 'border-indigo-700',
          shadow: 'shadow-indigo-200'
        };
    }
  };

  const colors = getStatusColor(reservation.status);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`absolute top-1 h-8 rounded-lg cursor-pointer border-2 ${colors.bg} ${colors.border} ${colors.shadow} text-white text-xs font-semibold flex items-center px-3 transition-all duration-200 ${isDragging ? 'opacity-70 scale-105 shadow-xl' : 'hover:opacity-90 hover:scale-102 hover:shadow-lg'}`}
      onClick={(e) => {
        e.stopPropagation();
        onEdit(reservation);
      }}
      title={`${reservation.guest_name} - ${reservation.status} - Click to edit`}
    >
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <div className="w-2 h-2 bg-white bg-opacity-70 rounded-full flex-shrink-0"></div>
        <span className="truncate font-medium">{reservation.guest_name}</span>
        {reservation.room_number && (
          <span className="text-white text-opacity-80 text-xs flex-shrink-0">
            #{reservation.room_number}
          </span>
        )}
      </div>
      <div className="ml-2 flex-shrink-0">
        <div className="w-1.5 h-1.5 bg-white bg-opacity-60 rounded-full"></div>
      </div>
    </div>
  );
}

function DroppableCell({
  date,
  roomNumber,
  onSelect,
  width,
  isInSelection = false,
  isCreatingReservation = false
}: {
  date: string;
  roomNumber: number;
  onSelect: (room: number, date: string) => void;
  width: number;
  isInSelection?: boolean;
  isCreatingReservation?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${roomNumber}-${date}`,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ width: `${width}px` }}
      className={`h-10 border-r border-gray-200 cursor-pointer relative ${
        isOver ? 'bg-blue-100' : 'bg-white'
      } ${isCreatingReservation ? 'bg-blue-50' : ''}`}
      onMouseDown={() => onSelect(roomNumber, date)}
      onMouseEnter={() => onSelect(roomNumber, date)}
    >
      {isInSelection && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-md shadow-lg border-2 border-blue-600 flex items-center justify-center"
          style={{
            margin: '2px',
            height: 'calc(100% - 4px)',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.2)'
          }}
        >
          <div className="text-white text-xs font-semibold opacity-90">
            New Reservation
          </div>
        </div>
      )}
    </div>
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
    room_id: undefined,
    room_number: undefined, // For display purposes
    check_in: '',
    check_out: '',
    status: 'booked',
    room_type: '',
  });
  const [selection, setSelection] = useState<{ room: number; start: string; end: string } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'custom'>('week');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
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
  const cellWidth = Math.max(24, Math.min(64, 800 / days.length)); // Dynamic width: min 24px, max 64px, based on 800px total width

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReservation.mutate(form);
    setForm({ guest_name: '', room_id: undefined, room_number: undefined, check_in: '', check_out: '', status: 'booked', room_type: '' });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;

    if (overId && activeId.startsWith('res-')) {
      const resId = parseInt(activeId.split('-')[1]);
      const parts = overId.split('-');
      const targetRoom = parseInt(parts[1]);
      const targetDate = parts[2];
      // Move reservation to target room and start on targetDate
      const res = reservations?.find(r => r.id === resId);
      if (res) {
        // Check room status if moving to today's date or past
        const today = new Date().toISOString().split('T')[0];
        if (targetDate <= today) {
          const room = rooms.find(r => r.room_number === targetRoom);
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
      // Open create reservation modal
      setShowCreateModal(true);
      setIsSelecting(false);
      // Keep selection for the modal
    }
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setShowEditModal(true);
  };

  const handleCreateSuccess = () => {
    setSelection(null);
    setShowCreateModal(false);
  };

  const handleEditSuccess = () => {
    setEditingReservation(null);
    setShowEditModal(false);
  };

  const rooms: Room[] = [
    { id: 1, room_number: 101, type: 'Standard', status: 'available', price: 100, capacity: 2, amenities: [], maintenance_notes: [] },
    { id: 2, room_number: 102, type: 'Deluxe', status: 'occupied', price: 150, capacity: 2, amenities: [], maintenance_notes: [] },
    { id: 3, room_number: 103, type: 'Suite', status: 'available', price: 200, capacity: 4, amenities: [], maintenance_notes: [] },
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
    <div className="space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
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
                  onChange={(e) => {
                    const roomNum = e.target.value ? +e.target.value : undefined;
                    const room = rooms.find(r => r.room_number === roomNum);
                    setForm({ 
                      ...form, 
                      room_number: roomNum,
                      room_id: room ? room.id.toString() : undefined
                    });
                  }}
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
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'day' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {t('reservations.today')}
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {t('reservations.week')}
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {t('reservations.month')}
            </button>
            <button
              onClick={() => setViewMode('custom')}
              className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'custom' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Custom
            </button>
          </div>
          {viewMode === 'custom' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="form-input"
            />
          )}
        </div>
      )}

      {activeTab === 'gantt' && (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-neutral-medium" onMouseUp={handleMouseUp}>
            <div className="min-w-max">
              {/* Header */}
              <div className="flex border-b border-neutral-medium bg-neutral-light">
                <div className="w-32 p-3 font-semibold text-foreground border-r border-neutral-medium">Room</div>
                {days.map(day => (
                  <div key={day} style={{ width: `${cellWidth}px` }} className="p-2 text-xs text-center border-r border-neutral-medium text-neutral-dark font-medium">
                    {new Date(day).getDate()}
                  </div>
                ))}
              </div>
              {/* Rows */}
              {rooms.map(room => (
                <div key={room.id} className="flex border-b border-neutral-medium relative hover:bg-neutral-light/30 transition-colors">
                    <div className="w-32 p-2 font-medium text-sm text-foreground bg-neutral-light border-r border-neutral-medium flex flex-col justify-center">
                      <span className="truncate">{room.room_number} ({room.type})</span>
                     <span className="text-xs text-neutral-dark">{formatCurrency(room.price)}</span>
                     <select
                       value={room.status}
                       onChange={(e) => {
                         e.stopPropagation();
                         updateRoom.mutate({ id: room.id, status: e.target.value as Room['status'] });
                       }}
                        className={`text-xs px-1 py-0.5 rounded border-0 w-24 ${
                          room.status === 'available' ? 'bg-green-50 text-green-700' :
                          room.status === 'occupied' ? 'bg-red-50 text-red-700' :
                          room.status === 'dirty' ? 'bg-amber-50 text-amber-700' :
                          room.status === 'cleaning' ? 'bg-cyan-50 text-cyan-700' :
                          'bg-neutral-100 text-neutral-700'
                        }`}
                     >
                       <option value="available">Available</option>
                       <option value="occupied">Occupied</option>
                       <option value="maintenance">Maintenance</option>
                       <option value="dirty">Dirty</option>
                       <option value="cleaning">Cleaning</option>
                     </select>
                   </div>
                   <div className="flex relative h-10">
                     {days.map(day => {
                       const isInSelection = !!(selection && selection.room === room.room_number &&
                         ((day >= selection.start && day <= selection.end) ||
                          (day >= selection.end && day <= selection.start)));

                       return (
                         <DroppableCell
                           key={day}
                           date={day}
                           roomNumber={room.room_number}
                           onSelect={handleCellSelect}
                           width={cellWidth}
                           isInSelection={isInSelection}
                           isCreatingReservation={!!selection}
                         />
                       );
                     })}
                      {reservations?.filter(res => res.room_number === room.room_number).map(res => {
                       // Mock check_in and check_out
                       const checkIn = res.check_in || res.created_at.split('T')[0];
                       const checkOut = res.check_out || new Date(new Date(checkIn).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                       const { left, width } = getPosition(checkIn, checkOut);
                       return (
                         <div key={res.id} className="absolute" style={{ left: left * cellWidth / 32, width: width * cellWidth / 32, top: '2px', height: '36px' }}>
                           <DraggableReservation
                             reservation={{ ...res, check_in: checkIn, check_out: checkOut }}
                             onEdit={handleEditReservation}
                           />
                         </div>
                       );
                     })}
                   </div>
                </div>
              ))}
            </div>
          </div>
             <div className="mt-6 flex flex-wrap gap-4">
               <div className="flex items-center bg-gradient-to-r from-indigo-500 to-indigo-600 px-3 py-2 rounded-lg shadow-sm">
                 <div className="w-3 h-3 bg-white bg-opacity-80 rounded mr-2"></div>
                  <span className="text-sm font-medium text-white">{t('reservations.booked')}</span>
               </div>
               <div className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 rounded-lg shadow-sm">
                 <div className="w-3 h-3 bg-white bg-opacity-80 rounded mr-2"></div>
                  <span className="text-sm font-medium text-white">{t('reservations.confirmed')}</span>
               </div>
               <div className="flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2 rounded-lg shadow-sm">
                  <div className="w-3 h-3 bg-white bg-opacity-80 rounded mr-2"></div>
                  <span className="text-sm font-medium text-white">{t('reservations.checkedIn')}</span>
               </div>
               <div className="flex items-center bg-gradient-to-r from-blue-400 to-blue-500 px-3 py-2 rounded-lg shadow-sm border-2 border-blue-600">
                 <div className="w-3 h-3 bg-white bg-opacity-90 rounded mr-2"></div>
                  <span className="text-sm font-medium text-white font-semibold">{t('reservations.newReservation')}</span>
               </div>
               <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                 <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
                  <span className="text-sm font-medium text-green-700">{t('reservations.available')}</span>
               </div>
               <div className="flex items-center bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                 <div className="w-3 h-3 bg-red-400 rounded mr-2"></div>
                  <span className="text-sm font-medium text-red-700">{t('reservations.occupied')}</span>
               </div>
               <div className="flex items-center bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                 <div className="w-3 h-3 bg-amber-400 rounded mr-2"></div>
                  <span className="text-sm font-medium text-amber-700">{t('reservations.dirty')}</span>
               </div>
               <div className="flex items-center bg-cyan-50 px-3 py-2 rounded-lg border border-cyan-200">
                 <div className="w-3 h-3 bg-cyan-400 rounded mr-2"></div>
                  <span className="text-sm font-medium text-cyan-700">{t('reservations.cleaning')}</span>
               </div>
             </div>
        </DndContext>
      )}

      {/* Modals */}
      {showCreateModal && selection && (
        <CreateReservationModal
          roomNumber={selection.room}
          checkIn={selection.start}
          checkOut={selection.end}
          onClose={() => {
            setShowCreateModal(false);
            setSelection(null);
          }}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showEditModal && editingReservation && (
        <EditReservationModal
          reservation={editingReservation}
          onClose={() => {
            setShowEditModal(false);
            setEditingReservation(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}