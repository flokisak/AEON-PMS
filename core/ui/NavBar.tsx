'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { FiCalendar, FiMessageSquare, FiTrendingUp, FiUserCheck, FiCreditCard, FiHome, FiBarChart, FiSettings, FiChevronLeft, FiChevronRight, FiPackage, FiUsers } from 'react-icons/fi';
import { GiBroom } from 'react-icons/gi';
import Image from 'next/image';
import { getActiveModulesForNav } from '../moduleRegistry';

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
  const pathname = usePathname();

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
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
      >
        <FiChevronRight size={20} />
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <nav
        className={`
            bg-white text-foreground shadow-sm border-r border-neutral-medium
            transition-all duration-300 min-h-screen flex flex-col overflow-visible
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            ${isCollapsed ? 'md:w-16' : 'md:w-64'}
            fixed md:relative z-50 md:z-auto w-64 md:w-auto
          `}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-medium bg-neutral-light flex items-center justify-between">
            <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <Image 
                src="/logo.png" 
                alt="AEON PMS Logo" 
                width={64}
                height={64}
                className="h-16 w-auto"
              />
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:block p-2 rounded-lg hover:bg-neutral-medium transition-colors text-neutral-dark"
              title={isCollapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')}
           >
             {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
           </button>
           <button
             onClick={() => setIsMobileOpen(false)}
             className="md:hidden p-2 rounded-lg hover:bg-neutral-medium transition-colors text-foreground"
           >
             ✕
           </button>
        </div>

        {/* Navigation Items */}
        <ul className="flex-1 p-4 space-y-2">
          <li>
            <Link
              href="/"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center p-3 hover:bg-neutral-light hover:text-primary rounded-lg transition-all duration-200 group ${pathname === '/' ? 'bg-primary/10 text-primary rounded-lg border-r-2 border-primary' : ''}`}
            >
                <FiHome className="text-xl text-neutral-dark" />
                {!isCollapsed && <span className="ml-3 font-medium">{t('nav.dashboard')}</span>}
                {isCollapsed && !isMobileOpen && (
                  <span className="absolute left-16 bg-white text-foreground px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-sm border">
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
                    className={`flex items-center p-3 hover:bg-neutral-light hover:text-primary rounded-lg transition-all duration-200 group ${pathname === module.path ? 'bg-primary/10 text-primary rounded-lg border-r-2 border-primary' : ''}`}
                 >
                    {Icon && <Icon className="text-xl text-neutral-dark" />}
                   {!isCollapsed && <span className="ml-3 font-medium">{module.name}</span>}
                   {isCollapsed && !isMobileOpen && (
                     <span className="absolute left-16 bg-white text-foreground px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-sm border">
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
              className={`flex items-center p-3 hover:bg-neutral-light hover:text-primary rounded-lg transition-all duration-200 group ${pathname === '/admin' ? 'bg-primary/10 text-primary rounded-lg border-r-2 border-primary' : ''}`}
            >
                <FiSettings className="text-xl text-neutral-dark" />
                {!isCollapsed && <span className="ml-3 font-medium">{t('nav.admin')}</span>}
                {isCollapsed && !isMobileOpen && (
                  <span className="absolute left-16 bg-white text-foreground px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-sm border">
                    {t('nav.admin')}
                  </span>
               )}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}