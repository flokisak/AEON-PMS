'use client';

import { FiSearch, FiBell, FiUser, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

export function TopBar() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-medium px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-3">
      {/* Search - Full width on mobile */}
      <div className="flex-1 w-full md:max-w-md">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-dark" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-3 md:py-2 border border-neutral-medium rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-neutral-light text-base md:text-sm"
          />
        </div>
      </div>

      {/* Mobile filter toggle */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="md:hidden flex items-center justify-center p-3 bg-neutral-light rounded-xl hover:bg-neutral-medium transition-colors"
        aria-label="Toggle filters"
      >
        <FiMenu size={18} />
        <span className="ml-2 text-sm font-medium">Filters</span>
      </button>

      {/* Filters/Quick Actions - Hidden on mobile by default */}
      <div className={`${showMobileFilters ? 'flex' : 'hidden'} md:flex items-center space-x-2 md:space-x-4 flex-wrap gap-2`}>
        <button className="px-4 py-2 md:py-2 text-sm font-medium text-neutral-dark hover:text-primary transition-colors rounded-lg hover:bg-neutral-light touch-manipulation">
          Today
        </button>
        <button className="px-4 py-2 md:py-2 text-sm font-medium text-neutral-dark hover:text-primary transition-colors rounded-lg hover:bg-neutral-light touch-manipulation">
          This Week
        </button>
        <button className="px-4 py-2 md:py-2 text-sm font-medium text-neutral-dark hover:text-primary transition-colors rounded-lg hover:bg-neutral-light touch-manipulation">
          All
        </button>
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <button className="p-3 md:p-2 text-neutral-dark hover:text-primary transition-colors relative rounded-lg hover:bg-neutral-light touch-manipulation">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-10 h-10 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center">
            <FiUser className="text-white" size={16} />
          </div>
          <span className="text-sm font-medium text-foreground hidden md:block">Admin</span>
        </div>
      </div>
    </header>
  );
}