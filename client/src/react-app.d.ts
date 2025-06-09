// src/react-app.d.ts

import react-app.d from '@/react-app.d';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import 'react';

declare module 'react' {
  // Extend React.RefObject to allow assignment to current property
  interface RefObject<T> {
    readonly current: T | null;
  }

  // Add MutableRefObject explicitly
  interface MutableRefObject<T> {
    current: T;
  }
}
