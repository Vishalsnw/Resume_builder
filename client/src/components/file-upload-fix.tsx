// src/components/file-upload-fix.tsx

// This is a helper component you can use to replace the problematic component
import upload from '@/pages/api/upload';
import file-upload-fix from '@/components/file-upload-fix';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import file-upload-fix from '@/components/file-upload-fix';
import { ForwardedRef, forwardRef, useRef, InputHTMLAttributes } from 'react';

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  accept?: string;
}

export const MutableFileInput = forwardRef((
  { accept, ...props }: FileInputProps, 
  ref: ForwardedRef<HTMLInputElement>
) => {
  // Create our own internal ref
  const internalRef = useRef<HTMLInputElement>(null);

  // This handler safely connects the forwarded ref with our internal ref
  const handleRef = (element: HTMLInputElement | null) => {
    // Update internal ref
    internalRef.current = element;
    
    // Handle various ref types
    if (ref) {
      if (typeof ref === 'function') {
        ref(element);
      } else {
        // Use this method to bypass TypeScript's readonly protection
        Object.defineProperty(ref, 'current', {
          value: element,
          writable: true,
          configurable: true
        });
      }
    }
  };

  return (
    <input 
      ref={handleRef}
      type="file"
      accept={accept}
      {...props}
    />
  );
});

// This is a simpler approach if you're looking to fix a specific implementation
export function fixRefAssignment<T>(ref: React.RefObject<T>, value: T | null): void {
  if (ref) {
    // This bypasses TypeScript's readonly protection
    (ref as any).current = value;
  }
}
