/**
 * Table Style Constants
 * Following clean-code rule: Constants Over Magic Numbers
 */

// Color Palette
export const TABLE_COLORS = {
  HEADER: {
    PRIMARY: '#0050b3',        // Column header background
    PRIMARY_LIGHT: '#f5f5f5',  // Column header text
    SECONDARY: '#f5f5f5',      // Row header background
    SECONDARY_DARK: '#333',    // Row header text
    BORDER: '#003a8c',         // Header border
    BORDER_LIGHT: '#d9d9d9',   // Light border
  },
  SECTION: {
    BACKGROUND: '#d4e8fc',
    BORDER: '#69c0ff',
  },
  DATA: {
    BACKGROUND: 'white',
    TEXT: '#333',
    BORDER: '#f0f0f0',
  },
  ROW: {
    BACKGROUND: '#f5f5f5',
    BORDER: '#d9d9d9',
  },
} as const;

// Spacing Values
export const TABLE_SPACING = {
  CELL_PADDING: '6px 8px',
  HEADER_PADDING: '8px 12px',
  SECTION_PADDING: '8px',
} as const;

// Font Settings
export const TABLE_FONTS = {
  SIZE: '12px',
  FAMILY: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  WEIGHT: {
    NORMAL: 'normal',
    BOLD: 'bold',
  },
  STYLE: {
    NORMAL: 'normal',
    ITALIC: 'italic',
  },
} as const;

// Alignment Settings
export const TABLE_ALIGNMENT = {
  COLUMN_NAME: 'right' as const,    // Top-Right
  COLUMN_VALUE: 'center' as const,   // Top-Center
  ROW_NAME: 'left' as const,         // Top-Left
  ROW_VALUE: 'left' as const,        // Top-Left
  UNIT: 'center' as const,           // Top-Center
  DATA: 'right' as const,            // Top-Right
  SECTION: 'left' as const,          // Top-Left
  VERTICAL: 'top' as const,
} as const;

// Number Formatting
export const NUMBER_FORMAT = {
  LOCALE: 'en-US',
  MIN_FRACTION_DIGITS: 1,
  MAX_FRACTION_DIGITS: 1,
  THOUSAND_SEPARATOR: ' ',
} as const;

// Special Values
export const TABLE_SYMBOLS = {
  UNIT_DEFAULT: 'Euro, Millions',
  SYMBOL_PLACEHOLDER: '●',
  SECTION_SEPARATOR: ' • ',
} as const;

// Column Calculations
export const COLUMN_CALCULATIONS = {
  UNIT_COLUMN_COUNT: 1,
  SYMBOL_COLUMN_COUNT: 1,
} as const;
