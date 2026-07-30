import React from 'react';
import { Tabs } from 'antd';

export const CTabs = React.forwardRef((props, ref) => {
  return <Tabs ref={ref} {...props} />;
});

CTabs.displayName = 'CTabs';
