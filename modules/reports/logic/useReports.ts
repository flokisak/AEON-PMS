import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabaseClient';
import { ReportData } from '@/core/types';

export function useReports() {
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      // Mock data
      return {
        totalRevenue: 12500,
        totalOccupancy: 78,
        totalGuests: 45,
      } as ReportData;
    },
  });

  return {
    reportData,
    isLoading,
  };
}