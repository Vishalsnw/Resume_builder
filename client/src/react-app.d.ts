// src/react-app.d.ts

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
