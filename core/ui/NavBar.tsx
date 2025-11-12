'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { FiCalendar, FiMessageSquare, FiTrendingUp, FiUserCheck, FiCreditCard, FiHome, FiBarChart, FiSettings, FiChevronLeft, FiChevronRight, FiPackage, FiUsers, FiChevronDown, FiMapPin } from 'react-icons/fi';
import { GiBroom } from 'react-icons/gi';
import { getActiveModulesForNav } from '../moduleRegistry';
import { useProperties } from '../hooks/useProperties';

interface Module {
  path: string;
  icon: string;
  name: string;
}

const iconMap = {
  calendar: FiCalendar,
  broom: GiBroom,
  usercheck: FiUserCheck,
  creditcard: FiCreditCard,
  home: FiHome,
  barchart: FiBarChart,
  message: FiMessageSquare,
  trending: FiTrendingUp,
  package: FiPackage,
  users: FiUsers,
};

export function NavBar() {
  const { t } = useTranslation('common');
  const [modules, setModules] = useState<Module[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showPropertySwitcher, setShowPropertySwitcher] = useState(false);
  const pathname = usePathname();
  const { properties, currentProperty, switchProperty } = useProperties();

  useEffect(() => {
    const fetchModules = async () => {
      const activeModules = await getActiveModulesForNav();

      const allModules = activeModules;
       const order = ['Reservations', 'Front Desk', 'Rooms', 'Packages', 'Housekeeping', 'Billing', 'AI Concierge', 'AI Revenue Manager', 'Reports', 'Employee Management'];
      const sortedModules = allModules.sort((a, b) => {
        const aIndex = order.indexOf(a.name);
        const bIndex = order.indexOf(b.name);
        return aIndex - bIndex;
      });

      // Translate module names
      const getModuleKey = (name: string) => {
        const keyMap: { [key: string]: string } = {
          'Reservations': 'reservations',
          'Front Desk': 'frontDesk',
          'Rooms': 'rooms',
          'Packages': 'packages',
          'Housekeeping': 'housekeeping',
          'Billing': 'billing',
          'Employee Management': 'employeeManagement',
          'AI Concierge': 'aiConcierge',
          'AI Revenue Manager': 'aiRevenueManager',
          'Reports': 'reports'
        };
        return keyMap[name] || name.toLowerCase().replace(' ', '');
      };

      const translatedModules = sortedModules.map(module => ({
        ...module,
        name: t(`modules.${getModuleKey(module.name)}`)
      }));

      setModules(translatedModules);
    };
    fetchModules();
  }, [t]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector('nav');
      if (nav && !nav.contains(event.target as Node) && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile menu button - positioned to avoid overlap */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-16 left-4 z-50 p-3 bg-primary text-white rounded-xl shadow-lg border border-primary-dark touch-manipulation"
        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <FiChevronRight size={20} />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      <nav
        className={`
            bg-white text-foreground shadow-lg border-r border-neutral-medium
            transition-all duration-300 min-h-screen flex flex-col overflow-hidden
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            ${isCollapsed ? 'md:w-16' : 'md:w-64'}
            fixed md:relative z-50 md:z-auto w-64 md:w-auto
            md:shadow-sm
          `}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-medium bg-neutral-light flex items-center justify-between">
            {!isCollapsed && <h1 className="text-xl font-bold text-primary">AEON PMS</h1>}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:block p-3 rounded-lg hover:bg-neutral-medium transition-colors text-neutral-dark touch-manipulation"
              title={isCollapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')}
           >
             {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
           </button>
           <button
             onClick={() => setIsMobileOpen(false)}
             className="md:hidden p-3 rounded-lg hover:bg-neutral-medium transition-colors text-foreground touch-manipulation"
             aria-label="Close menu"
           >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <line x1="18" y1="6" x2="6" y2="18"></line>
               <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
           </button>
        </div>

        {/* Navigation Items */}
        <ul className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          <li>
            <Link
              href="/"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center p-4 hover:bg-neutral-light hover:text-primary rounded-xl transition-all duration-200 group touch-manipulation ${pathname === '/' ? 'bg-primary/10 text-primary rounded-xl border-l-4 border-primary' : ''}`}
            >
                <FiHome className="text-xl text-neutral-dark" />
                {!isCollapsed && <span className="ml-4 font-medium text-base">{t('nav.dashboard')}</span>}
                {isCollapsed && !isMobileOpen && (
                  <span className="absolute left-16 bg-white text-foreground px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg border border-neutral-medium">
                    {t('nav.dashboard')}
                  </span>
               )}
            </Link>
          </li>
          {modules.map((module) => {
            const Icon = iconMap[module.icon as keyof typeof iconMap];
            return (
              <li key={module.path}>
                 <Link
                    href={module.path}
                    onClick={() => setIsMobileOpen(false)}
                     className={`flex items-center p-4 hover:bg-neutral-light hover:text-primary rounded-xl transition-all duration-200 group touch-manipulation ${pathname === module.path ? 'bg-primary/10 text-primary rounded-xl border-l-4 border-primary' : ''}`}
                 >
                     {Icon && <Icon className="text-xl text-neutral-dark" />}
                   {!isCollapsed && <span className="ml-4 font-medium text-base">{module.name}</span>}
                   {isCollapsed && !isMobileOpen && (
                     <span className="absolute left-16 bg-white text-foreground px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg border border-neutral-medium">
                       {module.name}
                     </span>
                   )}
                 </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/admin"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center p-4 hover:bg-neutral-light hover:text-primary rounded-xl transition-all duration-200 group touch-manipulation ${pathname === '/admin' ? 'bg-primary/10 text-primary rounded-xl border-l-4 border-primary' : ''}`}
            >
                <FiSettings className="text-xl text-neutral-dark" />
                {!isCollapsed && <span className="ml-4 font-medium text-base">{t('nav.admin')}</span>}
                {isCollapsed && !isMobileOpen && (
                  <span className="absolute left-16 bg-white text-foreground px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg border border-neutral-medium">
                    {t('nav.admin')}
                  </span>
               )}
            </Link>
           </li>
         </ul>

         {/* Property Switcher - Only show if user has more than one property */}
         {properties.length > 1 && (
           <div className="p-4 border-t border-neutral-medium">
             {!isCollapsed && (
               <div className="mb-3">
                 <div className="text-sm text-neutral-dark font-medium mb-2">
                   {t('nav.currentProperty')}
                 </div>
                 <button
                   onClick={() => setShowPropertySwitcher(!showPropertySwitcher)}
                   className="w-full flex items-center justify-between p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors touch-manipulation"
                 >
                   <div className="flex items-center">
                     <FiMapPin className="mr-3 text-lg" />
                     <span className="text-sm font-medium truncate">
                       {currentProperty?.name || t('nav.selectProperty')}
                     </span>
                   </div>
                   <FiChevronDown className={`transition-transform text-lg ${showPropertySwitcher ? 'rotate-180' : ''}`} />
                 </button>
               </div>
             )}

             {/* Property Dropdown */}
             {showPropertySwitcher && !isCollapsed && (
               <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                 {properties.map((property) => (
                   <button
                     key={property.id}
                     onClick={() => {
                       switchProperty(property.id);
                       setShowPropertySwitcher(false);
                       setIsMobileOpen(false); // Close mobile menu after selection
                     }}
                     className={`w-full text-left p-3 rounded-xl text-sm transition-all duration-200 touch-manipulation whitespace-normal ${
                       currentProperty?.id === property.id
                         ? 'bg-primary text-white shadow-md'
                         : 'hover:bg-neutral-light text-neutral-dark hover:shadow-sm'
                     }`}
                   >
                     <div className="font-medium text-base truncate">{property.name}</div>
                     <div className="text-xs opacity-75 truncate mt-1">
                       {property.city}, {property.country}
                     </div>
                   </button>
                 ))}
               </div>
             )}

             {/* Collapsed state - show just current property icon */}
             {isCollapsed && (
               <div className="relative group">
                 <button
                   onClick={() => setShowPropertySwitcher(!showPropertySwitcher)}
                   className="w-full p-4 hover:bg-neutral-light rounded-xl transition-colors text-neutral-dark touch-manipulation"
                   title={`${currentProperty?.name || t('nav.selectProperty')} - ${t('nav.clickToSwitch')}`}
                 >
                   <FiMapPin className="text-xl" />
                 </button>
                 
                 {/* Tooltip for collapsed state */}
                 {!isMobileOpen && (
                   <span className="absolute left-16 bg-white text-foreground px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg border border-neutral-medium">
                     {currentProperty?.name || t('nav.selectProperty')}
                   </span>
                 )}

                 {/* Collapsed dropdown */}
                 {showPropertySwitcher && (
                   <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-medium z-20 max-h-80 overflow-hidden">
                     <div className="p-3 border-b border-neutral-medium flex-shrink-0">
                       <div className="text-sm text-neutral-dark font-medium">
                         {t('nav.switchProperty')}
                       </div>
                     </div>
                     <div className="max-h-60 overflow-y-auto">
                       {properties.map((property) => (
                         <button
                           key={property.id}
                           onClick={() => {
                             switchProperty(property.id);
                             setShowPropertySwitcher(false);
                           }}
                           className={`w-full text-left p-3 text-sm transition-all duration-200 touch-manipulation whitespace-normal ${
                             currentProperty?.id === property.id
                               ? 'bg-primary text-white'
                               : 'hover:bg-neutral-light text-neutral-dark'
                           }`}
                         >
                           <div className="font-medium text-base truncate">{property.name}</div>
                           <div className="text-xs opacity-75 mt-1 truncate">
                             {property.city}, {property.country}
                           </div>
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
             )}
           </div>
         )}
       </nav>
     </>
   );
}