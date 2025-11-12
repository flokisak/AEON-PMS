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
        // Fallback to mock data
        return [
          { id: 1, room_number: 101, assigned_to: 'Maria', status: 'pending', updated_at: '2024-11-12T10:00:00Z' },
          { id: 2, room_number: 102, assigned_to: 'Carlos', status: 'in_progress', updated_at: '2024-11-12T09:30:00Z' },
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