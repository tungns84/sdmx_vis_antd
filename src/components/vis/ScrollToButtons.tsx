import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { UpOutlined, LeftOutlined } from '@ant-design/icons';
import styles from './ScrollToButtons.module.css';

/**
 * ScrollToButtons Component
 * Floating buttons to scroll to top/left
 * Migrated to AntD + TypeScript
 */
const ScrollToButtons: React.FC = () => {
  const [scrollPos, setScrollPos] = useState({
    scrollY: 0,
    scrollX: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos({
        scrollY: window.scrollY,
        scrollX: window.scrollX,
      });
    };

    // Debounced scroll handler
    let timeoutId: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', debouncedScroll);
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToLeft = () => {
    window.scrollTo({
      left: 0,
      behavior: 'smooth',
    });
  };

  const showScrollTop = scrollPos.scrollY > 200;
  const showScrollLeft = scrollPos.scrollX > 200;

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Tooltip title="Scroll to top" placement="left">
          <Button
            type="primary"
            shape="circle"
            icon={<UpOutlined />}
            size="large"
            className={styles.scrollTopButton}
            onClick={scrollToTop}
          />
        </Tooltip>
      )}

      {/* Scroll to Left Button */}
      {showScrollLeft && (
        <Tooltip title="Scroll to left" placement="left">
          <Button
            type="primary"
            shape="circle"
            icon={<LeftOutlined />}
            size="large"
            className={styles.scrollLeftButton}
            onClick={scrollToLeft}
          />
        </Tooltip>
      )}
    </>
  );
};

export default ScrollToButtons;
