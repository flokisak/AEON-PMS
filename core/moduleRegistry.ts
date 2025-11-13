import { moduleLoader } from './moduleLoader';
import { supabase } from './config/supabaseClient';

export async function getActiveModules() {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('status', 'active')
    .order('name');

  if (error) {
    console.error('Failed to fetch active modules:', error);
    return [];
  }

  return data || [];
}

// Load modules on startup
export const loadModules = async () => {
  await moduleLoader.loadActiveModules();
};

// For navigation, get active modules for menu
export async function getActiveModulesForNav() {
  try {
    const activeModules = await getActiveModules();
    console.log('Active modules:', activeModules);

      const allModules = activeModules;
      const navModules = allModules.map(mod => ({
        name: mod.name,
        path: mod.path || `/modules/${mod.name.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}`,
        icon: mod.icon,
      }));
    console.log('Nav modules:', navModules);
    return navModules;
  } catch (error) {
    console.warn('Database query failed, using static modules:', error);
    // Fallback to static modules for development
    return [
      { name: 'reservations', path: '/modules/reservations', icon: 'calendar' },
      { name: 'frontDesk', path: '/modules/front-desk', icon: 'usercheck' },
      { name: 'rooms', path: '/modules/rooms', icon: 'home' },
       { name: 'packages', path: '/modules/packages-events', icon: 'package' },
      { name: 'housekeeping', path: '/modules/housekeeping', icon: 'broom' },
      { name: 'billing', path: '/modules/billing', icon: 'creditcard' },
      { name: 'aiConcierge', path: '/modules/ai-concierge', icon: 'message' },
      { name: 'aiRevenueManager', path: '/modules/ai-revenue-manager', icon: 'trending' },
      { name: 'reports', path: '/modules/reports', icon: 'barchart' },
      { name: 'employeeManagement', path: '/modules/employee-management', icon: 'users' },
    ];
  }
}