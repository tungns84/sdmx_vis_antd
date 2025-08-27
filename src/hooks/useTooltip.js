import { useState, useCallback } from 'react';
import useEventListener from '../utils/useEventListener';

export default () => {
  const [open, setOpen] = useState(false);
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const handler = useCallback((e) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  }, []);
  useEventListener('keydown', handler);
  return { open, onOpen, onClose };
};
