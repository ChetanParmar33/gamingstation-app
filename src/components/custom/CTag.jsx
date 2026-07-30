import React from 'react';
import { Tag } from 'antd';

export const CTag = React.forwardRef((props, ref) => {
  return <Tag ref={ref} {...props} style={{ borderRadius: '6px', ...props.style }} />;
});

CTag.displayName = 'CTag';
