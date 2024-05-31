// components/ui/popover.tsx
import { ReactNode, useState, useRef, useEffect, ReactElement } from 'react';

interface PopoverProps {
  children: (props: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => ReactNode;
}

interface PopoverTriggerProps {
  children: ReactElement;
  asChild?: boolean;
}

interface PopoverContentProps {
  children: ReactNode;
}

export function Popover({ children }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <div ref={ref} className="relative">
      {children({ isOpen, setIsOpen })}
    </div>
  );
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
    function setIsOpen(arg0: (open: any) => boolean): void {
        throw new Error('Function not implemented.');
    }

  return <div onClick={() => setIsOpen((open) => !open)}>{children}</div>;
}

export function PopoverContent({ children }: PopoverContentProps) {
  return (
    <div className="absolute bg-white shadow-lg rounded-md p-4 z-10">
      {children}
    </div>
  );
}
