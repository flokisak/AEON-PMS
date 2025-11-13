'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRooms } from '../logic/useRooms';
import { Room } from '../../../core/types';
import { MaintenancePanel } from './MaintenancePanel';
import { AmenitiesManager } from './AmenitiesManager';
import { FiWifi, FiWind, FiCoffee, FiTv, FiShield, FiDroplet, FiList, FiGrid, FiTool, FiStar } from 'react-icons/fi';
import { useCurrency } from '@/core/hooks/useCurrency';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/core/ui/DropdownMenu';

function RoomCard({ room, onEdit, onDelete, onMaintenance }: {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (id: number) => void;
  onMaintenance: (id: number) => void;
}) {
  const { t } = useTranslation('common');
  const { updateRoomStatus } = useRooms();
  const { formatCurrency } = useCurrency();

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available': return 'status-available';
      case 'occupied': return 'status-occupied';
      case 'maintenance': return 'bg-red-50 text-red-700';
      case 'dirty': return 'bg-amber-50 text-amber-700';
      case 'cleaning': return 'bg-cyan-50 text-cyan-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const urgentNotes = room.maintenance_notes.filter(note => note.priority === 'urgent' || note.priority === 'high');



  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-medium hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">{t('rooms.roomNumber')} {room.room_number}</h3>
          <p className="text-primary font-medium">{room.type}</p>
          {room.floor !== undefined && <p className="text-sm text-neutral-dark">{t('rooms.floor')} {room.floor}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`status-badge ${getStatusColor(room.status)}`}>
            {t(`rooms.roomStatus.${room.status}`)}
          </span>
          {urgentNotes.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {urgentNotes.length} {t('rooms.urgent')}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold text-primary">{formatCurrency(room.price)}</p>
        <p className="text-sm text-neutral-dark">{t('rooms.perNight')} • {room.capacity} {t('rooms.guests')}</p>
        {room.size && <p className="text-sm text-neutral-dark">{room.size} {t('rooms.squareMeters')}</p>}
      </div>

      {room.description && (
        <p className="text-sm text-neutral-dark mb-4 line-clamp-2">{room.description}</p>
      )}

       {room.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 6).map((amenity) => {
                const lowerName = amenity.name.toLowerCase();
                let icon = <FiWind size={14} />;
                if (lowerName.includes('wifi') || lowerName.includes('internet')) icon = <FiWifi size={14} />;
                if (lowerName.includes('ac') || lowerName.includes('air conditioning') || lowerName.includes('cooling')) icon = <FiWind size={14} />;
                if (lowerName.includes('bath') || lowerName.includes('bathtub')) icon = <FiDroplet size={14} />;
                if (lowerName.includes('coffee') || lowerName.includes('tea')) icon = <FiCoffee size={14} />;
                if (lowerName.includes('tv') || lowerName.includes('television')) icon = <FiTv size={14} />;
                if (lowerName.includes('safe')) icon = <FiShield size={14} />;
                if (lowerName.includes('fan') || lowerName.includes('ventilation')) icon = <FiWind size={14} />;
                if (lowerName.includes('shower') || lowerName.includes('water')) icon = <FiDroplet size={14} />;
                return (
                  <div key={amenity.id} className="flex items-center gap-1 bg-neutral-light rounded-full px-2 py-1" title={amenity.name}>
                    <span className="text-neutral-dark">{icon}</span>
                  </div>
                );
              })}
            </div>
          </div>
         )}

       <div className="space-y-3">
        <div>
          <label className="form-label text-sm">{t('rooms.status')}</label>
          <select
            value={room.status}
            onChange={(e) => updateRoomStatus.mutate({ id: room.id, status: e.target.value as Room['status'] })}
            className="form-input w-full text-sm"
          >
            <option value="available">{t('rooms.roomStatus.available')}</option>
            <option value="occupied">{t('rooms.roomStatus.occupied')}</option>
            <option value="maintenance">{t('rooms.roomStatus.maintenance')}</option>
            <option value="dirty">{t('rooms.roomStatus.dirty')}</option>
            <option value="cleaning">{t('rooms.roomStatus.cleaning')}</option>
          </select>
        </div>

        <div className="flex justify-end">
          <DropdownMenu
            trigger={
              <button className="text-gray-400 hover:text-gray-600 p-2 rounded hover:bg-gray-100">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                </svg>
              </button>
            }
            align="right"
          >
            <DropdownMenuItem onClick={() => onEdit(room)}>
              <span className="text-blue-600">{t('edit')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMaintenance(room.id)}>
              <span className="text-amber-600">{t('rooms.maintenance')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(room.id)}>
              <span className="text-red-600">{t('rooms.deleteRoom')}</span>
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

