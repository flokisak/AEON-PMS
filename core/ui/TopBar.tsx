'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiBell, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from './DropdownMenu';

export function TopBar() {
  const { t } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications] = useState([
    { id: 1, text: t('topBar.newReservation'), time: t('topBar.minutesAgo', { count: 2 }), read: false },
    { id: 2, text: t('topBar.roomNeedsCleaning', { room: 301 }), time: t('topBar.minutesAgo', { count: 15 }), read: false },
    { id: 3, text: t('topBar.paymentReceived', { invoice: '#1234' }), time: t('topBar.hoursAgo', { count: 1 }), read: true },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // TODO: Implement search functionality
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    console.log('Filter changed to:', filter);
    // TODO: Implement filter functionality
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-neutral-medium px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-dark" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('topBar.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border border-neutral-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-neutral-light"
            />
          </div>
        </form>
      </div>

      {/* Filters/Quick Actions */}
      <div className="flex items-center space-x-2">
        {['today', 'thisWeek', 'all'].map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${
              activeFilter === filter
                ? 'bg-primary text-white'
                : 'text-neutral-dark hover:text-primary hover:bg-neutral-light'
            }`}
          >
            {t(`topBar.${filter}`)}
          </button>
        ))}
      </div>

      {/* Notifications and User Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <DropdownMenu
          trigger={
            <button className="p-2 text-neutral-dark hover:text-primary transition-colors relative">
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          }
          align="right"
        >
          <div className="px-4 py-2 border-b border-neutral-medium">
            <h3 className="text-sm font-semibold text-foreground">{t('topBar.notifications')}</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-neutral-light cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="text-sm text-foreground">{notification.text}</p>
                  <p className="text-xs text-neutral-dark mt-1">{notification.time}</p>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-neutral-dark">
                {t('topBar.noNotifications')}
              </div>
            )}
          </div>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu
          trigger={
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-light px-3 py-2 rounded-md transition-colors">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <FiUser className="text-white" size={16} />
              </div>
              <span className="text-sm font-medium text-foreground">Admin</span>
            </div>
          }
          align="right"
        >
          <DropdownMenuItem onClick={() => console.log('Profile clicked')}>
            <FiUser className="mr-2" size={16} />
            {t('topBar.profile')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Settings clicked')}>
            <FiSettings className="mr-2" size={16} />
            {t('topBar.settings')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => console.log('Logout clicked')}>
            <FiLogOut className="mr-2" size={16} />
            {t('topBar.logout')}
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </header>
  );
}