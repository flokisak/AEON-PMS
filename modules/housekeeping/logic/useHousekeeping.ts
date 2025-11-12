import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabaseClient';
import { HousekeepingTask } from '@/core/types';

export function useHousekeeping() {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['housekeeping'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('housekeeping').select('*');
        if (error) throw error;
        return data as HousekeepingTask[];
      } catch (error) {
        // Fallback to Czech mock data
        return [
          { id: 1, room_number: 101, assigned_to: 'Nováková Jana', status: 'pending', updated_at: '2024-11-12T10:00:00Z' },
          { id: 2, room_number: 102, assigned_to: 'Svoboda Petr', status: 'in_progress', updated_at: '2024-11-12T09:30:00Z' },
          { id: 3, room_number: 103, assigned_to: 'Dvořáková Marie', status: 'completed', updated_at: '2024-11-12T08:15:00Z' },
          { id: 4, room_number: 201, assigned_to: 'Procházka Tomáš', status: 'pending', updated_at: '2024-11-12T11:00:00Z' },
          { id: 5, room_number: 104, assigned_to: 'Černá Lenka', status: 'pending', updated_at: '2024-11-12T12:00:00Z' },
          { id: 6, room_number: 301, assigned_to: 'Horák Martin', status: 'in_progress', updated_at: '2024-11-12T07:45:00Z' },
        ] as HousekeepingTask[];
      }
    },
  });

  const createTask = useMutation({
    mutationFn: async (newTask: Omit<HousekeepingTask, 'id' | 'updated_at'>) => {
      const { data, error } = await supabase.from('housekeeping').insert(newTask).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['housekeeping'] }),
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<HousekeepingTask> & { id: number }) => {
      const { data, error } = await supabase.from('housekeeping').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['housekeeping'] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('housekeeping').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['housekeeping'] }),
  });

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
  };
}