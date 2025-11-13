// core/hooks/useModules.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../config/supabaseClient';

export interface ModuleConfig {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive';
  config: Record<string, unknown>;
  module_path: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export function useModules() {
  const queryClient = useQueryClient();

  const { data: modules, isLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      // Try to get modules from database
      const { data, error } = await supabase.from('modules').select('*').order('name');

      if (error) {
        // Fallback to mock data for development
        console.warn('Using mock module data:', error.message);
        return [
          {
            id: '1',
            name: 'Reservations',
            version: '1.0.0',
            status: 'active',
            config: {},
            module_path: '@/modules/reservations',
            icon: 'calendar',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            name: 'Front Desk',
            version: '1.0.0',
            status: 'active',
            config: {},
            module_path: '@/modules/front-desk',
            icon: 'usercheck',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '3',
            name: 'Rooms',
            version: '1.0.0',
            status: 'active',
            config: {},
            module_path: '@/modules/rooms',
            icon: 'home',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
           {
             id: '4',
             name: 'Packages',
             version: '1.0.0',
             status: 'active',
             config: {},
             module_path: '@/modules/packages',
             icon: 'package',
             created_at: '2024-01-01T00:00:00Z',
             updated_at: '2024-01-01T00:00:00Z'
           },
          {
            id: '5',
            name: 'Housekeeping',
            version: '1.0.0',
            status: 'active',
            config: {},
            module_path: '@/modules/housekeeping',
            icon: 'broom',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '6',
            name: 'Billing',
            version: '1.0.0',
            status: 'active',
            config: {},
            module_path: '@/modules/billing',
            icon: 'creditcard',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '7',
            name: 'Employee Management',
            version: '1.0.0',
            status: 'active',
            config: {},
            module_path: '@/modules/employee-management',
            icon: 'users',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '8',
            name: 'AI Concierge',
            version: '1.0.0',
            status: 'active',
            config: {},
            module_path: '@/modules/ai-concierge',
            icon: 'message',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '9',
            name: 'AI Revenue Manager',
            version: '1.0.0',
            status: 'active',
            config: {},
            module_path: '@/modules/ai-revenue-manager',
            icon: 'trending',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '10',
            name: 'Reports',
            version: '1.0.0',
            status: 'active',
            config: {},
            module_path: '@/modules/reports',
            icon: 'barchart',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        ] as ModuleConfig[];
      }

      // Ensure Packages is included
      const packagesModule: ModuleConfig = {
        id: 'packages',
        name: 'Packages',
        version: '1.0.0',
        status: 'active',
        config: {},
        module_path: '@/modules/packages',
        icon: 'package',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      // Ensure Employee Management is included
      const employeeManagementModule: ModuleConfig = {
        id: 'employee-management',
        name: 'Employee Management',
        version: '1.0.0',
        status: 'active',
        config: {},
        module_path: '@/modules/employee-management',
        icon: 'users',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      const modules = data as ModuleConfig[];
      const hasPackages = modules.some(mod => mod.name === 'Packages');
      const hasEmployeeManagement = modules.some(mod => mod.name === 'Employee Management');
      
      if (!hasPackages) {
        modules.push(packagesModule);
      }
      
      if (!hasEmployeeManagement) {
        modules.push(employeeManagementModule);
      }

      console.log('Final modules list:', modules);
      return modules;
    },
  });

  const updateModuleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
      try {
        const { data, error } = await supabase
          .from('modules')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (dbError) {
        // Handle mock data updates for development
        console.warn('Database update failed, using mock data:', dbError);
        // In a real implementation, you'd update local state here
        return { id, status };
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modules'] }),
  });

  const updateModuleConfig = useMutation({
    mutationFn: async ({ id, config }: { id: string; config: Record<string, unknown> }) => {
      const { data, error } = await supabase
        .from('modules')
        .update({ config, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modules'] }),
  });

  return {
    modules,
    isLoading,
    updateModuleStatus,
    updateModuleConfig,
  };
}