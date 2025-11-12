import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabaseClient';
import { CheckIn } from '@/core/types';

export function useFrontDesk() {
  const queryClient = useQueryClient();

  const { data: checkIns, isLoading } = useQuery({
    queryKey: ['checkins'],
    queryFn: async () => {
      // Mock data
      return [
        { id: 1, guest_name: 'John Doe', address: '123 Main St', phone: '555-1234', email: 'john@example.com', is_company: false, company_name: '', company_tax_id: '', company_address: '', company_phone: '', company_email: '', room_number: 101, check_in_date: '2023-11-01', check_out_date: '2023-11-03', status: 'active' },
        { id: 2, guest_name: 'Jane Smith', address: '456 Oak Ave', phone: '555-5678', email: 'jane@example.com', is_company: true, company_name: 'ABC Corp', company_tax_id: '123456789', company_address: '789 Business Rd', company_phone: '555-9999', company_email: 'contact@abc.com', room_number: 102, check_in_date: '2023-11-02', check_out_date: '2023-11-04', status: 'completed' },
      ] as CheckIn[];
    },
  });

  const checkInGuest = useMutation({
    mutationFn: async (newCheckIn: Omit<CheckIn, 'id'>) => {
      // Mock
      return { ...newCheckIn, id: Date.now() };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['checkins'] }),
  });

  const checkOutGuest = useMutation({
    mutationFn: async (id: number) => {
      // Mock update
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['checkins'] }),
  });

  return {
    checkIns,
    isLoading,
    checkInGuest,
    checkOutGuest,
  };
}