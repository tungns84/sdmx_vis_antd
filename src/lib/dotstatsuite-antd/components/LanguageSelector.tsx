import React from 'react';
import { Select, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

const { Option } = Select;

export interface Language {
  code: string;
  name: string;
  flag?: string;
}

export interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  languages?: Language[];
  style?: React.CSSProperties;
  className?: string;
  showFlag?: boolean;
  showIcon?: boolean;
}

const DEFAULT_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'km', name: 'ភាសាខ្មែរ', flag: '🇰🇭' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
];

/**
 * Language selector component for i18n
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  languages = DEFAULT_LANGUAGES,
  style,
  className,
  showFlag = true,
  showIcon = true,
}) => {
  const selectedLang = languages.find(lang => lang.code === value);

  return (
    <Select
      value={value}
      onChange={onChange}
      style={{ width: 150, ...style }}
      className={className}
      suffixIcon={showIcon ? <GlobalOutlined /> : undefined}
    >
      {languages.map(lang => (
        <Option key={lang.code} value={lang.code}>
          <Space size={4}>
            {showFlag && lang.flag && <span style={{ fontSize: 16 }}>{lang.flag}</span>}
            <span>{lang.name}</span>
          </Space>
        </Option>
      ))}
    </Select>
  );
};

/**
 * Compact language selector (only flags)
 */
export const CompactLanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  languages = DEFAULT_LANGUAGES,
  style,
  className,
}) => {
  const selectedLang = languages.find(lang => lang.code === value) || languages[0];

  return (
    <Select
      value={value}
      onChange={onChange}
      style={{ width: 60, ...style }}
      className={className}
      dropdownMatchSelectWidth={false}
    >
      {languages.map(lang => (
        <Option key={lang.code} value={lang.code}>
          <Space size={4}>
            {lang.flag && <span style={{ fontSize: 20 }}>{lang.flag}</span>}
            <span style={{ fontSize: 12 }}>{lang.code.toUpperCase()}</span>
          </Space>
        </Option>
      ))}
    </Select>
  );
};

export default LanguageSelector;
