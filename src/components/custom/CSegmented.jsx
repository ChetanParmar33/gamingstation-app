import React from 'react';
import { Segmented } from 'antd';

export const CSegmented = React.forwardRef((props, ref) => {
  return <Segmented ref={ref} {...props} style={{ borderRadius: '12px', ...props.style }} />;
});

CSegmented.displayName = 'CSegmented';
