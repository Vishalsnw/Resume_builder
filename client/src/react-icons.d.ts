// src/react-icons.d.ts

declare module 'react-icons/fi' {
  import { ComponentType, SVGAttributes } from 'react';
  
  export interface IconBaseProps extends SVGAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    title?: string;
  }
  
  export type IconType = ComponentType<IconBaseProps>;
  
  // Icons from previous file
  export const FiLoader: IconType;
  export const FiCheck: IconType;
  export const FiX: IconType;
  export const FiAlertCircle: IconType;
  export const FiChevronRight: IconType;
  export const FiLock: IconType;
  export const FiHelpCircle: IconType;
  
  // New icons from error messages
  export const FiExternalLink: IconType;
  export const FiLink2: IconType;
  export const FiInfo: IconType;
  export const FiAlertTriangle: IconType;
  export const FiChevronDown: IconType;
  
  // Additional common Feather icons that might be used
  export const FiUser: IconType;
  export const FiSettings: IconType;
  export const FiEdit: IconType;
  export const FiTrash: IconType;
  export const FiPlus: IconType;
  export const FiMinus: IconType;
  export const FiSearch: IconType;
  export const FiEye: IconType;
  export const FiEyeOff: IconType;
  export const FiCalendar: IconType;
  export const FiClock: IconType;
  export const FiDownload: IconType;
  export const FiUpload: IconType;
  export const FiLogOut: IconType;
  export const FiLogIn: IconType;
  export const FiMenu: IconType;
  export const FiHome: IconType;
  export const FiSave: IconType;
  export const FiArrowLeft: IconType;
  export const FiArrowRight: IconType;
  export const FiArrowUp: IconType;
  export const FiArrowDown: IconType;
  export const FiMail: IconType;
  export const FiPhone: IconType;
  export const FiStar: IconType;
}
