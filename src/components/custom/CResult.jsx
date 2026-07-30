import React from 'react';
import { Result } from 'antd';

export const CResult = React.forwardRef((props, ref) => {
  return <Result ref={ref} {...props} />;
});

CResult.displayName = 'CResult';
