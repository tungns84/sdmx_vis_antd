import React from 'react';
import * as AntIcons from '@ant-design/icons';

/**
 * Icon Mapping Utility
 * Maps MUI icon names to AntD icons
 */

// Type for all AntD icons
type AntIconComponent = typeof AntIcons[keyof typeof AntIcons];

// Icon name mapping
const iconMap: Record<string, string> = {
  // Action icons
  'Delete': 'DeleteOutlined',
  'DeleteForever': 'DeleteFilled',
  'Edit': 'EditOutlined',
  'Add': 'PlusOutlined',
  'AddCircle': 'PlusCircleOutlined',
  'Remove': 'MinusOutlined',
  'RemoveCircle': 'MinusCircleOutlined',
  'Close': 'CloseOutlined',
  'CloseCircle': 'CloseCircleOutlined',
  'Check': 'CheckOutlined',
  'CheckCircle': 'CheckCircleOutlined',
  'Done': 'CheckOutlined',
  'Clear': 'CloseOutlined',
  
  // Navigation icons
  'Menu': 'MenuOutlined',
  'MoreVert': 'MoreOutlined',
  'MoreHoriz': 'EllipsisOutlined',
  'ArrowBack': 'ArrowLeftOutlined',
  'ArrowForward': 'ArrowRightOutlined',
  'ArrowUpward': 'ArrowUpOutlined',
  'ArrowDownward': 'ArrowDownOutlined',
  'KeyboardArrowDown': 'DownOutlined',
  'KeyboardArrowUp': 'UpOutlined',
  'KeyboardArrowLeft': 'LeftOutlined',
  'KeyboardArrowRight': 'RightOutlined',
  'ExpandMore': 'DownOutlined',
  'ExpandLess': 'UpOutlined',
  'ChevronLeft': 'LeftOutlined',
  'ChevronRight': 'RightOutlined',
  'FirstPage': 'VerticalRightOutlined',
  'LastPage': 'VerticalLeftOutlined',
  
  // File icons
  'Save': 'SaveOutlined',
  'SaveAlt': 'DownloadOutlined',
  'Download': 'DownloadOutlined',
  'Upload': 'UploadOutlined',
  'CloudDownload': 'CloudDownloadOutlined',
  'CloudUpload': 'CloudUploadOutlined',
  'AttachFile': 'PaperClipOutlined',
  'Folder': 'FolderOutlined',
  'FolderOpen': 'FolderOpenOutlined',
  'InsertDriveFile': 'FileOutlined',
  'Description': 'FileTextOutlined',
  
  // Common icons
  'Search': 'SearchOutlined',
  'Settings': 'SettingOutlined',
  'Home': 'HomeOutlined',
  'Person': 'UserOutlined',
  'People': 'TeamOutlined',
  'Group': 'TeamOutlined',
  'AccountCircle': 'UserOutlined',
  'Lock': 'LockOutlined',
  'LockOpen': 'UnlockOutlined',
  'Visibility': 'EyeOutlined',
  'VisibilityOff': 'EyeInvisibleOutlined',
  
  // Communication icons
  'Email': 'MailOutlined',
  'Phone': 'PhoneOutlined',
  'Message': 'MessageOutlined',
  'Chat': 'CommentOutlined',
  'Send': 'SendOutlined',
  'Notifications': 'BellOutlined',
  'NotificationsActive': 'BellFilled',
  
  // Content icons
  'Copy': 'CopyOutlined',
  'ContentCopy': 'CopyOutlined',
  'ContentPaste': 'SnippetsOutlined',
  'ContentCut': 'ScissorOutlined',
  'Create': 'EditOutlined',
  'Link': 'LinkOutlined',
  'Share': 'ShareAltOutlined',
  
  // Toggle icons
  'Favorite': 'HeartOutlined',
  'FavoriteBorder': 'HeartOutlined',
  'Star': 'StarOutlined',
  'StarBorder': 'StarOutlined',
  'StarRate': 'StarFilled',
  'ThumbUp': 'LikeOutlined',
  'ThumbDown': 'DislikeOutlined',
  
  // Status icons
  'Info': 'InfoCircleOutlined',
  'InfoOutlined': 'InfoCircleOutlined',
  'Warning': 'WarningOutlined',
  'Error': 'CloseCircleOutlined',
  'ErrorOutline': 'CloseCircleOutlined',
  'Help': 'QuestionCircleOutlined',
  'HelpOutline': 'QuestionCircleOutlined',
  
  // Media icons
  'PlayArrow': 'CaretRightOutlined',
  'PlayCircle': 'PlayCircleOutlined',
  'Pause': 'PauseOutlined',
  'PauseCircle': 'PauseCircleOutlined',
  'Stop': 'BorderOutlined',
  'SkipNext': 'StepForwardOutlined',
  'SkipPrevious': 'StepBackwardOutlined',
  'VolumeUp': 'SoundOutlined',
  'VolumeOff': 'AudioMutedOutlined',
  
  // Other common icons
  'Refresh': 'ReloadOutlined',
  'Sync': 'SyncOutlined',
  'Print': 'PrinterOutlined',
  'ShoppingCart': 'ShoppingCartOutlined',
  'CalendarToday': 'CalendarOutlined',
  'Event': 'CalendarOutlined',
  'Schedule': 'ClockCircleOutlined',
  'AccessTime': 'ClockCircleOutlined',
  'LocationOn': 'EnvironmentOutlined',
  'Place': 'EnvironmentOutlined',
  'Dashboard': 'DashboardOutlined',
  'Code': 'CodeOutlined',
  'FormatListBulleted': 'UnorderedListOutlined',
  'FormatListNumbered': 'OrderedListOutlined',
  'FilterList': 'FilterOutlined',
  'Sort': 'SortAscendingOutlined',
  'Logout': 'LogoutOutlined',
  'Login': 'LoginOutlined',
  'ExitToApp': 'LogoutOutlined',
};

