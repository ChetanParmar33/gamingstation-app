import React from 'react';
import { Steps } from 'antd';

export const CSteps = React.forwardRef((props, ref) => {
  return <Steps ref={ref} {...props} />;
});

CSteps.displayName = 'CSteps';
