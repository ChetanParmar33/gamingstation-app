import React from 'react';
import { InputNumber } from 'antd';

export const CInputNumber = React.forwardRef((props, ref) => {
  return <InputNumber ref={ref} {...props} style={{ borderRadius: '8px', ...props.style }} />;
});

CInputNumber.displayName = 'CInputNumber';
