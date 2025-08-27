/**
 * Shared Components for MUI to AntD Migration
 * 
 * These wrapper components provide a compatibility layer
 * allowing gradual migration from MUI to AntD
 */

// Button components
export { default as Button, IconButton, type ButtonWrapperProps } from './ButtonWrapper';
export { default as ButtonWrapper } from './ButtonWrapper';

// Typography components
export { 
  default as Typography, 
  Title, 
  Text, 
  Paragraph, 
  Link,
  type TypographyWrapperProps 
} from './TypographyWrapper';
export { default as TypographyWrapper } from './TypographyWrapper';

// Layout components
export { 
  Grid, 
  Container, 
  Box,
  Row,
  Col,
  Space,
  Layout,
  type GridProps,
  type ContainerProps,
  type BoxProps
} from './LayoutWrapper';

// Re-export commonly used AntD components
export {
  // Feedback
  Alert,
  message,
  notification,
  Modal,
  Drawer,
  Popover,
  Tooltip,
  
  // Data Entry
  Form,
  Input,
  Select,
  Checkbox,
  Radio,
  Switch,
  DatePicker,
  TimePicker,
  Upload,
  Rate,
  Slider,
  
  // Data Display
  Table,
  List,
  Card,
  Collapse,
  Tabs,
  Tag,
  Badge,
  Avatar,
  Divider,
  Empty,
  
  // Navigation
  Menu,
  Breadcrumb,
  Dropdown,
  Pagination,
  Steps,
  
  // Other
  Spin,
  Progress,
  Result,
  Skeleton,
  ConfigProvider,
  theme,
} from 'antd';

// Icon utilities
export { Icon, getAntIcon, type IconProps } from '../../utils/iconMapping';

/**
 * Migration Helper
 * 
 * Usage in components:
 * 
 * ```tsx
 * // Instead of:
 * import Button from '@mui/material/Button';
 * import Grid from '@mui/material/Grid';
 * import Typography from '@mui/material/Typography';
 * 
 * // Use:
 * import { Button, Grid, Typography } from '@/components/shared';
 * 
 * // The components will work with MUI-style props during migration
 * // and can be gradually updated to AntD style
 * ```
 */
