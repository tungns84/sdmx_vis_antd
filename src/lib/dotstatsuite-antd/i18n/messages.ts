/**
 * Translation messages for SDMX Table components
 */

export interface TableMessages {
  // Toolbar
  'toolbar.viewer.table': string;
  'toolbar.viewer.chart': string;
  'toolbar.display.id': string;
  'toolbar.display.name': string;
  'toolbar.display.both': string;
  'toolbar.action.config': string;
  'toolbar.action.share': string;
  'toolbar.action.api': string;
  'toolbar.action.download': string;
  'toolbar.action.filter': string;
  'toolbar.action.fullscreen': string;
  
  // Layout Panel
  'layout.title': string;
  'layout.columns': string;
  'layout.rows': string;
  'layout.sections': string;
  'layout.preview': string;
  'layout.reset': string;
  'layout.apply': string;
  'layout.cancel': string;
  'layout.drag.hint': string;
  
  // Filter Panel
  'filter.title': string;
  'filter.search': string;
  'filter.selectAll': string;
  'filter.clear': string;
  'filter.clearAll': string;
  'filter.apply': string;
  'filter.cancel': string;
  'filter.reset': string;
  'filter.noData': string;
  'filter.selected': string;
  'filter.available': string;
  'filter.inTable': string;
  
  // Table
  'table.loading': string;
  'table.noData': string;
  'table.error': string;
  'table.unit': string;
  'table.symbols': string;
  'table.confidential': string;
  'table.notAvailable': string;
  'table.provisional': string;
  'table.estimated': string;
  'table.forecast': string;
  'table.missing': string;
  
  // Share Panel
  'share.title': string;
  'share.url': string;
  'share.embed': string;
  'share.copy': string;
  'share.copied': string;
  
  // API Panel
  'api.title': string;
  'api.dataUrl': string;
  'api.metadataUrl': string;
  'api.documentation': string;
  
  // Messages
  'message.layoutUpdated': string;
  'message.filtersApplied': string;
  'message.downloadStarted': string;
  'message.error': string;
  'message.success': string;
  'message.loading': string;
  'message.switchingLanguage': string;
}

// English messages
export const enMessages: TableMessages = {
  // Toolbar
  'toolbar.viewer.table': 'Table',
  'toolbar.viewer.chart': 'Chart',
  'toolbar.display.id': 'ID',
  'toolbar.display.name': 'Name',
  'toolbar.display.both': 'Both',
  'toolbar.action.config': 'Configure',
  'toolbar.action.share': 'Share',
  'toolbar.action.api': 'API',
  'toolbar.action.download': 'Download',
  'toolbar.action.filter': 'Filter',
  'toolbar.action.fullscreen': 'Fullscreen',
  
  // Layout Panel
  'layout.title': 'Table Layout',
  'layout.columns': 'Column Headers',
  'layout.rows': 'Row Headers',
  'layout.sections': 'Row Sections',
  'layout.preview': 'Table Preview',
  'layout.reset': 'Reset',
  'layout.apply': 'Apply',
  'layout.cancel': 'Cancel',
  'layout.drag.hint': 'Drag dimensions to rearrange',
  
  // Filter Panel
  'filter.title': 'Filters',
  'filter.search': 'Search...',
  'filter.selectAll': 'Select All',
  'filter.clear': 'Clear',
  'filter.clearAll': 'Clear All',
  'filter.apply': 'Apply',
  'filter.cancel': 'Cancel',
  'filter.reset': 'Reset',
  'filter.noData': 'No data matches the current filters',
  'filter.selected': 'selected',
  'filter.available': 'available',
  'filter.inTable': 'In Table',
  
  // Table
  'table.loading': 'Loading SDMX data...',
  'table.noData': 'No data available',
  'table.error': 'Error loading data',
  'table.unit': 'Unit',
  'table.symbols': 'Symbols',
  'table.confidential': 'Confidential',
  'table.notAvailable': 'Not available',
  'table.provisional': 'Provisional',
  'table.estimated': 'Estimated',
  'table.forecast': 'Forecast',
  'table.missing': 'Missing',
  
  // Share Panel
  'share.title': 'Share',
  'share.url': 'URL',
  'share.embed': 'Embed Code',
  'share.copy': 'Copy',
  'share.copied': 'Copied!',
  
  // API Panel
  'api.title': 'API Access',
  'api.dataUrl': 'Data URL',
  'api.metadataUrl': 'Metadata URL',
  'api.documentation': 'API Documentation',
  
  // Messages
  'message.layoutUpdated': 'Layout updated',
  'message.filtersApplied': 'Filters applied',
  'message.downloadStarted': 'Download started',
  'message.error': 'An error occurred',
  'message.success': 'Operation successful',
  'message.loading': 'Loading...',
  'message.switchingLanguage': 'Switching language...',
};

