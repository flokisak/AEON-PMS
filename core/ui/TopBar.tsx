'use client';

import { FiSearch, FiBell, FiUser } from 'react-icons/fi';

export function TopBar() {
  return (
    <header className="bg-white border-b border-neutral-medium px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-dark" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-neutral-light"
          />
        </div>
      </div>

      {/* Filters/Quick Actions */}
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 text-sm font-medium text-neutral-dark hover:text-primary transition-colors">
          Today
        </button>
        <button className="px-4 py-2 text-sm font-medium text-neutral-dark hover:text-primary transition-colors">
          This Week
        </button>
        <button className="px-4 py-2 text-sm font-medium text-neutral-dark hover:text-primary transition-colors">
          All
        </button>
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-4">
        <button className="p-2 text-neutral-dark hover:text-primary transition-colors relative">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <FiUser className="text-white" size={16} />
          </div>
          <span className="text-sm font-medium text-foreground">Admin</span>
        </div>
      </div>
    </header>
  );
}