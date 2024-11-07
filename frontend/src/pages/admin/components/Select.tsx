import React, { createContext, useContext, useState } from 'react';

// Context for Select
interface SelectContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within a Select provider');
  }
  return context;
};

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  value, 
  onValueChange, 
  children, 
  className = ''
}) => {
  const [open, setOpen] = useState(false);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.select-container')) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open]);

  return (
    <SelectContext.Provider value={{ open, setOpen, value, onChange: onValueChange }}>
      <div className={`relative inline-block select-container ${className}`}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps {
  children?: React.ReactNode;
  className?: string;
  placeholder?: string;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ 
  children, 
  className = '',
  placeholder = '선택하세요'
}) => {
  const { open, setOpen, value } = useSelectContext();

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`
        w-full flex items-center justify-between gap-2 px-3 py-2 
        text-sm bg-white border rounded-lg 
        hover:bg-gray-50 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        transition-colors duration-200 ease-in-out
        ${open ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        ${className}
      `}
    >
      <span className="truncate">
        {children || value || placeholder}
      </span>
      <svg 
        className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
        fill="none" 
        strokeWidth="2" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectContent: React.FC<SelectContentProps> = ({ 
  children, 
  className = '' 
}) => {
  const { open } = useSelectContext();

  if (!open) return null;

  return (
    <div 
      className={`
        absolute z-50 w-full mt-1 
        bg-white border rounded-lg shadow-lg 
        overflow-hidden max-h-60 overflow-y-auto
        transform opacity-100 scale-100
        transition-all duration-200 ease-out
        ${className}
      `}
    >
      <div className="py-1">
        {children}
      </div>
    </div>
  );
};

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const SelectItem: React.FC<SelectItemProps> = ({ 
  value, 
  children, 
  className = '' 
}) => {
  const { onChange, setOpen, value: selectedValue } = useSelectContext();

  const handleSelect = () => {
    onChange(value);
    setOpen(false);
  };

  const isSelected = selectedValue === value;

  return (
    <div
      onClick={handleSelect}
      className={`
        group flex items-center justify-between px-3 py-2 
        text-sm cursor-pointer select-none
        transition-colors duration-150 ease-in-out
        ${isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-900 hover:bg-gray-50'}
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {children}
      </div>
      {isSelected && (
        <svg 
          className="w-4 h-4 text-blue-600" 
          fill="none" 
          strokeWidth="2" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
};

export const SelectValue: React.FC<{ placeholder?: string }> = ({ 
  placeholder 
}) => {
  const { value } = useSelectContext();
  return <>{value || placeholder}</>;
};