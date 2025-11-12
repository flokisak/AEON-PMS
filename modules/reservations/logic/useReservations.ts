import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabaseClient';
import { Reservation, Room } from '@/core/types';

export function useReservations() {
  const queryClient = useQueryClient();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('reservations').select('*');
        if (error) throw error;
        return data as Reservation[];
      } catch (error) {
        // Fallback to Czech mock data
        return [
          { id: 1, guest_name: 'Novák Jiří', room_number: 101, check_in: '2024-11-15', check_out: '2024-11-17', status: 'booked', room_type: 'Standard', created_at: '2024-11-01T00:00:00Z' },
          { id: 2, guest_name: 'Svobodová Eva', room_number: 102, check_in: '2024-11-10', check_out: '2024-11-12', status: 'checked_in', room_type: 'Deluxe', created_at: '2024-11-01T00:00:00Z' },
          { id: 3, guest_name: 'Dvořák Petr', room_number: 201, check_in: '2024-11-20', check_out: '2024-11-25', status: 'booked', room_type: 'Apartmán', created_at: '2024-11-02T00:00:00Z' },
          { id: 4, guest_name: 'Černá Marie', room_number: 103, check_in: '2024-11-08', check_out: '2024-11-10', status: 'checked_out', room_type: 'Standard', created_at: '2024-10-28T00:00:00Z' },
          { id: 5, guest_name: 'Procházka Tomáš', room_number: 301, check_in: '2024-11-18', check_out: '2024-11-20', status: 'booked', room_type: 'Suite', created_at: '2024-11-03T00:00:00Z' },
          { id: 6, guest_name: 'Kučerová Lenka', room_number: 104, check_in: '2024-11-12', check_out: '2024-11-14', status: 'booked', room_type: 'Standard', created_at: '2024-11-04T00:00:00Z' },
          { id: 7, guest_name: 'Horák Martin', room_number: 202, check_in: '2024-11-09', check_out: '2024-11-11', status: 'checked_in', room_type: 'Apartmán', created_at: '2024-11-01T00:00:00Z' },
          { id: 8, guest_name: 'Zemanová Jana', room_number: 105, check_in: '2024-11-22', check_out: '2024-11-24', status: 'booked', room_type: 'Standard', created_at: '2024-11-05T00:00:00Z' },
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