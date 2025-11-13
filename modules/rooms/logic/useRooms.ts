import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabaseClient';
import { Room, MaintenanceNote, Amenity } from '@/core/types';

// Global amenities store
let globalAmenities: Amenity[] = [
  { id: 'wifi', name: 'Bezplatné WiFi', description: 'Rychlý internetový přístup' },
  { id: 'tv', name: 'Smart TV', description: '55palcová chytrá televize' },
  { id: 'ac', name: 'Klimatizace', description: 'Systém kontroly klimatu' },
  { id: 'balcony', name: 'Soukromý balkon', description: 'Venkovní sezení' },
  { id: 'minibar', name: 'Minibar', description: 'Nápoje a občerstvení' },
  { id: 'workspace', name: 'Pracovní kout', description: 'Psací stůl a židle' },
  { id: 'parking', name: 'Bezplatné parkování', description: 'Parkovací stání zdarma' },
  { id: 'breakfast', name: 'Snídaně zdarma', description: 'Denní snídaňový servis' },
  { id: 'spa', name: 'Přístup do wellness', description: 'Vstup do wellness centra' },
  { id: 'kids', name: 'Dětské vybavení', description: 'Postýlka a židle pro dítě' },
  { id: 'jacuzzi', name: 'Jacuzzi', description: 'Soukromá vířivka v pokoji' },
  { id: 'safe', name: 'Trezor', description: 'Bezpečnostní trezor v pokoji' },
  { id: 'roomservice', name: 'Pokojová služba', description: '24/7 pokojová služba' },
];

export function useRooms() {
  const queryClient = useQueryClient();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select(`
            *,
            room_types(name, base_price),
            amenities(id, name, description),
            maintenance_notes(id, note, priority, status, date, reported_by)
          `);

        if (error) throw error;
        
        // Transform data to match Room interface
        return data?.map(room => ({
          ...room,
          type: room.room_types?.name || 'Standard',
          price: room.room_types?.base_price || 0,
          amenities: room.amenities || [],
          maintenance_notes: room.maintenance_notes || []
        })) as Room[] || [];
      } catch (error) {
        console.error('Error fetching rooms:', error);
        // Fallback to empty array if database fails
        return [];
      }
    },
  });

  const updateRoomStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: Room['status'] }) => {
      const { data, error } = await supabase
        .from('rooms')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  const addRoom = useMutation({
    mutationFn: async (roomData: Omit<Room, 'id'>) => {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          room_number: roomData.room_number,
          room_type_id: roomData.type,
          status: roomData.status,
          capacity: roomData.capacity,
          size: roomData.size,
          floor: roomData.floor,
          description: roomData.description,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  const updateRoom = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Room> }) => {
      const { data: result, error } = await supabase
        .from('rooms')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  const deleteRoom = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  const addMaintenanceNote = useMutation({
    mutationFn: async ({ roomId, note }: { roomId: number; note: Omit<MaintenanceNote, 'id'> }) => {
      const { data, error } = await supabase
        .from('maintenance_notes')
        .insert({
          room_id: roomId,
          note: note.note,
          priority: note.priority,
          status: note.status,
          date: note.date,
          reported_by: note.reported_by,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });

  const updateMaintenanceNote = useMutation({
    mutationFn: async ({ roomId, noteId, updates }: { roomId: number; noteId: string; updates: Partial<MaintenanceNote> }) => {
      const { data, error } = await supabase
        .from('maintenance_notes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });

  const deleteMaintenanceNote = useMutation({
    mutationFn: async ({ roomId, noteId }: { roomId: number; noteId: string }) => {
      const { error } = await supabase
        .from('maintenance_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });

  // Amenities management
  const { data: amenities } = useQuery({
    queryKey: ['amenities'],
    queryFn: async () => [...globalAmenities],
  });

  const addAmenity = useMutation({
    mutationFn: async (amenity: Omit<Amenity, 'id'>) => {
      const newAmenity: Amenity = {
        ...amenity,
        id: Date.now().toString(),
      };
      globalAmenities.push(newAmenity);
      return newAmenity;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['amenities'] }),
  });

  const updateAmenity = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Amenity> }) => {
      const amenityIndex = globalAmenities.findIndex(amenity => amenity.id === id);
      if (amenityIndex !== -1) {
        globalAmenities[amenityIndex] = { ...globalAmenities[amenityIndex], ...data };
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['amenities'] }),
  });

  const deleteAmenity = useMutation({
    mutationFn: async (id: string) => {
      globalAmenities = globalAmenities.filter(amenity => amenity.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  return {
    rooms,
    isLoading,
    updateRoomStatus,
    addRoom,
    updateRoom,
    deleteRoom,
    addMaintenanceNote,
    updateMaintenanceNote,
    deleteMaintenanceNote,
    amenities,
    addAmenity,
    updateAmenity,
    deleteAmenity,
  };
}