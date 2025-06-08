// src/react-icons.d.ts

declare module 'react-icons/fi' {
  import { ComponentType, SVGAttributes } from 'react';
  
  export interface IconBaseProps extends SVGAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    title?: string;
  }
  
  export type IconType = ComponentType<IconBaseProps>;
  
  export const FiLoader: IconType;
  export const FiCheck: IconType;
  export const FiX: IconType;
  export const FiAlertCircle: IconType;
  export const FiChevronRight: IconType;
  export const FiLock: IconType;
  export const FiHelpCircle: IconType;
}
