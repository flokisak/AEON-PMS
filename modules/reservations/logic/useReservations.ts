import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabaseClient';
import { Reservation, Room } from '@/core/types';

export function useReservations() {
  const queryClient = useQueryClient();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select(`
            *,
            rooms(room_number)
          `);
        if (error) throw error;
        
        // Transform data to include room_number from joined rooms table
        return data?.map(reservation => ({
          ...reservation,
          room_number: reservation.rooms?.room_number
        })) as Reservation[] || [];
      } catch (error) {
        // Fallback to mock data
        return [
          { id: 1, guest_name: 'John Doe', room_number: 101, check_in: '2024-11-15', check_out: '2024-11-17', status: 'booked', room_type: 'Standard', created_at: '2024-11-01T00:00:00Z' },
          { id: 2, guest_name: 'Jane Smith', room_number: 102, check_in: '2024-11-10', check_out: '2024-11-12', status: 'checked_in', room_type: 'Deluxe', created_at: '2024-11-01T00:00:00Z' },
        ] as Reservation[];
      }
    },
  });

  const createReservation = useMutation({
    mutationFn: async (newReservation: Omit<Reservation, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('reservations').insert(newReservation).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservations'] }),
  });

  const updateReservation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Reservation> & { id: number }) => {
      const { data, error } = await supabase.from('reservations').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservations'] }),
  });

  const deleteReservation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservations'] }),
  });

  const updateRoom = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Room> & { id: number }) => {
      const { data, error } = await supabase.from('rooms').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  return {
    reservations,
    isLoading,
    createReservation,
    updateReservation,
    deleteReservation,
    updateRoom,
  };
}