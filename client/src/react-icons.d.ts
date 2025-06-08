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
  
  // Icons from errors
  export const FiExternalLink: IconType;
  export const FiLink2: IconType;
  export const FiInfo: IconType;
  export const FiAlertTriangle: IconType;
  export const FiChevronDown: IconType;
  export const FiMaximize2: IconType;
  export const FiMinimize2: IconType;
  export const FiCheckCircle: IconType; // Added the missing icon
  
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
  export const FiChevronLeft: IconType;
  export const FiChevronUp: IconType;
  export const FiMoreVertical: IconType;
  export const FiMoreHorizontal: IconType;
  export const FiRefresh: IconType;
  export const FiGithub: IconType;
  export const FiLinkedin: IconType;
  export const FiTwitter: IconType;
  export const FiDollarSign: IconType;
  export const FiFileText: IconType;
  
  // All other Feather icons
  export const FiActivity: IconType;
  export const FiAirplay: IconType;
  export const FiAlertOctagon: IconType;
  export const FiAnchor: IconType;
  export const FiAperture: IconType;
  export const FiArchive: IconType;
  export const FiArrowDownCircle: IconType;
  export const FiArrowDownLeft: IconType;
  export const FiArrowDownRight: IconType;
  export const FiArrowLeftCircle: IconType;
  export const FiArrowRightCircle: IconType;
  export const FiArrowUpCircle: IconType;
  export const FiArrowUpLeft: IconType;
  export const FiArrowUpRight: IconType;
  export const FiBell: IconType;
  export const FiBellOff: IconType;
  export const FiBluetooth: IconType;
  export const FiBold: IconType;
  export const FiBook: IconType;
  export const FiBookmark: IconType;
  export const FiBox: IconType;
  export const FiBriefcase: IconType;
  export const FiCamera: IconType;
  export const FiCameraOff: IconType;
  export const FiChevronsDown: IconType;
  export const FiChevronsLeft: IconType;
  export const FiChevronsRight: IconType;
  export const FiChevronsUp: IconType;
  export const FiCloud: IconType;
  export const FiCloudDrizzle: IconType;
  export const FiCloudLightning: IconType;
  export const FiCloudOff: IconType;
  export const FiCloudRain: IconType;
  export const FiCloudSnow: IconType;
  export const FiCode: IconType;
  export const FiCodepen: IconType;
  export const FiCodesandbox: IconType;
  export const FiCoffee: IconType;
  export const FiColumns: IconType;
  export const FiCommand: IconType;
  export const FiCompass: IconType;
  export const FiCopy: IconType;
  export const FiCornerDownLeft: IconType;
  export const FiCornerDownRight: IconType;
  export const FiCornerLeftDown: IconType;
  export const FiCornerLeftUp: IconType;
  export const FiCornerRightDown: IconType;
  export const FiCornerRightUp: IconType;
  export const FiCornerUpLeft: IconType;
  export const FiCornerUpRight: IconType;
  export const FiCpu: IconType;
  export const FiCreditCard: IconType;
  export const FiCrop: IconType;
  export const FiCrosshair: IconType;
  export const FiDatabase: IconType;
  export const FiDelete: IconType;
  export const FiDisc: IconType;
  export const FiDivide: IconType;
  export const FiDivideCircle: IconType;
  export const FiDivideSquare: IconType;
}
