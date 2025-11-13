'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

export function DropdownMenu({ trigger, children, align = 'left' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleTriggerClick = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: align === 'right' ? rect.right + window.scrollX - 192 : rect.left + window.scrollX, // 192px = w-48
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative inline-block text-left" ref={triggerRef}>
        <div onClick={handleTriggerClick}>
          {trigger}
        </div>
      </div>

      {isOpen && createPortal(
        <div
          className="fixed z-50 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          style={{
            top: `${position.top + 4}px`,
            left: `${position.left}px`,
          }}
        >
          <div className="py-1">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && 'onClick' in (child.props as Record<string, unknown>)) {
                return React.cloneElement(child as React.ReactElement<{ onClick: () => void }>, {
                  onClick: () => {
                    const originalOnClick = (child.props as { onClick?: () => void }).onClick;
                    if (originalOnClick) originalOnClick();
                    setIsOpen(false);
                  }
                });
              }
              return child;
            })}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

interface DropdownMenuItemProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function DropdownMenuItem({ onClick, children, className = '' }: DropdownMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${className}`}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <hr className="my-1 border-gray-200" />;
}