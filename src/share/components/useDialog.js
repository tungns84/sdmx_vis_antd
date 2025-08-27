import { useState } from 'react';
import * as R from 'ramda';

export const useDialog = ({ id, action }) => {
  const [selectedId, setSelectedId] = useState(undefined);
  const [isOpen, setOpenAlert] = useState(false);

  const handleOpen = () => {
    setOpenAlert(true);
    setSelectedId(id);
  };

  const handleClose = () => {
    setOpenAlert(false);
    setSelectedId(null);
  };

  const handleDelete = (props) => {
    handleClose();
    if (R.is(Function, action)) {
      action(props);
    }
  };

  return {
    selectedId,
    isOpen,
    handleOpen,
    handleClose,
    handleDelete,
  };
};
