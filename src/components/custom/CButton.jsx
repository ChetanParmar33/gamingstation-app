import React from 'react';
import { Button } from 'antd';

export const CButton = React.forwardRef((props, ref) => {
  return (
    <Button
      ref={ref}
      {...props}
      style={{
        borderRadius: '8px',
        ...props.style
      }}
    />
  );
});

CButton.displayName = 'CButton';