// Vietnamese messages
export const viMessages: TableMessages = {
  // Toolbar
  'toolbar.viewer.table': 'Bảng',
  'toolbar.viewer.chart': 'Biểu đồ',
  'toolbar.display.id': 'Mã',
  'toolbar.display.name': 'Tên',
  'toolbar.display.both': 'Cả hai',
  'toolbar.action.config': 'Cấu hình',
  'toolbar.action.share': 'Chia sẻ',
  'toolbar.action.api': 'API',
  'toolbar.action.download': 'Tải xuống',
  'toolbar.action.filter': 'Lọc',
  'toolbar.action.fullscreen': 'Toàn màn hình',
  
  // Layout Panel
  'layout.title': 'Bố cục bảng',
  'layout.columns': 'Tiêu đề cột',
  'layout.rows': 'Tiêu đề hàng',
  'layout.sections': 'Phần hàng',
  'layout.preview': 'Xem trước',
  'layout.reset': 'Đặt lại',
  'layout.apply': 'Áp dụng',
  'layout.cancel': 'Hủy',
  'layout.drag.hint': 'Kéo để sắp xếp lại',
  
  // Filter Panel
  'filter.title': 'Bộ lọc',
  'filter.search': 'Tìm kiếm...',
  'filter.selectAll': 'Chọn tất cả',
  'filter.clear': 'Xóa',
  'filter.clearAll': 'Xóa tất cả',
  'filter.apply': 'Áp dụng',
  'filter.cancel': 'Hủy',
  'filter.reset': 'Đặt lại',
  'filter.noData': 'Không có dữ liệu phù hợp với bộ lọc',
  'filter.selected': 'đã chọn',
  'filter.available': 'có sẵn',
  'filter.inTable': 'Trong bảng',
  
  // Table
  'table.loading': 'Đang tải dữ liệu SDMX...',
  'table.noData': 'Không có dữ liệu',
  'table.error': 'Lỗi khi tải dữ liệu',
  'table.unit': 'Đơn vị',
  'table.symbols': 'Ký hiệu',
  'table.confidential': 'Bảo mật',
  'table.notAvailable': 'Không có sẵn',
  'table.provisional': 'Tạm thời',
  'table.estimated': 'Ước tính',
  'table.forecast': 'Dự báo',
  'table.missing': 'Thiếu',
  
  // Share Panel
  'share.title': 'Chia sẻ',
  'share.url': 'Đường dẫn',
  'share.embed': 'Mã nhúng',
  'share.copy': 'Sao chép',
  'share.copied': 'Đã sao chép!',
  
  // API Panel
  'api.title': 'Truy cập API',
  'api.dataUrl': 'URL dữ liệu',
  'api.metadataUrl': 'URL siêu dữ liệu',
  'api.documentation': 'Tài liệu API',
  
  // Messages
  'message.layoutUpdated': 'Đã cập nhật bố cục',
  'message.filtersApplied': 'Đã áp dụng bộ lọc',
  'message.downloadStarted': 'Đã bắt đầu tải xuống',
  'message.error': 'Đã xảy ra lỗi',
  'message.success': 'Thành công',
  'message.loading': 'Đang tải...',
  'message.switchingLanguage': 'Đang chuyển ngôn ngữ...',
};

// French messages
export const frMessages: TableMessages = {
  // Toolbar
  'toolbar.viewer.table': 'Tableau',
  'toolbar.viewer.chart': 'Graphique',
  'toolbar.display.id': 'ID',
  'toolbar.display.name': 'Nom',
  'toolbar.display.both': 'Les deux',
  'toolbar.action.config': 'Configurer',
  'toolbar.action.share': 'Partager',
  'toolbar.action.api': 'API',
  'toolbar.action.download': 'Télécharger',
  'toolbar.action.filter': 'Filtrer',
  'toolbar.action.fullscreen': 'Plein écran',
  
  // Layout Panel
  'layout.title': 'Disposition du tableau',
  'layout.columns': 'En-têtes de colonnes',
  'layout.rows': 'En-têtes de lignes',
  'layout.sections': 'Sections de lignes',
  'layout.preview': 'Aperçu',
  'layout.reset': 'Réinitialiser',
  'layout.apply': 'Appliquer',
  'layout.cancel': 'Annuler',
  'layout.drag.hint': 'Glissez pour réorganiser',
  
  // Filter Panel
  'filter.title': 'Filtres',
  'filter.search': 'Rechercher...',
  'filter.selectAll': 'Tout sélectionner',
  'filter.clear': 'Effacer',
  'filter.clearAll': 'Tout effacer',
  'filter.apply': 'Appliquer',
  'filter.cancel': 'Annuler',
  'filter.reset': 'Réinitialiser',
  'filter.noData': 'Aucune donnée ne correspond aux filtres actuels',
  'filter.selected': 'sélectionné(s)',
  'filter.available': 'disponible(s)',
  'filter.inTable': 'Dans le tableau',
  
  // Table
  'table.loading': 'Chargement des données SDMX...',
  'table.noData': 'Aucune donnée disponible',
  'table.error': 'Erreur lors du chargement des données',
  'table.unit': 'Unité',
  'table.symbols': 'Symboles',
  'table.confidential': 'Confidentiel',
  'table.notAvailable': 'Non disponible',
  'table.provisional': 'Provisoire',
  'table.estimated': 'Estimé',
  'table.forecast': 'Prévision',
  'table.missing': 'Manquant',
  
  // Share Panel
  'share.title': 'Partager',
  'share.url': 'URL',
  'share.embed': 'Code d\'intégration',
  'share.copy': 'Copier',
  'share.copied': 'Copié!',
  
  // API Panel
  'api.title': 'Accès API',
  'api.dataUrl': 'URL des données',
  'api.metadataUrl': 'URL des métadonnées',
  'api.documentation': 'Documentation API',
  
  // Messages
  'message.layoutUpdated': 'Disposition mise à jour',
  'message.filtersApplied': 'Filtres appliqués',
  'message.downloadStarted': 'Téléchargement commencé',
  'message.error': 'Une erreur s\'est produite',
  'message.success': 'Opération réussie',
  'message.loading': 'Chargement...',
  'message.switchingLanguage': 'Changement de langue...',
};

// Export all messages by locale
export const messages: Record<string, TableMessages> = {
  en: enMessages,
  vi: viMessages,
  fr: frMessages,
};

// Get message by key and locale
export const getMessage = (key: keyof TableMessages, locale: string = 'en'): string => {
  const localeMessages = messages[locale] || messages.en;
  return localeMessages[key] || key;
};