/**
 * Get AntD icon component by MUI icon name
 * 
 * @param muiIconName - MUI icon name (without 'Icon' suffix)
 * @returns AntD icon component or undefined
 * 
 * @example
 * ```tsx
 * const DeleteIcon = getAntIcon('Delete');
 * // Returns DeleteOutlined component
 * ```
 */
export function getAntIcon(muiIconName: string): AntIconComponent | undefined {
  // Remove 'Icon' suffix if present
  const cleanName = muiIconName.replace(/Icon$/, '');
  
  // Get mapped name or use original with 'Outlined' suffix
  const antIconName = iconMap[cleanName] || `${cleanName}Outlined`;
  
  // Get icon from AntIcons
  return (AntIcons as any)[antIconName];
}

/**
 * Icon wrapper component for migration
 * Automatically maps MUI icon names to AntD icons
 * 
 * @example
 * ```tsx
 * // Instead of:
 * import DeleteIcon from '@mui/icons-material/Delete';
 * <DeleteIcon />
 * 
 * // Use:
 * <Icon name="Delete" />
 * ```
 */
export interface IconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  spin?: boolean;
  rotate?: number;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = getAntIcon(name);
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in mapping. Add it to iconMapping.ts`);
    return React.createElement(AntIcons.QuestionCircleOutlined, props);
  }
  
  return React.createElement(IconComponent, props);
};

/**
 * Helper function to migrate icon imports in a file
 * This is for documentation purposes
 * 
 * @example
 * ```tsx
 * // Before:
 * import DeleteIcon from '@mui/icons-material/Delete';
 * import EditIcon from '@mui/icons-material/Edit';
 * 
 * // After:
 * import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
 * 
 * // Or use the Icon wrapper:
 * import { Icon } from '@/utils/iconMapping';
 * <Icon name="Delete" />
 * ```
 */
export function getMigrationGuide(muiIconName: string): string {
  const cleanName = muiIconName.replace(/Icon$/, '');
  const antIconName = iconMap[cleanName] || `${cleanName}Outlined`;
  
  return `
  // MUI:
  import ${muiIconName} from '@mui/icons-material/${cleanName}';
  <${muiIconName} />
  
  // AntD:
  import { ${antIconName} } from '@ant-design/icons';
  <${antIconName} />
  
  // Or use Icon wrapper:
  import { Icon } from '@/utils/iconMapping';
  <Icon name="${cleanName}" />
  `;
}

// Export all AntD icons for convenience
export * from '@ant-design/icons';

// Export a list of all mapped icons for reference
export const mappedIcons = Object.keys(iconMap);

// Default export
export default {
  getAntIcon,
  Icon,
  getMigrationGuide,
  mappedIcons,
  iconMap,
};
