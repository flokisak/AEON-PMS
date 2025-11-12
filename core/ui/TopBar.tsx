'use client';

import { FiSearch, FiBell, FiUser } from 'react-icons/fi';

export function TopBar() {
  return (
    <header className="bg-white border-b border-neutral-medium px-4 md:px-6 lg:px-8 py-3 lg:py-4 flex items-center justify-between shadow-sm flex-shrink-0">
      {/* Search - Takes available space */}
      <div className="flex-1 min-w-0 mr-4 lg:mr-8">
        <div className="relative max-w-md lg:max-w-lg xl:max-w-xl">
          <FiSearch className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-neutral-dark" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 lg:pl-12 pr-4 py-2 lg:py-3 border border-neutral-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-neutral-light text-base"
          />
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-6 flex-shrink-0">
        {/* Quick Actions - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
          <button className="px-3 lg:px-4 py-1.5 lg:py-2 text-sm font-medium text-neutral-dark hover:text-primary transition-colors rounded-lg hover:bg-neutral-light">
            Today
          </button>
          <button className="px-3 lg:px-4 py-1.5 lg:py-2 text-sm font-medium text-neutral-dark hover:text-primary transition-colors rounded-lg hover:bg-neutral-light">
            This Week
          </button>
          <button className="px-3 lg:px-4 py-1.5 lg:py-2 text-sm font-medium text-neutral-dark hover:text-primary transition-colors rounded-lg hover:bg-neutral-light">
            All
          </button>
        </div>

        {/* Notifications */}
        <button className="p-2 lg:p-3 text-neutral-dark hover:text-primary transition-colors relative rounded-lg hover:bg-neutral-light">
          <FiBell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 lg:space-x-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-full flex items-center justify-center">
            <FiUser className="text-white" size={14} />
          </div>
          <span className="text-sm lg:text-base font-medium text-foreground hidden md:block">Admin</span>
        </div>
      </div>
    </header>
  );
}