import { moduleLoader } from './moduleLoader';
import { supabase } from './config/supabaseClient';
import { FiUsers } from 'react-icons/fi';

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
      { name: 'Reservations', path: '/modules/reservations', icon: 'calendar' },
      { name: 'Front Desk', path: '/modules/front-desk', icon: 'usercheck' },
      { name: 'Rooms', path: '/modules/rooms', icon: 'home' },
       { name: 'Packages', path: '/modules/packages-events', icon: 'package' },
      { name: 'Housekeeping', path: '/modules/housekeeping', icon: 'broom' },
      { name: 'Billing', path: '/modules/billing', icon: 'creditcard' },
      { name: 'AI Concierge', path: '/modules/ai-concierge', icon: 'message' },
      { name: 'AI Revenue Manager', path: '/modules/ai-revenue-manager', icon: 'trending' },
      { name: 'Reports', path: '/modules/reports', icon: 'barchart' },
      { name: 'Employee Management', path: '/modules/employee-management', icon: 'users' },
    ];
  }
}