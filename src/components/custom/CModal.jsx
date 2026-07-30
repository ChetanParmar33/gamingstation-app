import React from 'react';
import { Modal } from 'antd';

export const CModal = React.forwardRef((props, ref) => {
  return <Modal ref={ref} {...props} />;
});

CModal.displayName = 'CModal';
