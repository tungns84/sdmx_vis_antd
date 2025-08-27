/**
 * Custom hook for toolbar state management
 * Following react rule: Extract reusable logic into custom hooks
 */

import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import {
  ViewerType,
  DisplayMode,
  ActionType,
  ToolbarState,
  DownloadOption,
} from '../types/toolbar.types';
import { VIEWER_TYPES, DISPLAY_MODES, DOWNLOAD_FORMATS } from '../constants/toolbar.constants';

interface UseToolbarOptions {
  initialViewer?: ViewerType;
  initialDisplay?: DisplayMode;
  onViewerChange?: (viewer: ViewerType) => void;
  onDisplayChange?: (display: DisplayMode) => void;
  onDownload?: (format: string) => void;
}

/**
 * Hook for managing toolbar state
 */
export const useToolbar = (options: UseToolbarOptions = {}) => {
  const {
    initialViewer = VIEWER_TYPES.TABLE,
    initialDisplay = DISPLAY_MODES.NAME,
    onViewerChange,
    onDisplayChange,
    onDownload,
  } = options;

  // State management
  const [state, setState] = useState<ToolbarState>({
    viewerId: initialViewer,
    displayMode: initialDisplay,
    actionId: null,
    isFullscreen: false,
    isLoading: false,
  });

  // Viewer change handler
  const handleViewerChange = useCallback((viewer: ViewerType) => {
    setState(prev => ({ ...prev, viewerId: viewer }));
    onViewerChange?.(viewer);
    message.success(`Switched to ${viewer} view`);
  }, [onViewerChange]);

  // Display mode change handler
  const handleDisplayModeChange = useCallback((mode: DisplayMode) => {
    setState(prev => ({ ...prev, displayMode: mode }));
    onDisplayChange?.(mode);
  }, [onDisplayChange]);

  // Action toggle handler
  const handleActionToggle = useCallback((action: ActionType) => {
    setState(prev => ({
      ...prev,
      actionId: prev.actionId === action ? null : action,
    }));
  }, []);

  // Fullscreen toggle handler
  const handleFullscreenToggle = useCallback(() => {
    const toggleFullscreen = async () => {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setState(prev => ({ ...prev, isFullscreen: true }));
      } else {
        await document.exitFullscreen();
        setState(prev => ({ ...prev, isFullscreen: false }));
      }
    };

    toggleFullscreen().catch(err => {
      console.error('Fullscreen error:', err);
      message.error('Failed to toggle fullscreen');
    });
  }, []);

  // Loading state handler
  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setState(prev => ({
        ...prev,
        isFullscreen: !!document.fullscreenElement,
      }));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Download handler
  const handleDownload = useCallback(async (format: string) => {
    setLoading(true);
    try {
      await onDownload?.(format);
      message.success(`Download started: ${format}`);
    } catch (error) {
      message.error(`Download failed: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [onDownload, setLoading]);

  return {
    state,
    handlers: {
      handleViewerChange,
      handleDisplayModeChange,
      handleActionToggle,
      handleFullscreenToggle,
      handleDownload,
      setLoading,
    },
  };
};

/**
 * Hook for keyboard shortcuts
 */
export const useToolbarShortcuts = (handlers: {
  onFullscreen?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onApi?: () => void;
  onCustomize?: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // F11 for fullscreen
      if (event.key === 'F11') {
        event.preventDefault();
        handlers.onFullscreen?.();
        return;
      }

      // Ctrl/Cmd shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'd':
            event.preventDefault();
            handlers.onDownload?.();
            break;
          case 's':
            event.preventDefault();
            handlers.onShare?.();
            break;
          case 'a':
            event.preventDefault();
            handlers.onApi?.();
            break;
          case 'k':
            event.preventDefault();
            handlers.onCustomize?.();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
};

/**
 * Hook for download options
 */
export const useDownloadOptions = (
  viewerType: ViewerType,
  onDownload: (format: string) => void
): DownloadOption[] => {
  const options: DownloadOption[] = [];

  // Table downloads
  if (viewerType === VIEWER_TYPES.TABLE) {
    options.push(
      {
        key: 'excel-selection',
        label: 'Excel (Selection)',
        format: DOWNLOAD_FORMATS.EXCEL,
        handler: () => onDownload(DOWNLOAD_FORMATS.EXCEL),
      },
      {
        key: 'csv-selection',
        label: 'CSV (Selection)',
        format: DOWNLOAD_FORMATS.CSV,
        handler: () => onDownload(DOWNLOAD_FORMATS.CSV),
      },
      {
        key: 'json',
        label: 'JSON',
        format: DOWNLOAD_FORMATS.JSON,
        handler: () => onDownload(DOWNLOAD_FORMATS.JSON),
      }
    );
  }

  // Chart downloads
  if (viewerType === VIEWER_TYPES.CHART) {
    options.push(
      {
        key: 'png',
        label: 'Image (PNG)',
        format: DOWNLOAD_FORMATS.PNG,
        handler: () => onDownload(DOWNLOAD_FORMATS.PNG),
      },
      {
        key: 'svg',
        label: 'Image (SVG)',
        format: DOWNLOAD_FORMATS.SVG,
        handler: () => onDownload(DOWNLOAD_FORMATS.SVG),
      }
    );
  }

  return options;
};
