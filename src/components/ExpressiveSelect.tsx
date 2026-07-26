import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  icon?: string;
}

interface ExpressiveSelectProps<T extends string = string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (val: T) => void;
  className?: string;
}

export function ExpressiveSelect<T extends string = string>({
  value,
  options,
  onChange,
  className = '',
}: ExpressiveSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/10 text-white border border-white/15 rounded-2xl px-4 py-3 text-sm font-semibold flex items-center justify-between hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#d1c4e9] transition-all cursor-pointer shadow-sm"
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption.icon && (
            <span className="material-symbols-outlined text-base text-[#d1c4e9]">
              {selectedOption.icon}
            </span>
          )}
          <span>{selectedOption.label}</span>
        </span>
        <span
          className={`material-symbols-outlined text-gray-300 text-lg transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#d1c4e9]' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Floating Custom Popup Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#1e1e22] text-white border border-white/15 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in duration-150 space-y-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#d1c4e9] text-[#1f1732] shadow-sm'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {opt.icon && (
                    <span className="material-symbols-outlined text-sm">
                      {opt.icon}
                    </span>
                  )}
                  <span>{opt.label}</span>
                </span>
                {isSelected && (
                  <span className="material-symbols-outlined text-sm font-black">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