function RoomForm({ room, onSave, onCancel }: {
  room?: Room;
  onSave: (data: Omit<Room, 'id'>) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation('common');
  const { amenities: globalAmenities } = useRooms();
  const [formData, setFormData] = useState<Omit<Room, 'id'>>({
    room_number: room?.room_number || 0,
    type: room?.type || '',
    status: room?.status || 'available',
    price: room?.price || 0,
    description: room?.description || '',
    capacity: room?.capacity || 1,
    size: room?.size || 0,
    floor: room?.floor || 0,
    amenities: room?.amenities || [],
    maintenance_notes: room?.maintenance_notes || [],
    last_cleaned: room?.last_cleaned || '',
    next_maintenance: room?.next_maintenance || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };



  return (
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {room ? t('rooms.editRoom') : t('rooms.addNewRoom')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">{t('rooms.roomNumber')}</label>
                <input
                  type="number"
                  value={formData.room_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, room_number: +e.target.value }))}
                  className="form-input w-full"
                  required
                />
              </div>

              <div>
                <label className="form-label">{t('rooms.roomType')}</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="form-input w-full"
                  placeholder={t('rooms.roomNumberPlaceholder')}
                  required
                />
              </div>

              <div>
                <label className="form-label">{t('rooms.pricePerNight')}</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: +e.target.value }))}
                  className="form-input w-full"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="form-label">{t('rooms.capacityGuests')}</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: +e.target.value }))}
                  className="form-input w-full"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="form-label">{t('rooms.floor')}</label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData(prev => ({ ...prev, floor: +e.target.value }))}
                  className="form-input w-full"
                  min="0"
                />
              </div>

              <div>
                <label className="form-label">{t('rooms.sizeSquareMeters')}</label>
                <input
                  type="number"
                  value={formData.size}
                  onChange={(e) => setFormData(prev => ({ ...prev, size: +e.target.value }))}
                  className="form-input w-full"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="form-label">{t('rooms.status')}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Room['status'] }))}
                  className="form-input w-full"
                >
                  <option value="available">{t('rooms.roomStatus.available')}</option>
                  <option value="occupied">{t('rooms.roomStatus.occupied')}</option>
                  <option value="maintenance">{t('rooms.roomStatus.maintenance')}</option>
                  <option value="dirty">{t('rooms.roomStatus.dirty')}</option>
                  <option value="cleaning">{t('rooms.roomStatus.cleaning')}</option>
                </select>
              </div>

              <div>
                <label className="form-label">{t('rooms.lastCleaned')}</label>
                <input
                  type="date"
                  value={formData.last_cleaned}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_cleaned: e.target.value }))}
                  className="form-input w-full"
                />
              </div>
            </div>

            <div>
              <label className="form-label">{t('rooms.description')}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="form-input w-full"
                rows={3}
                placeholder={t('rooms.roomDescriptionPlaceholder')}
              />
            </div>

            <div>
              <label className="form-label">{t('rooms.amenities')}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                {globalAmenities?.map((amenity) => {
                  const isSelected = formData.amenities.some(a => a.id === amenity.id);
                  return (
                    <label key={amenity.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              amenities: [...prev.amenities, amenity]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              amenities: prev.amenities.filter(a => a.id !== amenity.id)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <div>
                        <span className="text-sm font-medium">{amenity.name}</span>
                        {amenity.description && (
                          <span className="text-xs text-gray-500 block">{amenity.description}</span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {t('rooms.selectedAmenities', { count: formData.amenities.length })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary px-6"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="btn-primary px-6"
              >
                {room ? t('rooms.updateRoom') : t('rooms.addRoom')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function RoomsPage() {
   const { t } = useTranslation('common');
   const { rooms, isLoading, addRoom, updateRoom, deleteRoom } = useRooms();
   const [showForm, setShowForm] = useState(false);
   const [editingRoom, setEditingRoom] = useState<Room | undefined>();
  const [view, setView] = useState<'rooms' | 'list' | 'maintenance' | 'amenities'>('list');
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'number' | 'floor' | 'status' | 'type'>('number');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

   const getStatusColor = (status: Room['status']) => {
     switch (status) {
       case 'available': return 'status-available';
       case 'occupied': return 'status-occupied';
       case 'maintenance': return 'bg-red-100 text-red-800';
       case 'dirty': return 'bg-yellow-100 text-yellow-800';
       case 'cleaning': return 'bg-blue-100 text-blue-800';
       default: return 'bg-gray-100 text-gray-800';
     }
   };

   const sortedRooms = useMemo(() => {
     if (!rooms) return [];
     return [...rooms].sort((a, b) => {
       let aVal: any, bVal: any;
       switch (sortBy) {
         case 'number': aVal = a.room_number; bVal = b.room_number; break;
         case 'floor': aVal = a.floor || 0; bVal = b.floor || 0; break;
         case 'status': aVal = a.status; bVal = b.status; break;
         case 'type': aVal = a.type; bVal = b.type; break;
         default: return 0;
       }
       if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
       if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
       return 0;
     });
   }, [rooms, sortBy, sortOrder]);

  const handleAddRoom = () => {
    setEditingRoom(undefined);
    setShowForm(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleSaveRoom = (data: Omit<Room, 'id'>) => {
    if (editingRoom) {
      updateRoom.mutate({ id: editingRoom.id, data });
    } else {
      addRoom.mutate(data);
    }
    setShowForm(false);
  };

   const handleDeleteRoom = (id: number) => {
     if (confirm(t('rooms.confirmDeleteRoom'))) {
       deleteRoom.mutate(id);
     }
   };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

   return (
     <div className="space-y-6">
       <div className="flex justify-between items-center">
         <div>
           <h1 className="text-2xl font-semibold text-foreground mb-2">{t('rooms.title')}</h1>
           <p className="text-neutral-dark">{t('rooms.description')}</p>
         </div>
         <div className="flex gap-3">
             <div className="flex bg-neutral-light rounded-lg p-1 border border-neutral-medium">
               <button
                 onClick={() => setView('list')}
                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                   view === 'list' ? 'bg-white text-primary shadow-sm border border-neutral-medium' : 'text-neutral-dark hover:text-primary'
                 }`}
                 title={t('rooms.views.list')}
               >
                 <FiList size={16} />
               </button>
               <button
                 onClick={() => setView('rooms')}
                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                   view === 'rooms' ? 'bg-white text-primary shadow-sm border border-neutral-medium' : 'text-neutral-dark hover:text-primary'
                 }`}
                 title={t('rooms.views.cards')}
               >
                 <FiGrid size={16} />
               </button>
             </div>
             <div className="flex bg-neutral-light rounded-lg p-1 border border-neutral-medium">
               <button
                 onClick={() => setView('maintenance')}
                 className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                   view === 'maintenance' ? 'bg-white text-primary shadow-sm border border-neutral-medium' : 'text-neutral-dark hover:text-primary'
                 }`}
               >
                 {t('rooms.views.maintenance')}
               </button>
               <button
                 onClick={() => setView('amenities')}
                 className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                   view === 'amenities' ? 'bg-white text-primary shadow-sm border border-neutral-medium' : 'text-neutral-dark hover:text-primary'
                 }`}
               >
                 {t('rooms.views.amenities')}
               </button>
             </div>
           {view === 'rooms' && (
             <button
               onClick={handleAddRoom}
               className="btn-primary px-6 py-2"
             >
               {t('rooms.addRoom')}
             </button>
           )}
         </div>
           </div>

        {view === 'list' && (
         <div className="flex gap-4 mb-6">
           <div>
              <label className="form-label text-sm">{t('rooms.sortBy')}</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'number' | 'floor' | 'status' | 'type')}
                className="form-input"
              >
                <option value="number">{t('rooms.roomNumber')}</option>
                <option value="floor">{t('rooms.floor')}</option>
                <option value="status">{t('rooms.status')}</option>
                <option value="type">{t('rooms.roomType')}</option>
              </select>
           </div>
           <div>
              <label className="form-label text-sm">{t('rooms.orderBy')}</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="form-input"
              >
                <option value="asc">{t('rooms.ascending')}</option>
                <option value="desc">{t('rooms.descending')}</option>
              </select>
           </div>
         </div>
       )}

       {view === 'rooms' && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {rooms?.map((room) => (
             <RoomCard
               key={room.id}
               room={room}
               onEdit={handleEditRoom}
               onDelete={handleDeleteRoom}
               onMaintenance={(id) => {
                 setSelectedRoomId(id);
                 setView('maintenance');
               }}
             />
           ))}
         </div>
       )}

         {view === 'list' && (
           <div className="bg-white rounded-lg shadow-sm border border-neutral-medium overflow-x-auto">
             <table className="w-full">
               <thead className="bg-neutral-light">
                 <tr>
                   <th className="p-4 text-left font-semibold text-foreground">{t('rooms.roomNumber')}</th>
                   <th className="p-4 text-left font-semibold text-foreground">{t('rooms.roomType')}</th>
                   <th className="p-4 text-left font-semibold text-foreground">{t('rooms.floor')}</th>
                   <th className="p-4 text-left font-semibold text-foreground">{t('rooms.status')}</th>
                   <th className="p-4 text-left font-semibold text-foreground">{t('rooms.price')}</th>
                   <th className="p-4 text-left font-semibold text-foreground">{t('rooms.capacity')}</th>
                   <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.actions')}</th>
                 </tr>
               </thead>
               <tbody>
                 {sortedRooms.map((room) => (
                     <tr key={room.id} className="border-t border-neutral-medium hover:bg-neutral-light/50">
                        <td className="p-4 font-medium text-foreground">{room.room_number}</td>
                       <td className="p-4 text-neutral-dark">{room.type}</td>
                       <td className="p-4 text-neutral-dark">{room.floor || t('frontDesk.notApplicable')}</td>
                      <td className="p-5">
                        <span className={`status-badge ${getStatusColor(room.status)}`}>
                          {t(`rooms.roomStatus.${room.status}`)}
                        </span>
                      </td>
                       <td className="p-4 text-neutral-dark">${room.price}</td>
                       <td className="p-4 text-neutral-dark">{room.capacity} {t('rooms.guests')}</td>
                        <td className="p-4">
                          <DropdownMenu
                            trigger={
                              <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                                </svg>
                              </button>
                            }
                            align="right"
                          >
                            <DropdownMenuItem onClick={() => handleEditRoom(room)}>
                              <span className="text-blue-600">{t('edit')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedRoomId(room.id);
                              setView('maintenance');
                            }}>
                              <span className="text-amber-600">{t('rooms.maintenance')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteRoom(room.id)}>
                              <span className="text-red-600">{t('rooms.deleteRoom')}</span>
                            </DropdownMenuItem>
                          </DropdownMenu>
                        </td>
                    </tr>
                 ))}
              </tbody>
            </table>
          </div>
        )}

       {view === 'maintenance' && (
         <div className="space-y-6">
           {!selectedRoomId ? (
             <div className="text-center py-12">
               <p className="text-gray-500 mb-4">{t('rooms.selectRoom')}</p>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                 {rooms?.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className="bg-white rounded-lg p-4 shadow-sm border border-neutral-medium hover:shadow-md transition-all duration-200 text-left"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{t('rooms.roomNumber')} {room.room_number}</h4>
                          <p className="text-sm text-primary">{room.type}</p>
                        </div>
                       {room.maintenance_notes.filter(n => n.status !== 'resolved').length > 0 && (
                         <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                           {room.maintenance_notes.filter(n => n.status !== 'resolved').length}
                         </span>
                       )}
                     </div>
                      <p className="text-xs text-neutral-dark">
                        {room.maintenance_notes.length} {t('rooms.totalNotes')}
                      </p>
                   </button>
                 ))}
               </div>
             </div>
           ) : (
             <div>
               <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSelectedRoomId(null)}
                    className="btn-secondary text-sm"
                  >
                    {t('rooms.backToRoomSelection')}
                  </button>
                  <h2 className="text-xl font-semibold text-foreground">
                    {t('rooms.maintenanceNotes')} - {t('rooms.roomNumber')} {rooms?.find(r => r.id === selectedRoomId)?.room_number}
                  </h2>
               </div>
               <MaintenancePanel roomId={selectedRoomId} />
             </div>
           )}
         </div>
       )}

      {view === 'amenities' && (
        <div className="mt-6">
          <AmenitiesManager />
        </div>
      )}

      {showForm && (
        <RoomForm
          room={editingRoom}
          onSave={handleSaveRoom}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}